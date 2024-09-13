// Función base para colores
const colorize = (text: string, code: string): string => `\x1B[${code}m${text}\x1B[0m`;

// Colors
export const red = (text: string): string => colorize(text, "31");
export const green = (text: string): string => colorize(text, "32");
export const yellow = (text: string): string => colorize(text, "33");
export const blue = (text: string): string => colorize(text, "34");
export const magenta = (text: string): string => colorize(text, "35");
export const cyan = (text: string): string => colorize(text, "36");
export const white = (text: string): string => colorize(text, "37");
// Format
export const bold = (text: string): string => colorize(text, "1");
export const underline = (text: string): string => colorize(text, "4");
