const DEFAULT_BACKEND_URL = "https://dreamtrends-backend.onrender.com";

export function getBackendBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    process.env.BACKEND_URL ||
    DEFAULT_BACKEND_URL
  ).replace(/\/+$/, "");
}
