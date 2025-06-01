import { styleText } from "node:util";

// Colors
export const red = (text: string): string => styleText("red", text);
export const green = (text: string): string => styleText("green", text);
export const yellow = (text: string): string => styleText("yellow", text);
export const blue = (text: string): string => styleText("blue", text);
export const magenta = (text: string): string => styleText("magenta", text);
export const cyan = (text: string): string => styleText("cyan", text);
export const white = (text: string): string => styleText("white", text);
// Background
export const bgWhite = (text: string): string => styleText(["bgWhite", "bold", "black"], text);
export const bgYellow = (text: string): string => styleText(["bgYellow", "bold", "black"], text);
export const bgRed = (text: string): string => styleText(["bgRed", "bold", "white"], text);
export const bgBlue = (text: string): string => styleText(["bgBlue", "bold", "black"], text);
// Format
export const bold = (text: string): string => styleText("bold", text);
export const underline = (text: string): string => styleText("underline", text);
