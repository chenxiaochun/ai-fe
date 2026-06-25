export function info(message: string): void {
  process.stdout.write(message + "\n");
}

export function warn(message: string): void {
  process.stderr.write("Warning: " + message + "\n");
}

export function error(message: string): void {
  process.stderr.write("Error: " + message + "\n");
}

export function section(title: string): void {
  process.stdout.write("\n" + title + "\n");
}
