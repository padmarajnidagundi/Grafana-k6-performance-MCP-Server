
# Grafana k6 Performance MCP Server

![Build Status](https://img.shields.io/github/actions/workflow/status/your-org/Grafana-k6-performance-MCP-Server/ci.yml?branch=main)
![npm version](https://img.shields.io/npm/v/grafana-k6-performance-mcp-server)
![License](https://img.shields.io/github/license/your-org/Grafana-k6-performance-MCP-Server)
![k6](https://img.shields.io/badge/k6-tested-brightgreen)

## High-Performance Load Testing Automation for Modern APIs

**Grafana k6 Performance MCP Server** is a robust, extensible Model Context Protocol (MCP) server designed to automate, manage, and analyze [Grafana k6](https://k6.io/) performance tests. Built for developers, QA engineers, and DevOps teams, this tool enables seamless integration of k6 load testing into your CI/CD pipelines, AI assistants, and MCP-compatible clients. Achieve reliable, scalable, and repeatable performance testing for APIs and web services.



## Why Choose This Project?

- **Expert-Driven**: Built with best practices in performance engineering and automation.
- **Authoritative**: Integrates directly with industry-standard [Grafana k6](https://k6.io/) for trusted results.
- **Trustworthy**: Open source, transparent, and maintained by experienced contributors.
- **SEO Keywords**: k6 load testing, API performance, automated performance testing, MCP server, DevOps, CI/CD, scalable load testing, open source.



## Quick Start

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
  Use the provided tools or see [examples/](examples/) for ready-to-use scripts.


## Types of Performance Tests

The project provides several types of k6 test scripts, each targeting a specific performance scenario:

- **API Test:**
  - Location: `examples/api/api-test.js`
  - Purpose: Validates API endpoints using multiple HTTP methods (GET, POST, PUT, DELETE), checks payloads, headers, and endpoint-specific thresholds.

- **Load Test:**
  - Location: `examples/load/basic-load-test.js`
  - Purpose: Simulates a steady number of users to measure baseline performance and response times under typical load.

- **Ramping Test:**
  - Location: `examples/ramping/ramping-vus-test.js`
  - Purpose: Gradually increases and decreases the number of virtual users to observe system behavior during scaling and descaling events.

- **Spike Test:**
  - Location: `examples/spike/spike-test.js`
  - Purpose: Applies sudden, extreme load to test system resilience, error rates, and recovery from traffic spikes.

See the [examples/README.md](examples/README.md) for details and usage instructions for each test type.




## Key Features

-  **Create k6 Tests**: Generate custom, reusable k6 performance test scripts for any API or web service.
-  **Run Tests**: Execute k6 load tests with configurable parameters (virtual users, duration, iterations) for flexible benchmarking.
-  **View Results**: Instantly access detailed test execution results and performance metrics.
-  **List Tests**: Organize and manage all available k6 test scripts in one place.
-  **Generate Load Tests**: Quickly generate common load test patterns for rapid prototyping.
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
      "args": ["/absolute/path/to/Grafana-k6-performance-MCP-Server/build/index.js"],
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
✅ Given credit in documentation where applicable



## Questions?

If you have any questions:

💬 Open a GitHub Discussion  
🐛 Report bugs via GitHub Issues  
📧 Email: padmaraj.nidagundi@gmail.com  
_Response time: Typically 24-48 hours_



## First-Time Contributors Welcome! 👋

New to open source? No problem! Look for issues tagged with `good-first-issue` or `help-wanted`. We provide mentorship and guidance to help you succeed.

Thank you for making test automation better for everyone! 🚀



## Author & Maintainer

**Project Lead:** [Your Name or Organization]

For questions, support, or partnership inquiries, please open an issue or contact the maintainer.

