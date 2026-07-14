// Example: Simple Agent
// This agent uses a skill and a chat mode to respond to user input.

import { getRequest } from '../skills/http-skill.js';
import chatMode from '../chatmodes/simple-chatmode.js';

export default function agent(context) {
  if (context.input.startsWith('fetch')) {
    const url = context.input.split(' ')[1];
    const res = getRequest(url);
    return `Fetched ${url}: Status ${res.status}`;
  }
  return chatMode(context);
}
