# Contributing to Grafana k6 Performance MCP Server

Thank you for your interest in contributing to the Grafana k6 Performance MCP Server! This document provides guidelines for contributing to the project.

## Development Setup

1. **Prerequisites:**
   - Node.js 18 or higher
   - npm
   - k6 installed and available in PATH

2. **Clone the repository:**
   ```bash
   git clone https://github.com/padmarajnidagundi/Grafana-k6-performance-MCP-Server.git
   cd Grafana-k6-performance-MCP-Server
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Build the project:**
   ```bash
   npm run build
   ```

5. **Run in development mode:**
   ```bash
   npm run watch
   ```

## Project Structure

```
.
├── src/              # TypeScript source code
│   └── index.ts      # Main MCP server implementation
├── examples/         # Example k6 test scripts
├── build/            # Compiled JavaScript (generated)
├── k6-tests/         # Default directory for test scripts
├── k6-results/       # Default directory for test results
└── package.json      # Project configuration
```

## Making Changes

1. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes:**
   - Edit TypeScript files in `src/`
   - Add tests if applicable
   - Update documentation

3. **Build and test:**
   ```bash
   npm run build
   # Test the server
   node build/index.js
   ```

4. **Commit your changes:**
   ```bash
   git add .
   git commit -m "Description of your changes"
   ```

5. **Push to your fork:**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request:**
   - Go to the GitHub repository
   - Click "New Pull Request"
   - Select your branch
   - Describe your changes

## Code Style

- Use TypeScript for all source code
- Follow the existing code style
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions focused and small

## Adding New Tools

When adding a new MCP tool:

1. Add the tool definition in `ListToolsRequestSchema` handler
2. Implement the tool logic in `CallToolRequestSchema` handler
3. Update the README.md with tool documentation
4. Add examples if applicable

Example structure:
```typescript
{
  name: 'tool_name',
  description: 'What the tool does',
  inputSchema: {
    type: 'object',
    properties: {
      param1: {
        type: 'string',
        description: 'Parameter description'
      }
    },
    required: ['param1']
  }
}
```

## Adding New Resources

When adding a new MCP resource:

1. Add resource listing in `ListResourcesRequestSchema` handler
2. Implement resource reading in `ReadResourceRequestSchema` handler
3. Use appropriate URI schemes (e.g., `k6://...`)
4. Update documentation

## Testing

Since this is an MCP server, testing requires:

1. **Manual Testing:**
   - Configure the server in an MCP client (e.g., Claude Desktop)
   - Test each tool with various inputs
   - Verify resource access

2. **Integration Testing:**
   - Ensure k6 is installed
   - Test with actual k6 scripts
   - Verify results are saved correctly

## Documentation

- Update README.md for user-facing changes
- Add inline comments for complex code
- Update examples if adding new features
- Keep documentation clear and concise

## Reporting Issues

When reporting issues, please include:

- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Node version, k6 version)
- Error messages or logs

## Feature Requests

Feature requests are welcome! Please:

- Check existing issues first
- Clearly describe the feature
- Explain the use case
- Consider backwards compatibility

## Questions?

If you have questions about contributing:

- Open an issue with the "question" label
- Refer to the [MCP documentation](https://modelcontextprotocol.io/)
- Check the [k6 documentation](https://k6.io/docs/)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
