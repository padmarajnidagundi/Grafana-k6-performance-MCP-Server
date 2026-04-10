# AI Folder

This directory contains modular AI-related components for the MCP server. Each subfolder is designed for a specific type of AI logic or integration.

- `agent/` — Example agent logic and orchestration scripts, including test generation, protocol selection, and result analysis helpers.
- `chatmodes/` — Chat mode configurations and conversational logic.
- `skills/` — Reusable skill modules (e.g., HTTP, math, etc.).
- `MCP/` — Model Context Protocol resource templates and integration examples.

You can add your own modules, extend existing ones, or use these as templates for your AI workflows.

The current agent examples are designed to support common k6 workflows:

- selecting an appropriate test type from a natural-language prompt
- routing users to the closest protocol-specific example script
- turning raw k6 metrics into a short analysis and next-step checklist
