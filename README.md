# Grafana k6 Performance MCP Server

A Model Context Protocol (MCP) server that provides tools for creating, running, and managing [Grafana k6](https://k6.io/) performance tests. This server enables AI assistants and other MCP clients to interact with k6 for load testing and performance analysis.

## Features

- 🚀 **Create k6 Tests**: Generate custom k6 performance test scripts
- ▶️ **Run Tests**: Execute k6 tests with configurable parameters (VUs, duration, iterations)
- 📊 **View Results**: Access test execution results and metrics
- 📝 **List Tests**: See all available k6 test scripts
- 🔧 **Generate Load Tests**: Quick generation of common load test patterns
- 📦 **Resources**: Access test scripts and results as MCP resources

## Prerequisites

- Node.js 18 or higher
- [k6](https://k6.io/docs/get-started/installation/) installed and available in PATH

### Installing k6

**macOS:**
```bash
brew install k6
```

**Linux:**
```bash
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```

**Windows:**
```powershell
choco install k6
```

Or download from [k6 releases](https://github.com/grafana/k6/releases).

## Installation

```bash
npm install
npm run build
```

## Configuration

The server uses the following environment variables (optional):

- `K6_TESTS_DIR`: Directory for storing k6 test scripts (default: `./k6-tests`)
- `K6_RESULTS_DIR`: Directory for storing test results (default: `./k6-results`)

## Usage with MCP Clients

### Claude Desktop

Add to your Claude Desktop configuration file:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`

**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "grafana-k6-performance": {
      "command": "node",
      "args": ["/absolute/path/to/Grafana-k6-performance-MCP-Server/build/index.js"],
      "env": {
        "K6_TESTS_DIR": "/path/to/k6-tests",
        "K6_RESULTS_DIR": "/path/to/k6-results"
      }
    }
  }
}
```

### Other MCP Clients

Run the server using stdio transport:

```bash
node build/index.js
```

## Available Tools

### 1. create_k6_test

Create a new k6 performance test script.

**Parameters:**
- `name` (string, required): Name of the test file (without .js extension)
- `script` (string, required): The k6 test script content

**Example:**
```javascript
{
  "name": "api-test",
  "script": "import http from 'k6/http';\nexport default function() {\n  http.get('https://api.example.com');\n}"
}
```

### 2. run_k6_test

Run a k6 performance test.

**Parameters:**
- `testFile` (string, required): Name of the test file to run (e.g., "test.js")
- `vus` (number, optional): Number of virtual users (default: 10)
- `duration` (string, optional): Test duration (e.g., "30s", "5m") (default: "30s")
- `iterations` (number, optional): Number of iterations per VU (overrides duration)

**Example:**
```javascript
{
  "testFile": "api-test.js",
  "vus": 50,
  "duration": "2m"
}
```

### 3. list_k6_tests

List all available k6 test scripts.

**Parameters:** None

### 4. get_test_results

Get results from previous k6 test runs.

**Parameters:**
- `testName` (string, optional): Name of the test to get results for (returns all if not specified)

**Example:**
```javascript
{
  "testName": "api-test.js"
}
```

### 5. generate_load_test

Generate a k6 load test script with common patterns.

**Parameters:**
- `name` (string, required): Name of the test
- `url` (string, required): Target URL to test
- `method` (string, optional): HTTP method (GET, POST, PUT, DELETE) (default: GET)
- `vus` (number, optional): Number of virtual users (default: 10)
- `duration` (string, optional): Test duration (default: "30s")

**Example:**
```javascript
{
  "name": "quick-load-test",
  "url": "https://api.example.com/endpoint",
  "method": "POST",
  "vus": 100,
  "duration": "5m"
}
```

## Resources

The server exposes k6 test scripts and results as MCP resources:

- **Test Scripts**: `k6://tests/{filename}` - Access k6 test script content
- **Test Results**: `k6://results/{filename}` - Access test execution results

## Example k6 Test Script

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.1'],
  },
};

export default function () {
  const response = http.get('https://test.k6.io');
  
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  
  sleep(1);
}
```

## Development

### Build
```bash
npm run build
```

### Watch Mode
```bash
npm run watch
```

## Use Cases

- **API Performance Testing**: Test REST APIs under various load conditions
- **Load Testing**: Simulate multiple concurrent users
- **Stress Testing**: Find breaking points of your application
- **Spike Testing**: Test how your system handles sudden traffic spikes
- **Endurance Testing**: Verify system stability over extended periods
- **Performance Regression Testing**: Ensure new changes don't degrade performance

## Troubleshooting

### k6 not found
Ensure k6 is installed and available in your PATH:
```bash
k6 version
```

### Permission Issues
Ensure the k6 tests and results directories are writable:
```bash
chmod -R 755 k6-tests k6-results
```

## License

MIT

## Resources

- [k6 Documentation](https://k6.io/docs/)
- [MCP Documentation](https://modelcontextprotocol.io/)
- [k6 Examples](https://k6.io/docs/examples/)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
