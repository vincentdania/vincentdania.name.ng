const PUBLIC_API_BASE_PATH = process.env.NEXT_PUBLIC_API_BASE_PATH || "/api";

export function getPublicApiPath(path: string) {
  return `${PUBLIC_API_BASE_PATH.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}
