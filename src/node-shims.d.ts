declare const __dirname: string;
declare const process: {
  argv: string[];
  cwd(): string;
  exit(code?: number): never;
  env: { [key: string]: string | undefined };
  stdin: any & { isTTY?: boolean };
  stdout: any;
  stderr: any;
  platform: string;
};

declare module "fs" {
  const fs: any;
  export = fs;
}

declare module "path" {
  const path: any;
  export = path;
}

declare module "child_process" {
  export function spawnSync(command: string, args?: string[], options?: any): any;
  export function spawnSync(command: string, options?: any): any;
}

declare module "readline" {
  export function createInterface(options: any): any;
}
