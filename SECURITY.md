# Security Policy

## Supported Versions

We release patches for security vulnerabilities for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

The Grafana k6 Performance MCP Server team takes security issues seriously. We appreciate your efforts to responsibly disclose your findings.

### How to Report a Security Vulnerability

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please report them via one of the following methods:

1. **Email**: Send details to padmaraj.nidagundi@gmail.com
   - Use subject line: "SECURITY: [Brief Description]"
   - Include detailed steps to reproduce
   - Include any proof-of-concept code if available

2. **GitHub Security Advisory**: Use the [GitHub Security Advisory](https://github.com/padmarajnidagundi/Grafana-k6-performance-MCP-Server/security/advisories/new) feature

### What to Include

Please include the following information in your report:

- Type of vulnerability (e.g., XSS, SQL injection, remote code execution)
- Full paths of source file(s) related to the vulnerability
- Location of the affected source code (tag/branch/commit or direct URL)
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the vulnerability, including how an attacker might exploit it

### Response Timeline

- **Acknowledgment**: Within 48 hours of submission
- **Initial Assessment**: Within 7 days
- **Fix Development**: Depending on severity and complexity
- **Disclosure**: After fix is released and users have had time to update

### Severity Classification

We use the following severity levels:

- **Critical**: Remote code execution, authentication bypass
- **High**: Data exposure, privilege escalation
- **Medium**: XSS, CSRF, information disclosure
- **Low**: Minor information leaks, configuration issues

### Our Commitment

- We will confirm receipt of your vulnerability report within 48 hours
- We will send a detailed response within 7 days indicating the next steps
- We will work with you to understand and validate the issue
- We will keep you informed of the progress toward a fix
- We will credit you in the security advisory (unless you prefer to remain anonymous)

### Bug Bounty

We do not currently offer a bug bounty program, but we deeply appreciate responsible disclosure and will publicly acknowledge your contribution (with your permission).

## Security Best Practices

When using this MCP server:

1. **Environment Variables**: Never commit sensitive credentials to version control
2. **k6 Cloud Tokens**: Store tokens in environment variables, not in test scripts
3. **API Keys**: Use secure vaults or environment variables for API authentication
4. **Network Security**: Run k6 tests from trusted networks
5. **Docker**: Use official images and scan for vulnerabilities regularly
6. **Dependencies**: Keep Node.js and npm packages updated

## Known Security Considerations

### Current Limitations

1. **File System Access**: The MCP server creates and reads files in configured directories
   - Ensure proper file permissions on K6_TESTS_DIR and K6_RESULTS_DIR
   - Run with least privilege necessary

2. **Command Execution**: The server spawns k6 processes
   - Input validation is performed on test names
   - k6 must be from a trusted source

3. **MCP Communication**: Currently uses stdio transport
   - Ensure MCP client is trusted
   - Be cautious with test scripts from untrusted sources

### Mitigations

- Input validation on all file operations
- Path sanitization to prevent directory traversal
- Restricted file access to configured directories only
- No execution of arbitrary commands beyond k6

## Updates and Patches

Security updates will be released as:

- **Critical/High**: Patch releases (e.g., 1.0.1) as soon as possible
- **Medium/Low**: Minor releases (e.g., 1.1.0) in regular update cycle

Subscribe to GitHub releases or watch the repository to receive notifications.

## Questions?

If you have questions about this security policy, please email padmaraj.nidagundi@gmail.com
