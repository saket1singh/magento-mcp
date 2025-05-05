"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductStockFunction = void 0;
const types_1 = require("./types");
exports.getProductStockFunction = new types_1.FunctionDefinition({
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
});
