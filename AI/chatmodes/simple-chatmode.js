// Example: Simple Chat Mode
// This script demonstrates a basic chat mode configuration for a virtual agent.

export default function chatMode(context) {
  if (context.input.toLowerCase().includes('hello')) {
    return 'Hi! How can I help you today?';
  }
  return "I'm here to assist you.";
}
