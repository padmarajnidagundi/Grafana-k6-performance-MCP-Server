# Quick Start Guide

This guide will help you get started with the Grafana k6 Performance MCP Server in minutes.

## Prerequisites

1. **Install Node.js 18 or higher:**
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify installation: `node --version`

2. **Install k6:**
   
   **macOS:**
   ```bash
   brew install k6
   ```
   
   **Linux (Debian/Ubuntu):**
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

3. **Verify k6 installation:**
   ```bash
   k6 version
   ```

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/padmarajnidagundi/Grafana-k6-performance-MCP-Server.git
   cd Grafana-k6-performance-MCP-Server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Build the project:**
   ```bash
   npm run build
   ```

## Using with Claude Desktop

1. **Find your Claude Desktop config file:**
   - **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

2. **Add the MCP server configuration:**
   ```json
   {
     "mcpServers": {
       "grafana-k6-performance": {
         "command": "node",
         "args": ["/absolute/path/to/Grafana-k6-performance-MCP-Server/build/index.js"]
       }
     }
   }
   ```

3. **Restart Claude Desktop**

4. **Verify the server is connected:**
   - Look for the 🔌 icon in Claude Desktop
   - You should see "grafana-k6-performance" listed

## First Performance Test

Once connected to Claude Desktop, you can start using k6 through natural language:

### Example 1: Generate and Run a Load Test

```
Can you create a load test for https://test.k6.io with 20 virtual users for 1 minute?
```

Claude will:
1. Use `generate_load_test` tool to create the test script
2. Save it to the k6-tests directory
3. Optionally run it using `run_k6_test`

### Example 2: Create a Custom Test

```
Create a k6 test that:
- Tests the API at https://jsonplaceholder.typicode.com/posts
- Uses POST method with JSON payload
- Runs for 30 seconds with 10 users
- Checks that responses are under 500ms
```

### Example 3: View Test Results

```
Show me the results from my recent k6 tests
```

Claude will use the `get_test_results` tool to fetch and display results.

## Manual Testing (Without Claude)

You can also run k6 tests directly:

1. **Copy an example test:**
   ```bash
   cp examples/basic-load-test.js k6-tests/
   ```

2. **Run the test with k6:**
   ```bash
   k6 run k6-tests/basic-load-test.js
   ```

## Available MCP Tools

The server provides these tools for AI assistants:

1. **create_k6_test** - Create a custom test script
2. **run_k6_test** - Execute a test with configurable parameters
3. **list_k6_tests** - See all available tests
4. **get_test_results** - Retrieve test execution results
5. **generate_load_test** - Quick generation of standard load tests

## Example Workflows

### Workflow 1: API Performance Testing

1. Ask Claude: "Generate a load test for my API at https://api.example.com"
2. Claude creates the test using `generate_load_test`
3. Ask: "Run the test with 50 users for 2 minutes"
4. Claude executes using `run_k6_test`
5. Ask: "Show me the results"
6. Claude displays metrics using `get_test_results`

### Workflow 2: Stress Testing

1. Ask: "Create a spike test that goes from 10 to 100 users suddenly"
2. Claude creates a custom test with ramping stages
3. Review and run the test
4. Analyze results to find breaking points

## Troubleshooting

### Server not connecting
- Verify Node.js is installed: `node --version`
- Check the absolute path in your config
- Look at Claude Desktop logs

### k6 command not found
- Verify k6 installation: `k6 version`
- Add k6 to your PATH
- Restart your terminal/IDE

### Tests not running
- Check k6-tests directory exists
- Verify test file syntax
- Look for error messages in results

## Next Steps

- Read the [full README](README.md) for detailed documentation
- Explore [example tests](examples/) for inspiration
- Check [CONTRIBUTING.md](CONTRIBUTING.md) to contribute
- Learn more about k6 at [k6.io/docs](https://k6.io/docs/)

## Support

If you encounter issues:
- Check existing GitHub issues
- Create a new issue with details
- Include error messages and environment info

Happy performance testing! 🚀
