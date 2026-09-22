declare module "pg-pool" {
  export interface PoolOptions {
    connectionString?: string;
    max?: number;
    idleTimeoutMillis?: number;
  }
  export class Pool {
    constructor(options: PoolOptions);
    query: (sql: string, params?: unknown[]) => Promise<{ rows: Array<Record<string, unknown>> }>;
    close?: () => Promise<void>;
  }
  export default Pool;
}
