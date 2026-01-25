# MCP Prompts for Grafana k6 Performance Testing

This file defines Model Context Protocol (MCP) prompts that provide pre-built conversational workflows for common performance testing scenarios. These prompts help AI assistants guide users through complex testing tasks with best practices built-in.

## Performance Test Creation Prompts

### create_api_load_test

**Description:** Guide users through creating a comprehensive API load test with proper thresholds and checks.

**Workflow:**
1. Collect target API endpoint and base URL
2. Determine HTTP methods to test (GET, POST, PUT, DELETE)
3. Ask about expected payload structure for POST/PUT
4. Define performance thresholds (response time, error rate)
5. Set virtual users and duration parameters
6. Generate k6 test script with best practices
7. Offer to run the test immediately

**Example Usage:**
```
User: "I need to load test my REST API"
Assistant: [Uses this prompt] "I'll help you create a comprehensive API load test. What's your API base URL?"
```

---

### analyze_performance_results

**Description:** Analyze k6 test results and provide actionable insights.

**Workflow:**
1. Retrieve latest test results
2. Analyze key metrics:
   - HTTP request duration (p95, p99)
   - Error rate
   - Requests per second
   - Virtual user performance
3. Identify bottlenecks and anomalies
4. Compare against defined thresholds
5. Provide recommendations for:
   - Performance improvements
   - Infrastructure scaling
   - Test parameter adjustments
6. Suggest follow-up tests if needed

**Example Usage:**
```
User: "How did my last test perform?"
Assistant: [Uses this prompt] Analyzes results and provides detailed breakdown
```

---

### setup_spike_test

**Description:** Create a spike test to validate system resilience under sudden traffic surges.

**Workflow:**
1. Understand the baseline load (normal VUs)
2. Define spike parameters:
   - Spike multiplier (e.g., 10x normal load)
   - Spike duration
   - Recovery observation period
3. Set critical thresholds:
   - Maximum acceptable error rate during spike
   - Recovery time expectations
4. Generate ramping configuration:
   - Ramp up to spike
   - Hold spike
   - Ramp down
   - Observe recovery
5. Create test with monitoring for:
   - Error rates
   - Response degradation
   - System recovery
6. Explain what to look for in results

**Example Usage:**
```
User: "I want to test if my API can handle Black Friday traffic"
Assistant: [Uses this prompt] Guides through spike test creation
```

---

### optimize_existing_test

**Description:** Analyze and improve an existing k6 test script.

**Workflow:**
1. Read the existing test file
2. Analyze current implementation:
   - Check usage
   - Threshold definitions
   - HTTP request patterns
   - Data handling
3. Identify improvement opportunities:
   - Missing error handling
   - Inefficient request patterns
   - Missing metrics/tags
   - Threshold optimization
4. Suggest k6 best practices:
   - Use of groups
   - Custom metrics
   - Trend analysis
   - Realistic user simulation
5. Offer to implement improvements
6. Explain the benefits of each change

**Example Usage:**
```
User: "Can you improve my load test?"
Assistant: [Uses this prompt] Reviews and suggests optimizations
```

---

### setup_ci_cd_integration

**Description:** Help users integrate k6 tests into CI/CD pipelines.

**Workflow:**
1. Identify CI/CD platform (GitHub Actions, GitLab CI, Jenkins, etc.)
2. Determine test execution strategy:
   - Trigger conditions (PR, merge, schedule)
   - Test selection (smoke, regression, full)
3. Configure test parameters for CI:
   - Reduced duration for fast feedback
   - Appropriate VU counts
   - Thresholds that fail the build
4. Generate CI configuration file
5. Add result reporting:
   - JUnit XML export
   - Performance badge generation
   - Grafana Cloud integration (if available)
6. Provide deployment instructions

**Example Usage:**
```
User: "How do I run these tests in GitHub Actions?"
Assistant: [Uses this prompt] Creates complete CI/CD configuration
```

---

### compare_test_runs

**Description:** Compare performance metrics across multiple test runs to identify trends.

**Workflow:**
1. List available test results
2. Select tests to compare (by name or date range)
3. Extract key metrics from each run:
   - Response times (avg, p95, p99)
   - Throughput (req/s)
   - Error rates
   - Resource utilization
4. Calculate deltas and trends
5. Visualize changes:
   - Performance improvements/regressions
   - Stability trends
6. Provide recommendations based on trends
7. Suggest when to rebaseline thresholds

**Example Usage:**
```
User: "Compare my last 3 test runs"
Assistant: [Uses this prompt] Performs comparative analysis
```

---

### generate_realistic_scenarios

**Description:** Create realistic user journey scenarios for accurate load testing.

**Workflow:**
1. Understand the application type (e-commerce, SaaS, API, etc.)
2. Define user personas and behaviors:
   - Browse/search patterns
   - Transaction flows
   - Think time between actions
3. Map user journeys to API calls
4. Set realistic distributions:
   - Weighted scenarios (80% readers, 20% writers)
   - Variable think times
   - Session handling
5. Generate k6 scenario configuration
6. Add realistic data:
   - CSV data files
   - Shared arrays
   - Dynamic data generation
7. Include monitoring for journey-specific metrics

**Example Usage:**
```
User: "I need to simulate real users shopping on my e-commerce site"
Assistant: [Uses this prompt] Creates multi-scenario test with user journeys
```

---

### setup_grafana_monitoring

**Description:** Configure Grafana dashboards for real-time k6 test monitoring.

**Workflow:**
1. Check if Grafana Cloud account exists
2. Generate k6 test with cloud output:
   - InfluxDB export
   - Prometheus remote write
   - Grafana Cloud k6 integration
3. Provide dashboard setup instructions
4. Create sample dashboard JSON
5. Configure alerts for threshold violations
6. Set up test result retention policies

**Example Usage:**
```
User: "How do I visualize my k6 results in Grafana?"
Assistant: [Uses this prompt] Sets up complete monitoring pipeline
```

---

### debug_failed_test

**Description:** Help troubleshoot failing k6 tests and performance issues.

**Workflow:**
1. Examine test results and error messages
2. Categorize failures:
   - Threshold violations
   - HTTP errors (4xx, 5xx)
   - Network timeouts
   - k6 script errors
3. Analyze patterns:
   - When failures occur (timing)
   - Which endpoints are affected
   - Correlation with load levels
4. Suggest debugging strategies:
   - Reduce VUs to isolate issues
   - Add detailed logging
   - Check network connectivity
   - Verify endpoint availability
5. Recommend fixes based on failure type
6. Offer to create diagnostic test

**Example Usage:**
```
User: "My test is failing with timeout errors"
Assistant: [Uses this prompt] Diagnoses and suggests solutions
```

---

### generate_performance_report

**Description:** Create comprehensive performance test reports for stakeholders.

**Workflow:**
1. Gather test results and metrics
2. Structure report with sections:
   - Executive summary
   - Test configuration
   - Key findings
   - Detailed metrics
   - Recommendations
3. Format for target audience:
   - Technical: detailed metrics, graphs
   - Business: SLO compliance, capacity planning
4. Include visualizations:
   - Response time distributions
   - Error rate trends
   - Throughput graphs
5. Add actionable recommendations
6. Export in requested format (Markdown, HTML, PDF)

**Example Usage:**
```
User: "Generate a report for my QA team"
Assistant: [Uses this prompt] Creates formatted performance report
```

---

## Advanced Workflow Prompts

### microservices_performance_suite

**Description:** Create a comprehensive test suite for microservices architecture.

**Workflow:**
1. Inventory all microservices and endpoints
2. Define service dependencies and call chains
3. Create individual service tests
4. Build integration tests for service interactions
5. Set up distributed tracing correlation
6. Configure service-specific thresholds
7. Generate test orchestration scripts
8. Include chaos engineering scenarios (optional)

---

### api_contract_validation

**Description:** Validate API performance against OpenAPI/Swagger specifications.

**Workflow:**
1. Parse OpenAPI/Swagger spec
2. Extract all endpoints, methods, parameters
3. Generate test cases for each operation
4. Add schema validation checks
5. Set performance expectations per endpoint
6. Create comprehensive test suite
7. Include edge cases and error scenarios

---

### capacity_planning

**Description:** Determine system capacity and scaling requirements.

**Workflow:**
1. Start with baseline test (current load)
2. Create graduated load tests:
   - 2x current load
   - 5x current load
   - 10x current load
3. Identify breaking point
4. Analyze resource utilization at each level
5. Calculate cost per request at scale
6. Provide capacity recommendations
7. Suggest infrastructure optimizations

---

## Usage in MCP Clients

These prompts are automatically available to MCP clients like Claude Desktop. When users ask questions related to these scenarios, the AI assistant will follow the defined workflows to provide structured, best-practice guidance.

To reference a prompt explicitly:
```
User: "Use the setup_spike_test prompt to create a Black Friday test"
```

Or let the AI automatically match the best prompt:
```
User: "I need to test my API for sudden traffic spikes"
[AI automatically uses setup_spike_test prompt]
```

---

## Extending Prompts

To add new prompts, follow this structure:

```markdown
### prompt_name

**Description:** Brief description of what this prompt helps accomplish

**Workflow:**
1. Step one
2. Step two
...

**Example Usage:**
```
User: "Example user request"
Assistant: [Uses this prompt] What the assistant does
```
```

---

## Best Practices for Prompt Design

1. **Be Specific**: Each prompt should have a clear, single purpose
2. **Include Context**: Provide background information the AI needs
3. **Define Steps**: Break complex tasks into sequential steps
4. **Add Examples**: Show how the prompt should be triggered
5. **Consider Edge Cases**: Handle errors and unusual scenarios
6. **Stay Updated**: Revise prompts as k6 and best practices evolve

---

## Feedback and Contributions

Have ideas for new prompts? Open an issue or submit a PR with your proposed prompt workflow!
