export function cap(str: string): string {
  const decodedStr = decodeURIComponent(str);
  return decodedStr
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
    .replace(/(\s*,\s*)/g, ", ");
}

export function url(str: string): string {
  return str.trim().toLowerCase().replace(/\s+/g, "-");
}

export function norm(str: string): string {
  return str.toLowerCase().replace(/[\s-]/g, "");
}
