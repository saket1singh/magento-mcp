"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const readline_sync_1 = __importDefault(require("readline-sync"));
const agent_1 = require("./agent");
async function main() {
    console.log('🤖 MCP + Magento Chatbot');
    while (true) {
        const input = readline_sync_1.default.question('You: ');
        if (input.toLowerCase() === 'exit')
            break;
        try {
            const result = await agent_1.agent.respond(input);
            console.log(`Bot: ${result.content}`);
        }
        catch (e) {
            console.error('⚠️ Error:', e.message);
        }
    }
}
main();
