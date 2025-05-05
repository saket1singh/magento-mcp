"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAgent = createAgent;
const types_1 = require("./types");
const magento_1 = require("./magento");
async function createAgent() {
    const model = new types_1.ModelDefinition({
        name: 'magento-chatbot',
        description: 'A chatbot that helps users with product information from Magento',
        functions: [
            new types_1.FunctionDefinition({
                name: 'getProductStock',
                description: 'Check the stock status of a product by SKU',
                parameters: {
                    type: 'object',
                    properties: {
                        sku: {
                            type: 'string',
                            description: 'The SKU of the product to check'
                        }
                    },
                    required: ['sku']
                }
            }),
            new types_1.FunctionDefinition({
                name: 'getProducts',
                description: 'Get a list of products from the store',
                parameters: {
                    type: 'object',
                    properties: {}
                }
            }),
            new types_1.FunctionDefinition({
                name: 'searchProducts',
                description: 'Search for products by various attributes like name, color, price, etc.',
                parameters: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                            description: 'Product name to search for'
                        },
                        color: {
                            type: 'string',
                            description: 'Product color to filter by'
                        },
                        maxPrice: {
                            type: 'number',
                            description: 'Maximum price to filter by'
                        },
                        minPrice: {
                            type: 'number',
                            description: 'Minimum price to filter by'
                        },
                        size: {
                            type: 'string',
                            description: 'Product size to filter by'
                        },
                        material: {
                            type: 'string',
                            description: 'Product material to filter by'
                        }
                    }
                }
            })
        ]
    });
    return new types_1.Agent({
        model,
        async handleFunctionCall(functionCall) {
            switch (functionCall.name) {
                case 'getProductStock':
                    try {
                        const stock = await (0, magento_1.getProductStock)(functionCall.parameters.sku);
                        if (!stock) {
                            return {
                                content: `Sorry, I couldn't find a product with SKU ${functionCall.parameters.sku}.`
                            };
                        }
                        return {
                            content: `The product "${stock.name}" (SKU: ${stock.sku}) is ${stock.stock_status.toLowerCase().replace('_', ' ')}.`
                        };
                    }
                    catch (error) {
                        return {
                            content: "Sorry, I couldn't check the stock status. Please try again."
                        };
                    }
                case 'getProducts':
                    try {
                        const products = await (0, magento_1.getProducts)();
                        if (products.length === 0) {
                            return {
                                content: "Sorry, I couldn't find any products at the moment."
                            };
                        }
                        let response = "Here are the available products:\n\n";
                        products.forEach((product, index) => {
                            response += `${index + 1}. *${product.name}*\n`;
                            response += `   SKU: ${product.sku}\n`;
                            response += `   Price: ${product.price.regularPrice.amount.value} ${product.price.regularPrice.amount.currency}\n`;
                            response += `   Stock: ${product.stock_status.toLowerCase().replace('_', ' ')}\n`;
                            if (product.color)
                                response += `   Color: ${product.color}\n`;
                            if (product.size)
                                response += `   Size: ${product.size}\n`;
                            if (product.material)
                                response += `   Material: ${product.material}\n`;
                            response += '\n';
                        });
                        response += "You can ask me about any specific product using its SKU or search for products by attributes like color, size, price, etc.";
                        return { content: response };
                    }
                    catch (error) {
                        return {
                            content: "Sorry, I couldn't fetch the product list. Please try again."
                        };
                    }
                case 'searchProducts':
                    try {
                        const products = await (0, magento_1.searchProducts)(functionCall.parameters);
                        if (products.length === 0) {
                            return {
                                content: "I couldn't find any products matching your criteria. Please try different search terms."
                            };
                        }
                        let response = "Here are the products that match your search:\n\n";
                        products.forEach((product, index) => {
                            response += `${index + 1}. *${product.name}*\n`;
                            response += `   SKU: ${product.sku}\n`;
                            response += `   Price: ${product.price.regularPrice.amount.value} ${product.price.regularPrice.amount.currency}\n`;
                            response += `   Stock: ${product.stock_status.toLowerCase().replace('_', ' ')}\n`;
                            if (product.color)
                                response += `   Color: ${product.color}\n`;
                            if (product.size)
                                response += `   Size: ${product.size}\n`;
                            if (product.material)
                                response += `   Material: ${product.material}\n`;
                            response += '\n';
                        });
                        return { content: response };
                    }
                    catch (error) {
                        return {
                            content: "Sorry, I couldn't search for products. Please try again."
                        };
                    }
                default:
                    return {
                        content: "I'm not sure how to help with that. You can:\n" +
                            "1. List all products by saying 'show products'\n" +
                            "2. Check stock status by providing a SKU\n" +
                            "3. Search for products by attributes (e.g., 'find blue shirts under 50')"
                    };
            }
        }
    });
}
