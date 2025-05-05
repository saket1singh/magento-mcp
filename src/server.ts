import express from 'express';
import path from 'path';
import { createAgent } from './sdk';
import { getProductStock, getProducts, searchProducts } from './magento';
import { Product } from './magento';

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// Parse JSON bodies
app.use(express.json());

let agent: any;

// Initialize the agent
createAgent().then(createdAgent => {
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
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            content: "Sorry, I encountered an error. Please try again."
        });
    }
});

interface SearchRequest {
    name?: string;
    color?: string;
    maxPrice?: number;
    minPrice?: number;
    size?: string;
    material?: string;
}

app.post('/api/search', async (req, res) => {
    try {
        const filters = req.body;
        const products = await searchProducts(filters);
        
        if (products.length === 0) {
            res.json({
                content: "I couldn't find any products matching your criteria. Please try different search terms."
            });
            return;
        }

        let response = "Here are the products that match your search:\n\n";
        products.forEach((product: Product, index: number) => {
            response += `${index + 1}. *${product.name}*\n`;
            response += `   SKU: ${product.sku}\n`;
            response += `   Price: ${product.price.regularPrice.amount.value} ${product.price.regularPrice.amount.currency}\n`;
            response += `   Stock: ${product.stock_status}\n`;
            if (product.color) response += `   Color: ${product.color}\n`;
            if (product.size) response += `   Size: ${product.size}\n`;
            if (product.material) response += `   Material: ${product.material}\n`;
            response += '\n';
        });

        res.json({ content: response });
    } catch (error) {
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