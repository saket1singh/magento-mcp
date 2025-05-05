"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const sdk_1 = require("./sdk");
const magento_1 = require("./magento");
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Serve static files from the public directory
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
// Parse JSON bodies
app.use(express_1.default.json());
let agent;
// Initialize the agent
(0, sdk_1.createAgent)().then(createdAgent => {
    agent = createdAgent;
});
// Chat API endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!agent) {
            return res.status(503).json({
                content: "The chatbot is still initializing. Please try again in a moment."
            });
        }
        const response = await agent.respond(message);
        res.json(response);
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            content: "Sorry, I encountered an error. Please try again."
        });
    }
});
app.post('/api/search', async (req, res) => {
    try {
        const filters = req.body;
        const products = await (0, magento_1.searchProducts)(filters);
        if (products.length === 0) {
            res.json({
                content: "I couldn't find any products matching your criteria. Please try different search terms."
            });
            return;
        }
        let response = "Here are the products that match your search:\n\n";
        products.forEach((product, index) => {
            response += `${index + 1}. *${product.name}*\n`;
            response += `   SKU: ${product.sku}\n`;
            response += `   Price: ${product.price.regularPrice.amount.value} ${product.price.regularPrice.amount.currency}\n`;
            response += `   Stock: ${product.stock_status}\n`;
            if (product.color)
                response += `   Color: ${product.color}\n`;
            if (product.size)
                response += `   Size: ${product.size}\n`;
            if (product.material)
                response += `   Material: ${product.material}\n`;
            response += '\n';
        });
        res.json({ content: response });
    }
    catch (error) {
        console.error('Error searching products:', error);
        res.status(500).json({
            content: "Sorry, I encountered an error while searching for products. Please try again."
        });
    }
});
// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
