"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Agent = exports.FunctionDefinition = exports.ModelDefinition = void 0;
class ModelDefinition {
    constructor(config) {
        this.config = config;
    }
}
exports.ModelDefinition = ModelDefinition;
class FunctionDefinition {
    constructor(config) {
        this.config = config;
    }
}
exports.FunctionDefinition = FunctionDefinition;
class Agent {
    constructor(config) {
        this.config = config;
    }
    async respond(message) {
        // Parse the message to determine which function to call
        const functionCall = this.parseMessage(message);
        return this.config.handleFunctionCall(functionCall);
    }
    parseMessage(message) {
        // Simple parsing logic - can be enhanced based on requirements
        if (message.toLowerCase().includes('stock')) {
            return {
                name: 'getProductStock',
                parameters: { sku: this.extractSku(message) }
            };
        }
        else if (message.toLowerCase().includes('list') || message.toLowerCase().includes('show')) {
            return {
                name: 'getProducts',
                parameters: {}
            };
        }
        else if (message.toLowerCase().includes('search') || message.toLowerCase().includes('find')) {
            return {
                name: 'searchProducts',
                parameters: this.extractSearchParameters(message)
            };
        }
        else {
            return {
                name: 'help',
                parameters: {}
            };
        }
    }
    extractSku(message) {
        // Extract SKU from message - now matches alphanumeric SKUs like VA01, 24-XXXX, etc.
        //  const skuMatch = message.match(/\b([A-Z0-9\-]+)\b/i);
        //  return skuMatch ? skuMatch[1] : '';
        const match = message.match(/\b(?:sku:|for|of)\s*([A-Z0-9\-]+)/i);
        return match ? match[1].toUpperCase() : '';
    }
    extractSearchParameters(message) {
        const parameters = {};
        // Extract color
        const colorMatch = message.match(/\b(red|blue|green|black|white|yellow)\b/i);
        if (colorMatch)
            parameters.color = colorMatch[1].toLowerCase();
        // Extract price range
        const priceMatch = message.match(/\b(under|below|less than)\s+(\d+)\b/i);
        if (priceMatch)
            parameters.maxPrice = parseFloat(priceMatch[2]);
        // Extract size
        const sizeMatch = message.match(/\b(small|medium|large|xl|xxl)\b/i);
        if (sizeMatch)
            parameters.size = sizeMatch[1].toLowerCase();
        // Extract material
        const materialMatch = message.match(/\b(cotton|wool|silk|polyester|leather)\b/i);
        if (materialMatch)
            parameters.material = materialMatch[1].toLowerCase();
        return parameters;
    }
}
exports.Agent = Agent;
