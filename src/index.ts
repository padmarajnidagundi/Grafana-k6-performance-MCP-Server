#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
  ErrorCode,
  McpError
} from '@modelcontextprotocol/sdk/types.js';
import { spawn } from 'child_process';
import { readFile, writeFile, mkdir, readdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Default directory for k6 tests
const K6_TESTS_DIR = process.env.K6_TESTS_DIR || join(process.cwd(), 'k6-tests');
const K6_RESULTS_DIR = process.env.K6_RESULTS_DIR || join(process.cwd(), 'k6-results');

interface K6TestResult {
  timestamp: string;
  testName: string;
  status: string;
  output: string;
  metrics?: any;
}

// Ensure directories exist
async function ensureDirectories() {
  try {
    if (!existsSync(K6_TESTS_DIR)) {
      await mkdir(K6_TESTS_DIR, { recursive: true });
    }
    if (!existsSync(K6_RESULTS_DIR)) {
      await mkdir(K6_RESULTS_DIR, { recursive: true });
    }
  } catch (error) {
    console.error('Error creating directories:', error);
  }
}

// Execute k6 command
async function executeK6Command(args: string[]): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  return new Promise((resolve, reject) => {
    const k6Process = spawn('k6', args);
    let stdout = '';
    let stderr = '';

    k6Process.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    k6Process.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    k6Process.on('close', (code) => {
      resolve({
        stdout,
        stderr,
        exitCode: code || 0
      });
    });

    k6Process.on('error', (error) => {
      reject(error);
    });
  });
}

// Create MCP server
const server = new Server(
  {
    name: 'grafana-k6-performance-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {}
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'create_k6_test',
        description: 'Create a new k6 performance test script',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Name of the test file (without .js extension)'
            },
            script: {
              type: 'string',
              description: 'The k6 test script content'
            }
          },
          required: ['name', 'script']
        }
      },
      {
        name: 'run_k6_test',
        description: 'Run a k6 performance test',
        inputSchema: {
          type: 'object',
          properties: {
            testFile: {
              type: 'string',
              description: 'Name of the test file to run (e.g., test.js)'
            },
            vus: {
              type: 'number',
              description: 'Number of virtual users (default: 10)'
            },
            duration: {
              type: 'string',
              description: 'Test duration (e.g., "30s", "5m") (default: "30s")'
            },
            iterations: {
              type: 'number',
              description: 'Number of iterations per VU (optional)'
            }
          },
          required: ['testFile']
        }
      },
      {
        name: 'list_k6_tests',
        description: 'List all available k6 test scripts',
        inputSchema: {
          type: 'object',
          properties: {}
        }
      },
      {
        name: 'get_test_results',
        description: 'Get results from previous k6 test runs',
        inputSchema: {
          type: 'object',
          properties: {
            testName: {
              type: 'string',
              description: 'Name of the test to get results for (optional, returns all if not specified)'
            }
          }
        }
      },
      {
        name: 'generate_load_test',
        description: 'Generate a k6 load test script with common patterns',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Name of the test'
            },
            url: {
              type: 'string',
              description: 'Target URL to test'
            },
            method: {
              type: 'string',
              description: 'HTTP method (GET, POST, PUT, DELETE)',
              enum: ['GET', 'POST', 'PUT', 'DELETE']
            },
            vus: {
              type: 'number',
              description: 'Number of virtual users (default: 10)'
            },
            duration: {
              type: 'string',
              description: 'Test duration (default: "30s")'
            }
          },
          required: ['name', 'url']
        }
      }
    ]
  };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    await ensureDirectories();

    switch (request.params.name) {
      case 'create_k6_test': {
        const { name, script } = request.params.arguments as { name: string; script: string };
        const fileName = name.endsWith('.js') ? name : `${name}.js`;
        const filePath = join(K6_TESTS_DIR, fileName);
        
        await writeFile(filePath, script, 'utf-8');
        
        return {
          content: [
            {
              type: 'text',
              text: `Successfully created k6 test: ${fileName}\nPath: ${filePath}`
            }
          ]
        };
      }

      case 'run_k6_test': {
        const { testFile, vus = 10, duration = '30s', iterations } = request.params.arguments as {
          testFile: string;
          vus?: number;
          duration?: string;
          iterations?: number;
        };
        
        const testPath = join(K6_TESTS_DIR, testFile);
        
        if (!existsSync(testPath)) {
          throw new McpError(
            ErrorCode.InvalidRequest,
            `Test file not found: ${testFile}`
          );
        }

        const args = ['run'];
        
        if (iterations) {
          args.push('--iterations', iterations.toString());
        } else {
          args.push('--vus', vus.toString(), '--duration', duration);
        }
        
        args.push(testPath);

        const result = await executeK6Command(args);
        
        // Save results
        const resultData: K6TestResult = {
          timestamp: new Date().toISOString(),
          testName: testFile,
          status: result.exitCode === 0 ? 'success' : 'failed',
          output: result.stdout + result.stderr
        };
        
        const resultFileName = `${testFile.replace('.js', '')}-${Date.now()}.json`;
        const resultPath = join(K6_RESULTS_DIR, resultFileName);
        await writeFile(resultPath, JSON.stringify(resultData, null, 2), 'utf-8');

        return {
          content: [
            {
              type: 'text',
              text: `Test execution completed!\n\nStatus: ${resultData.status}\nResults saved to: ${resultFileName}\n\n${resultData.output}`
            }
          ]
        };
      }

      case 'list_k6_tests': {
        const files = existsSync(K6_TESTS_DIR) ? await readdir(K6_TESTS_DIR) : [];
        const jsFiles = files.filter(f => f.endsWith('.js'));
        
        if (jsFiles.length === 0) {
          return {
            content: [
              {
                type: 'text',
                text: 'No k6 test files found. Create one using the create_k6_test tool.'
              }
            ]
          };
        }

        return {
          content: [
            {
              type: 'text',
              text: `Available k6 tests (${jsFiles.length}):\n\n${jsFiles.map(f => `- ${f}`).join('\n')}`
            }
          ]
        };
      }

      case 'get_test_results': {
        const { testName } = request.params.arguments as { testName?: string };
        
        if (!existsSync(K6_RESULTS_DIR)) {
          return {
            content: [
              {
                type: 'text',
                text: 'No test results found. Run a test first using run_k6_test.'
              }
            ]
          };
        }

        const files = await readdir(K6_RESULTS_DIR);
        const resultFiles = files.filter(f => f.endsWith('.json'));
        
        let filteredFiles = resultFiles;
        if (testName) {
          const searchName = testName.replace('.js', '');
          filteredFiles = resultFiles.filter(f => f.startsWith(searchName));
        }

        if (filteredFiles.length === 0) {
          return {
            content: [
              {
                type: 'text',
                text: testName 
                  ? `No results found for test: ${testName}`
                  : 'No test results found.'
              }
            ]
          };
        }

        const results = await Promise.all(
          filteredFiles.map(async (file) => {
            const content = await readFile(join(K6_RESULTS_DIR, file), 'utf-8');
            return JSON.parse(content) as K6TestResult;
          })
        );

        const formattedResults = results.map(r => 
          `Test: ${r.testName}\nTimestamp: ${r.timestamp}\nStatus: ${r.status}\n---`
        ).join('\n\n');

        return {
          content: [
            {
              type: 'text',
              text: `Found ${results.length} test result(s):\n\n${formattedResults}`
            }
          ]
        };
      }

      case 'generate_load_test': {
        const { name, url, method = 'GET', vus = 10, duration = '30s' } = request.params.arguments as {
          name: string;
          url: string;
          method?: string;
          vus?: number;
          duration?: string;
        };

        const script = `import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: ${vus},
  duration: '${duration}',
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
    http_req_failed: ['rate<0.1'],    // Error rate should be less than 10%
  },
};

export default function () {
  const response = http.${method.toLowerCase()}('${url}');
  
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  
  sleep(1);
}
`;

        const fileName = name.endsWith('.js') ? name : `${name}.js`;
        const filePath = join(K6_TESTS_DIR, fileName);
        
        await writeFile(filePath, script, 'utf-8');

        return {
          content: [
            {
              type: 'text',
              text: `Successfully generated k6 load test: ${fileName}\n\nConfiguration:\n- URL: ${url}\n- Method: ${method}\n- VUs: ${vus}\n- Duration: ${duration}\n\nYou can now run it using run_k6_test with testFile: "${fileName}"`
            }
          ]
        };
      }

      default:
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${request.params.name}`
        );
    }
  } catch (error) {
    if (error instanceof McpError) {
      throw error;
    }
    throw new McpError(
      ErrorCode.InternalError,
      `Error executing tool: ${error instanceof Error ? error.message : String(error)}`
    );
  }
});

// List available resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  await ensureDirectories();
  
  const resources = [];
  
  // Add test files as resources
  if (existsSync(K6_TESTS_DIR)) {
    const testFiles = await readdir(K6_TESTS_DIR);
    const jsFiles = testFiles.filter(f => f.endsWith('.js'));
    
    for (const file of jsFiles) {
      resources.push({
        uri: `k6://tests/${file}`,
        name: `k6 test: ${file}`,
        mimeType: 'application/javascript',
        description: `k6 performance test script: ${file}`
      });
    }
  }
  
  // Add result files as resources
  if (existsSync(K6_RESULTS_DIR)) {
    const resultFiles = await readdir(K6_RESULTS_DIR);
    const jsonFiles = resultFiles.filter(f => f.endsWith('.json'));
    
    for (const file of jsonFiles) {
      resources.push({
        uri: `k6://results/${file}`,
        name: `Test result: ${file}`,
        mimeType: 'application/json',
        description: `k6 test execution result: ${file}`
      });
    }
  }

  return { resources };
});

// Read resource content
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const uri = request.params.uri;
  
  if (uri.startsWith('k6://tests/')) {
    const fileName = uri.replace('k6://tests/', '');
    const filePath = join(K6_TESTS_DIR, fileName);
    
    if (!existsSync(filePath)) {
      throw new McpError(ErrorCode.InvalidRequest, `Test file not found: ${fileName}`);
    }
    
    const content = await readFile(filePath, 'utf-8');
    return {
      contents: [
        {
          uri,
          mimeType: 'application/javascript',
          text: content
        }
      ]
    };
  } else if (uri.startsWith('k6://results/')) {
    const fileName = uri.replace('k6://results/', '');
    const filePath = join(K6_RESULTS_DIR, fileName);
    
    if (!existsSync(filePath)) {
      throw new McpError(ErrorCode.InvalidRequest, `Result file not found: ${fileName}`);
    }
    
    const content = await readFile(filePath, 'utf-8');
    return {
      contents: [
        {
          uri,
          mimeType: 'application/json',
          text: content
        }
      ]
    };
  }
  
  throw new McpError(ErrorCode.InvalidRequest, `Unknown resource URI: ${uri}`);
});

// Start the server
async function main() {
  await ensureDirectories();
  
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.error('Grafana k6 Performance MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
