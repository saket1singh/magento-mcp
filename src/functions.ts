import { FunctionDefinition } from './types';
import { getProductStock } from './magento';

interface Product {
  name: string;
  sku: string;
  stock_status: string;
}

export const getProductStockFunction = new FunctionDefinition({
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
