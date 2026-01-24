# Examples

This directory contains example k6 test scripts to help you get started with performance testing.

## Available Examples


## Test Types & Structure

The examples are now organized by test type:

- **API Tests:** `examples/api/api-test.js`
- **Load Tests:** `examples/load/basic-load-test.js`
- **Ramping Tests:** `examples/ramping/ramping-vus-test.js`
- **Spike Tests:** `examples/spike/spike-test.js`

### 1. Basic Load Test
Path: `examples/load/basic-load-test.js`
A simple load test that demonstrates:
- Basic HTTP GET request
- Response validation with checks
- Threshold configuration
- Sleep between iterations

**Usage:**
```bash
k6 run examples/load/basic-load-test.js
```

### 2. Ramping VUs Test
Path: `examples/ramping/ramping-vus-test.js`
A ramping load test that demonstrates:
- Gradual increase and decrease of virtual users (VUs)
- Grouped scenarios
- Testing multiple pages
- Realistic load patterns

**Usage:**
```bash
k6 run examples/ramping/ramping-vus-test.js
```

### 3. API Test
Path: `examples/api/api-test.js`
An API testing script that demonstrates:
- Multiple HTTP methods (GET, POST, PUT, DELETE)
- JSON payload handling
- Custom headers
- Tagged requests for better metrics
- Endpoint-specific thresholds

**Usage:**
```bash
k6 run examples/api/api-test.js
```

### 4. Spike Test
Path: `examples/spike/spike-test.js`
A spike test that demonstrates:
- Sudden traffic increases
- System behavior under stress
- Recovery testing
- More lenient thresholds for spike scenarios

**Usage:**
```bash
k6 run examples/spike/spike-test.js
```

## Using Examples with MCP Server

You can use the MCP server to run these examples:

1. **Copy an example to your k6-tests directory:**
   ```bash
   cp examples/basic-load-test.js k6-tests/
   ```

2. **Run via MCP tools:**
   Use the `run_k6_test` tool with:
   ```json
   {
     "testFile": "basic-load-test.js",
     "vus": 20,
     "duration": "1m"
   }
   ```

## Customizing Tests

All examples can be customized by:
- Adjusting VUs and duration in the `options` object
- Modifying thresholds to match your requirements
- Adding custom checks and validations
- Changing target URLs

## Learn More

- [k6 Documentation](https://k6.io/docs/)
- [k6 Examples](https://k6.io/docs/examples/)
- [k6 Best Practices](https://k6.io/docs/testing-guides/test-types/)
