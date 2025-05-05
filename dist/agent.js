"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.agent = void 0;
exports.initializeAgent = initializeAgent;
const sdk_1 = require("./sdk");
let agent;
async function initializeAgent() {
    exports.agent = agent = await (0, sdk_1.createAgent)();
    return agent;
}
