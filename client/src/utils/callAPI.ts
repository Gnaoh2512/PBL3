type RequestMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
type ResponseType = "json" | "text";

interface CallAPIOptions {
  method?: RequestMethod;
  body?: object;
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
    credentials: "include", // optional: for cookie-based auth
  };

  const response = await fetch(url, fetchOptions);
  if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);

  if (responseType === "text") {
    return response.text() as Promise<T>;
  }

  // safe parse: avoid throwing if no body
  const text = await response.text();
  return (text ? JSON.parse(text) : {}) as T;
}

export default callAPI;
