import { createAgent } from './sdk';
import { model } from './model';
import { getProductStockFunction } from './functions';

let agent: any;

export async function initializeAgent() {
    agent = await createAgent();
    return agent;
}

export { agent };
