# Grafana k6 Performance MCP Server

[![CI](https://github.com/padmarajnidagundi/Grafana-k6-performance-MCP-Server/workflows/CI/badge.svg)](https://github.com/padmarajnidagundi/Grafana-k6-performance-MCP-Server/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![k6](https://img.shields.io/badge/k6-v0.49-7D64FF?logo=k6&logoColor=white)](https://k6.io/)
[![MCP](https://img.shields.io/badge/MCP-v1.25.3-blue)](https://modelcontextprotocol.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

> **First AI-Native Performance Testing MCP Server** — Integrate k6 load testing with Claude, ChatGPT, and other AI assistants

## AI-Powered Load Testing for Modern APIs

**Transform natural language into production-ready performance tests.** The Grafana k6 Performance MCP Server is the first AI-native Model Context Protocol (MCP) server for [Grafana k6](https://k6.io/) load testing. Built for the AI era, it enables developers, QA engineers, and DevOps teams to create, execute, and analyze performance tests through conversational AI interfaces.

### **What Makes This Special?**

- **AI-First Design**: Natural language → k6 test scripts in seconds
- **MCP Native**: Seamless integration with Claude Desktop, Cline, and other MCP clients
- **Production-Ready**: Comprehensive test templates for REST, GraphQL, WebSocket, and gRPC
- **Docker Ready**: Full containerization with monitoring stack (Grafana, InfluxDB, Prometheus)
- **CI/CD Native**: GitHub Actions workflows included for automated testing
- **Advanced Prompts**: Pre-built conversational workflows for common testing scenarios
- **Extensible**: Modular AI skills, agents, and chat modes
- **Multi-Protocol**: REST, GraphQL, WebSocket, gRPC support out-of-the-box

## Repository Structure

```
├── AI/                  # Modular AI components (agents, chatmodes, skills, MCP resources)
│   ├── agent/
│   ├── chatmodes/
│   ├── skills/
│   └── MCP/
├── examples/            # k6 test scripts and templates (api, load, ramping, spike, etc.)
├── src/                 # Main server source code
├── install.sh           # One-click install script (Linux/macOS)
├── install.ps1          # One-click install script (Windows)
├── package.json         # Project metadata and dependencies
├── tsconfig.json        # TypeScript configuration
├── README.md            # Project documentation
├── LICENSE              # License file
└── ...                  # Other configs, docs, and assets
```

### One-Click Installation

For most users, just run the provided script for your OS:

- **Linux/macOS:**
  ```bash
  bash install.sh
  ```
- **Windows:**
  ```powershell
  ./install.ps1
  ```

This will install dependencies, build the project, and install k6 if needed.

---

### Docker Installation (Recommended for Production)

Run with Docker for isolated, reproducible environments:

```bash
# Build and run
docker-compose up -d

# Run with monitoring stack (Grafana + InfluxDB + Prometheus)
docker-compose --profile monitoring up -d

# View logs
docker-compose logs -f k6-mcp-server

# Stop services
docker-compose down
```

**Access monitoring dashboards:**

- Grafana: http://localhost:3000 (admin/admin)
- InfluxDB: http://localhost:8086
- Prometheus: http://localhost:9090

---

**Manual steps:**

1. **Install dependencies:**
   ```bash
   npm install
   npm run build
   ```
2. **Install k6:**
   - [k6 Installation Guide](https://k6.io/docs/get-started/installation/)
3. **Run the server:**
   ```bash
   node build/index.js
   ```
4. **Create and run your first test:**
   Use the provided tools or see [tests/](tests/) for ready-to-use scripts.

## Comprehensive Test Examples

The project provides production-ready k6 test scripts for modern API architectures:

### REST API Testing

- **API Test**: [tests/api/api-test.js](tests/api/api-test.js)
  - Multi-method testing (GET, POST, PUT, DELETE)
  - Request validation and threshold checks
  - Authentication handling

- **Load Test**: [tests/load/basic-load-test.js](tests/load/basic-load-test.js)
  - Baseline performance measurement
  - Steady-state load simulation

- **Ramping Test**: [tests/ramping/ramping-vus-test.js](tests/ramping/ramping-vus-test.js)
  - Gradual load increase/decrease
  - Scaling behavior analysis

- **Spike Test**: [tests/spike/spike-test.js](tests/spike/spike-test.js)
  - Sudden traffic surge testing
  - System resilience validation

### Modern API Protocols

- **GraphQL Test**: [tests/graphql/graphql-test.js](tests/graphql/graphql-test.js)
  - Query and mutation testing
  - Variable handling and fragments
  - Error scenario validation

- **WebSocket Test**: [tests/websocket/websocket-test.js](tests/websocket/websocket-test.js)
  - Connection lifecycle testing
  - Real-time message latency
  - Chat/streaming simulation

- **gRPC Test**: [tests/grpc/grpc-test.js](tests/grpc/grpc-test.js)
  - Unary and streaming RPC
  - Protocol buffer handling
  - Performance comparison with REST

See individual test files for detailed usage instructions and best practices.

## Using the AI Folder

The `AI/` directory contains modular components for building intelligent agents, chat modes, and skills that can be integrated with your MCP server or other Node.js projects.

**Structure:**

- `AI/agent/`: Example agent logic and orchestration scripts
- `AI/chatmodes/`: Chat mode configurations and conversational logic
- `AI/skills/`: Reusable skill modules (e.g., HTTP requests)
- `AI/MCP/`: Model Context Protocol resource templates and integration examples

**How to Use:**

1. **Import a skill or chat mode in your agent:**

   ```js
   // Import a skill and a chat mode
   import { getRequest } from "./AI/skills/http-skill.js";
   import chatMode from "./AI/chatmodes/simple-chatmode.js";

   // Use in your agent logic
   export default function agent(context) {
     if (context.input.startsWith("fetch")) {
       const url = context.input.split(" ")[1];
       const res = getRequest(url);
       return `Fetched ${url}: Status ${res.status}`;
     }
     return chatMode(context);
   }
   ```

2. **Customize or extend:**
   - Add new skills to `AI/skills/` (e.g., math, database, etc.)
   - Create new chat modes in `AI/chatmodes/`
   - Build more advanced agents in `AI/agent/`

3. **Integrate with your MCP server or other Node.js apps** by importing and composing these modules as needed.

### Using The Agent Examples

The agent modules in `AI/agent/` are lightweight helpers that take a `context` object and return plain-text guidance. They are useful when you want to classify a user request before deciding which MCP tool to call.

**What each example agent does:**

- `simple-agent.js`: basic skill and chat mode composition example
- `test-generation-agent.js`: detects protocol, test type, and the closest starter script in `tests/`
- `protocol-advisor-agent.js`: recommends the best protocol-specific example for REST, GraphQL, gRPC, or WebSocket testing
- `result-analysis-agent.js`: interprets pasted k6 metrics and returns a short analysis with next actions
- `threshold-advisor-agent.js`: suggests p95 latency, error rate, and throughput thresholds calibrated to the detected test type
- `scenario-builder-agent.js`: detects user journey steps (login, browse, checkout, etc.) and returns a k6 `group()`-based scenario skeleton
- `ci-cd-agent.js`: recommends CI/CD pipeline integration steps for GitHub Actions, GitLab CI, Jenkins, Azure DevOps, or CircleCI

**Typical usage flow:**

1. Pass a natural-language request into an agent.
2. Use the returned guidance to choose a starter script or MCP tool.
3. Call MCP tools such as `generate_load_test`, `create_k6_test`, or `run_k6_test`.

```js
import testGenerationAgent from "./AI/agent/test-generation-agent.js";

const guidance = testGenerationAgent({
  input: "Create a spike test for https://api.example.com/orders",
});

console.log(guidance);
```

Example follow-up mapping:

- use `test-generation-agent.js` before creating a new script
- use `protocol-advisor-agent.js` when choosing between REST, GraphQL, gRPC, and WebSocket examples
- use `result-analysis-agent.js` after a run to summarize `p95`, error rate, and throughput
- use `threshold-advisor-agent.js` to generate a `options.thresholds` block before the first run
- use `scenario-builder-agent.js` when the request describes a multi-step user journey
- use `ci-cd-agent.js` to get a copy-paste pipeline snippet for your CI/CD platform

These agents are examples only. They are documented templates you can import into your own Node.js orchestration flow; they are not auto-registered as MCP tools by default.

See the [AI/README.md](AI/README.md) and subfolder READMEs for more details and templates.

### MCP Prompts for Guided Workflows

The [AI/MCP/prompts.md](AI/MCP/prompts.md) file contains pre-built conversational workflows:

- **create_api_load_test**: Guided API test creation with best practices
- **analyze_performance_results**: AI-powered result analysis and recommendations
- **setup_spike_test**: Black Friday / traffic surge test configuration
- **optimize_existing_test**: Automatic test script improvements
- **setup_ci_cd_integration**: Generate CI/CD pipeline configurations
- **compare_test_runs**: Trend analysis across multiple test runs
- **generate_realistic_scenarios**: User journey and persona simulation
- **debug_failed_test**: Intelligent troubleshooting assistance
- **capacity_planning**: Determine scaling requirements

These prompts enable AI assistants to provide structured, expert guidance for complex testing scenarios.

## Key Features

- **Create k6 Tests**: Generate custom, reusable k6 performance test scripts for any API or web service.
- **Run Tests**: Execute k6 load tests with configurable parameters (virtual users, duration, iterations) for flexible benchmarking.
- **View Results**: Instantly access detailed test execution results and performance metrics.
- **List Tests**: Organize and manage all available k6 test scripts in one place.
- **Generate Load Tests**: Quickly generate common load test patterns for rapid prototyping.
- **Resource Management**: Access test scripts and results as MCP resources for easy integration.

## Prerequisites

- **Node.js 18+**
- **[k6](https://k6.io/docs/get-started/installation/)** (must be installed and available in your system PATH)

### How to Install k6

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

## Installation & Setup

```bash
npm install
npm run build
```

## Configuration

You can customize storage locations using environment variables:

- `K6_TESTS_DIR`: Directory for storing k6 test scripts (default: `./k6-tests`)
- `K6_RESULTS_DIR`: Directory for storing test results (default: `./k6-results`)

## Usage with MCP Clients & Integrations

### Claude Desktop Integration

Add to your Claude Desktop configuration file:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`

**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "grafana-k6-performance": {
      "command": "node",
      "args": [
        "/absolute/path/to/Grafana-k6-performance-MCP-Server/build/index.js"
      ],
      "env": {
        "K6_TESTS_DIR": "/path/to/k6-tests",
        "K6_RESULTS_DIR": "/path/to/k6-results"
      }
    }
  }
}
```

### Other MCP-Compatible Clients

Run the server using stdio transport:

```bash
node build/index.js
```

## Available Tools & API

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

## Resources & Data Access

The server exposes k6 test scripts and results as MCP resources for easy programmatic access:

- **Test Scripts**: `k6://tests/{filename}` — Access k6 test script content
- **Test Results**: `k6://results/{filename}` — Access test execution results

## Example: k6 Load Test Script

```javascript
import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: 10,
  duration: "30s",
  thresholds: {
    http_req_duration: ["p(95)<500"],
    http_req_failed: ["rate<0.1"],
  },
};

export default function () {
  const response = http.get("https://test.k6.io");

  check(response, {
    "status is 200": (r) => r.status === 200,
    "response time < 500ms": (r) => r.timings.duration < 500,
  });

  sleep(1);
}
```

## Development & Contribution

### Build

```bash
npm run build
```

### Watch Mode

```bash
npm run watch
```

## Use Cases & Benefits

- **API Performance Testing**: Test REST APIs under various load conditions
- **Load Testing**: Simulate multiple concurrent users
- **Stress Testing**: Find breaking points of your application
- **Spike Testing**: Test how your system handles sudden traffic spikes
- **Endurance Testing**: Verify system stability over extended periods
- **Performance Regression Testing**: Ensure new changes don't degrade performance

## Troubleshooting & Support

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

This project is licensed under the MIT License.

## Further Reading & Resources

- [k6 Documentation](https://k6.io/docs/)
- [MCP Documentation](https://modelcontextprotocol.io/)
- [k6 Examples](https://k6.io/docs/examples/)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request or open an issue for feature requests and bug reports.

## Code of Conduct

We are committed to providing a welcoming and inclusive environment. Please adhere to our Code of Conduct in all interactions.

**Zero tolerance for:**

- Harassment or discriminatory language
- Trolling or insulting comments
- Spam or off-topic discussions

## Recognition

All contributors will be:

✅ Listed in CONTRIBUTORS.md (coming soon)
✅ Mentioned in release notes for significant contributions

## First-Time Contributors Welcome! 👋

New to open source? No problem! Look for issues tagged with `good-first-issue` or `help-wanted`. We provide mentorship and guidance to help you succeed.

Thank you for making test automation better for everyone! 🚀
✅ Given credit in documentation where applicable

## Questions?

If you have any questions:

💬 Open a GitHub Discussion  
🐛 Report bugs via GitHub Issues  
📧 Email: padmaraj.nidagundi at gmail.com  
_Response time: Typically 24-48 hours_
