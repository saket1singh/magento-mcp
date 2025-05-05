"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductStock = getProductStock;
exports.getLatestProducts = getLatestProducts;
exports.searchProducts = searchProducts;
exports.getProducts = getProducts;
const node_fetch_1 = __importDefault(require("node-fetch"));
// Using Magento 2 demo store
const MAGENTO_GRAPHQL_URL = 'https://venia.magento.com/graphql';
async function getProductStock(sku) {
    var _a, _b;
    console.log(`🔍 Checking stock for SKU: ${sku}`);
    const query = {
        query: `
      {
        products(filter: { sku: { eq: "${sku}" } }) {
          items {
            name
            sku
            stock_status
            price_range {
              minimum_price {
                regular_price {
                  value
                  currency
                }
              }
            }
          }
        }
      }
    `
    };
    try {
        console.log('📡 Sending request to Magento...');
        const response = await (0, node_fetch_1.default)(MAGENTO_GRAPHQL_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Store': 'default'
            },
            body: JSON.stringify(query)
        });
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ API Error:', {
                status: response.status,
                statusText: response.statusText,
                body: errorText
            });
            throw new Error(`Magento API error: ${response.status} ${response.statusText}`);
        }
        const result = await response.json();
        if (result.errors) {
            console.error('❌ GraphQL Errors:', result.errors);
            throw new Error(`GraphQL error: ${result.errors[0].message}`);
        }
        const product = (_b = (_a = result.data) === null || _a === void 0 ? void 0 : _a.products) === null || _b === void 0 ? void 0 : _b.items[0];
        if (!product) {
            console.log(`⚠️ No product found for SKU: ${sku}`);
            return null;
        }
        console.log(`✅ Found product: ${product.name} (${product.sku}) - ${product.stock_status}`);
        return product;
    }
    catch (error) {
        console.error('❌ Error in getProductStock:', error);
        throw error;
    }
}
async function getLatestProducts() {
    var _a, _b;
    console.log('🔍 Fetching products...');
    const query = {
        query: `
      {
        products(
          pageSize: 10
          currentPage: 1
          filter: {
            category_id: {
              eq: "2"
            }
          }
          sort: {
            name: ASC
          }
        ) {
          items {
            name
            sku
            stock_status
            price_range {
              minimum_price {
                regular_price {
                  value
                  currency
                }
              }
            }
          }
        }
      }
    `
    };
    try {
        console.log('📡 Sending request to Magento...');
        const response = await (0, node_fetch_1.default)(MAGENTO_GRAPHQL_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Store': 'default'
            },
            body: JSON.stringify(query)
        });
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ API Error:', {
                status: response.status,
                statusText: response.statusText,
                body: errorText
            });
            throw new Error(`Magento API error: ${response.status} ${response.statusText}`);
        }
        const result = await response.json();
        if (result.errors) {
            console.error('❌ GraphQL Errors:', result.errors);
            throw new Error(`GraphQL error: ${result.errors[0].message}`);
        }
        const products = ((_b = (_a = result.data) === null || _a === void 0 ? void 0 : _a.products) === null || _b === void 0 ? void 0 : _b.items) || [];
        console.log(`✅ Found ${products.length} products`);
        return products;
    }
    catch (error) {
        console.error('❌ Error in getLatestProducts:', error);
        throw error;
    }
}
async function searchProducts(filters) {
    var _a, _b;
    console.log('🔍 Searching products with filters:', filters);
    const filterConditions = [];
    if (filters.name) {
        filterConditions.push(`name: { match: "${filters.name}" }`);
    }
    if (filters.maxPrice !== undefined) {
        filterConditions.push(`price: { to: ${filters.maxPrice} }`);
    }
    if (filters.minPrice !== undefined) {
        filterConditions.push(`price: { from: ${filters.minPrice} }`);
    }
    // Add default category filter if no other filters are present
    if (filterConditions.length === 0) {
        filterConditions.push('category_id: { eq: "2" }');
    }
    const query = `
    query {
      products(
        filter: { ${filterConditions.join(', ')} }
        pageSize: 20
      ) {
        items {
          sku
          name
          price {
            regularPrice {
              amount {
                value
                currency
              }
            }
          }
          stock_status
        }
      }
    }
  `;
    console.log('📡 Sending search request to Magento...');
    console.log('Query:', query);
    try {
        const response = await (0, node_fetch_1.default)(MAGENTO_GRAPHQL_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Store': 'default'
            },
            body: JSON.stringify({ query })
        });
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ API Error:', {
                status: response.status,
                statusText: response.statusText,
                body: errorText
            });
            throw new Error(`Magento API error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log('📥 Raw API Response:', JSON.stringify(data, null, 2));
        if (data.errors) {
            console.error('❌ GraphQL Errors:', data.errors);
            throw new Error(`GraphQL error: ${data.errors[0].message}`);
        }
        if (!((_b = (_a = data.data) === null || _a === void 0 ? void 0 : _a.products) === null || _b === void 0 ? void 0 : _b.items)) {
            console.error('❌ No products found in response');
            return [];
        }
        // Transform the response to match our Product interface
        const products = data.data.products.items.map((item) => ({
            sku: item.sku,
            name: item.name,
            price: item.price,
            stock_status: item.stock_status,
            color: undefined,
            size: undefined,
            material: undefined
        }));
        console.log(`✅ Found ${products.length} matching products`);
        return products;
    }
    catch (error) {
        console.error('❌ Error searching products:', error);
        throw error;
    }
}
async function getProducts() {
    var _a, _b;
    console.log('🔍 Fetching products...');
    const query = `
        query {
            products(
                filter: { category_id: { eq: "2" } }
                pageSize: 10
            ) {
                items {
                    sku
                    name
                    price {
                        regularPrice {
                            amount {
                                value
                                currency
                            }
                        }
                    }
                    stock_status
                }
            }
        }
    `;
    console.log('📡 Sending request to Magento...');
    console.log('Query:', query);
    try {
        const response = await (0, node_fetch_1.default)(MAGENTO_GRAPHQL_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Store': 'default'
            },
            body: JSON.stringify({ query })
        });
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ API Error:', {
                status: response.status,
                statusText: response.statusText,
                body: errorText
            });
            throw new Error(`Magento API error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log('📥 Raw API Response:', JSON.stringify(data, null, 2));
        if (data.errors) {
            console.error('❌ GraphQL Errors:', data.errors);
            throw new Error(`GraphQL error: ${data.errors[0].message}`);
        }
        if (!((_b = (_a = data.data) === null || _a === void 0 ? void 0 : _a.products) === null || _b === void 0 ? void 0 : _b.items)) {
            console.error('❌ No products found in response');
            return [];
        }
        // Transform the response to match our Product interface
        const products = data.data.products.items.map((item) => ({
            sku: item.sku,
            name: item.name,
            price: item.price,
            stock_status: item.stock_status,
            color: undefined,
            size: undefined,
            material: undefined
        }));
        console.log(`✅ Found ${products.length} products`);
        return products;
    }
    catch (error) {
        console.error('❌ Error fetching products:', error);
        throw error;
    }
}
