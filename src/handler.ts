import { IncomingMessage, ServerResponse } from "http";

export const handler = async (req: IncomingMessage, res: ServerResponse) => {
  console.log(`Received request: ${req.method} ${req.url}`);
  

  const parsedURL = new URL(req.url ?? "", `http://${req.headers.host}`);
  const keyword = parsedURL.searchParams.get("keyword");

  console.log("Method:", req.method);
console.log("URL:", req.url);
console.log("Host:", req.headers.host);
console.log("Parsed URL:", parsedURL);

  if (req.method !== "GET" || parsedURL.pathname === "/favicon.ico") {
    res.writeHead(404, "Not Found");
    res.end();
    return;
  }

  res.writeHead(200, { "Content-Type": "text/plain" });
  res.write(keyword ? `Hello, ${keyword}` : "Hello, HTTP");
  res.end();
};