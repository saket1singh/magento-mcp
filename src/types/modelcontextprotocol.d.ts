declare module '@modelcontextprotocol/sdk/dist/cjs/client/agent' {
  export function createAgent(config: { model: any; functions: any[] }): any;
}

declare module '@modelcontextprotocol/sdk/dist/cjs/shared/model' {
  export interface ModelDefinition {
    name: string;
    description: string;
    entities: Array<{
      name: string;
      description: string;
      attributes: Record<string, string>;
    }>;
  }

  export function defineModel(definition: ModelDefinition): any;
}

declare module '@modelcontextprotocol/sdk/dist/cjs/shared/function' {
  export interface FunctionDefinition {
    name: string;
    description: string;
    inputSchema: Record<string, string>;
    outputSchema: Record<string, string>;
    resolve: (input: any) => Promise<any>;
    render: (output: any) => string;
  }

  export function defineFunction(definition: FunctionDefinition): any;
} 