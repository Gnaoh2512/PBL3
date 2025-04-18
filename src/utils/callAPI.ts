type RequestMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
type ResponseType = "json" | "text";

interface CallAPIOptions {
  method?: RequestMethod;
  body?: Record<string, string>;
  headers?: HeadersInit;
  responseType?: ResponseType;
}

async function callAPI<T>(url: string, options: CallAPIOptions = {}): Promise<T> {
  const { method = "GET", body, headers = {}, responseType = "json" } = options;

  const fetchOptions: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    ...(body && { body: JSON.stringify(body) }),
  };

  const response = await fetch(url, fetchOptions);
  if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);

  if (responseType === "text") {
    return response.text() as Promise<T>;
  }

  return response.json() as Promise<T>;
}

export default callAPI;
