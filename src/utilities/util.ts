export function intToRGB(code: number): string {
    const c = (code & 0x00FFFFFF).toString(16).toUpperCase();
    return "00000".substring(0, 6 - c.length) + c;
}