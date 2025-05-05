export class ModelDefinition {
    constructor(public config: {
        name: string;
        description: string;
        functions: FunctionDefinition[];
    }) {}
}

export class FunctionDefinition {
    constructor(public config: {
        name: string;
        description: string;
        parameters: {
            type: string;
            properties: Record<string, any>;
            required?: string[];
        };
    }) {}
}

export class Agent {
    constructor(public config: {
        model: ModelDefinition;
        handleFunctionCall: (functionCall: FunctionCall) => Promise<{ content: string }>;
    }) {}

    async respond(message: string): Promise<{ content: string }> {
        // Parse the message to determine which function to call
        const functionCall = this.parseMessage(message);
        return this.config.handleFunctionCall(functionCall);
    }

    private parseMessage(message: string): FunctionCall {
        // Simple parsing logic - can be enhanced based on requirements
        if (message.toLowerCase().includes('stock')) {
            return {
                name: 'getProductStock',
                parameters: { sku: this.extractSku(message) }
            };
        } else if (message.toLowerCase().includes('list') || message.toLowerCase().includes('show')) {
            return {
                name: 'getProducts',
                parameters: {}
            };
        } else if (message.toLowerCase().includes('search') || message.toLowerCase().includes('find')) {
            return {
                name: 'searchProducts',
                parameters: this.extractSearchParameters(message)
            };
        } else {
            return {
                name: 'help',
                parameters: {}
            };
        }
    }

    private extractSku(message: string): string {
        // Extract SKU from message - can be enhanced
        const skuMatch = message.match(/\b(24-[A-Z0-9]{2,4})\b/i);
        return skuMatch ? skuMatch[1] : '';
    }

    private extractSearchParameters(message: string): Record<string, any> {
        const parameters: Record<string, any> = {};
        
        // Extract color
        const colorMatch = message.match(/\b(red|blue|green|black|white|yellow)\b/i);
        if (colorMatch) parameters.color = colorMatch[1].toLowerCase();
        
        // Extract price range
        const priceMatch = message.match(/\b(under|below|less than)\s+(\d+)\b/i);
        if (priceMatch) parameters.maxPrice = parseFloat(priceMatch[2]);
        
        // Extract size
        const sizeMatch = message.match(/\b(small|medium|large|xl|xxl)\b/i);
        if (sizeMatch) parameters.size = sizeMatch[1].toLowerCase();
        
        // Extract material
        const materialMatch = message.match(/\b(cotton|wool|silk|polyester|leather)\b/i);
        if (materialMatch) parameters.material = materialMatch[1].toLowerCase();
        
        return parameters;
    }
}

export interface FunctionCall {
    name: string;
    parameters: Record<string, any>;
} 