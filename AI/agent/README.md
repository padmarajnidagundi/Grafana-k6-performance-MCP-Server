# Agent Examples

This folder contains example agent logic for use with the MCP server. Agents can orchestrate skills, manage context, and implement advanced behaviors.

- `simple-agent.js`: A minimal agent that demonstrates skill and chat mode usage.
- `test-generation-agent.js`: Recommends the right k6 test type, protocol, and example file based on a natural-language request.
- `result-analysis-agent.js`: Summarizes a k6 run and highlights likely bottlenecks, threshold failures, and next actions.
- `protocol-advisor-agent.js`: Routes users to the best starter example for REST, GraphQL, gRPC, or WebSocket performance testing.
- `threshold-advisor-agent.js`: Suggests p95 latency, error rate, and throughput thresholds calibrated to the detected test type.
- `scenario-builder-agent.js`: Detects user journey steps from a natural-language description and returns a k6 `group()`-based scenario skeleton.
- `ci-cd-agent.js`: Recommends CI/CD pipeline integration steps for GitHub Actions, GitLab CI, Jenkins, Azure DevOps, or CircleCI.
- `agent-utils.js`: Shared parsing helpers used by the example agents.

## How Agents Work

Each agent in this folder is a plain ESM module that:

- accepts a `context` object
- reads `context.input`
- returns a plain-text response

These examples are intended to be composed into your own MCP workflow or imported into another Node.js entrypoint. They are not automatically registered by `src/index.ts`.

## Example Usage

```js
import testGenerationAgent from "./test-generation-agent.js";

const response = testGenerationAgent({
  input: "Create a spike test for https://api.example.com/orders",
});

console.log(response);
```

Each agent expects a simple `context` object with an `input` string. The result is plain text so it can be surfaced directly in a chat response or used as a first-pass planning step before calling MCP tools.

## Agent Inputs And Outputs

### `test-generation-agent.js`

Use this agent when the user describes the kind of performance test they want in natural language.

Example input:

```js
{
  input: "Create a GraphQL soak test for https://api.example.com/graphql";
}
```

What it returns:

- detected protocol
- detected test type
- recommended example script path
- a short next-step checklist

### `protocol-advisor-agent.js`

Use this agent when the main question is which protocol-specific starter test to use.

Example input:

```js
{
  input: "I need to performance test a websocket chat service";
}
```

What it returns:

- the recommended protocol flow
- the closest starter script in `tests/`
- a note about what that protocol example is good for

### `result-analysis-agent.js`

Use this agent after a k6 run when you want a quick interpretation of raw metrics.

Example input:

```js
{
  input: "p95 1450 error rate 2.3 rps 380";
}
```

What it returns:

- a short findings summary
- likely problem areas
- recommended next actions for another test run

### `threshold-advisor-agent.js`

Use this agent when you need to define appropriate k6 threshold values before running a test.

Example input:

```js
{
  input: "stress test for a payment REST API";
}
```

What it returns:

- recommended p95 latency threshold
- recommended error rate threshold
- throughput guidance for the test type
- a ready-to-paste k6 `options.thresholds` snippet

### `scenario-builder-agent.js`

Use this agent when the user describes a multi-step user journey to simulate.

Example input:

```js
{
  input: "user logs in, browses catalog, adds item to cart, and checks out at https://shop.example.com";
}
```

What it returns:

- ordered list of detected journey steps
- configuration hints (protocol, traffic profile, think time)
- a k6 `group()`-based scenario skeleton ready to fill in

### `ci-cd-agent.js`

Use this agent when you want to automate k6 tests inside a CI/CD pipeline.

Example input:

```js
{
  input: "GitHub Actions smoke test on every pull request";
}
```

What it returns:

- detected CI/CD platform
- recommended test type for automation
- a copy-paste pipeline step snippet
- checklist of best practices (artifacts, exit codes, env vars)

## Integrating An Agent

You can call an agent from your own orchestration layer before invoking MCP tools.

```js
import testGenerationAgent from "./test-generation-agent.js";

function handleUserRequest(input) {
  const guidance = testGenerationAgent({ input });

  return {
    guidance,
    nextTool: "generate_load_test",
  };
}
```

This pattern is useful when you want an agent to classify the request first, then let the MCP server create or run the actual k6 script.
