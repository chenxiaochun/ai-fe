export function info(message: string): void {
  process.stdout.write(message + "\n");
}

export function warn(message: string): void {
  process.stderr.write("警告：" + message + "\n");
}

export function error(message: string): void {
  process.stderr.write("错误：" + message + "\n");
}

export function section(title: string): void {
  process.stdout.write("\n" + title + "\n");
}
