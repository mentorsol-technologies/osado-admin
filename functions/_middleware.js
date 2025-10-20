export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  if (url.pathname.startsWith("/api/proxy/")) {
    const BACKEND_URL = "http://3.29.128.189";
    const backendPath = url.pathname.replace("/api/proxy", "");
    const backendUrl = `${BACKEND_URL}${backendPath}${url.search}`;

    console.log("Proxying to:", backendUrl);

    try {
      const response = await fetch(backendUrl, {
        method: request.method,
        headers: {
          "Content-Type":
            request.headers.get("Content-Type") || "application/json",
          Authorization: request.headers.get("Authorization") || "",
        },
        body:
          request.method !== "GET" && request.method !== "HEAD"
            ? await request.text()
            : undefined,
      });

      console.log("Backend response status:", response.status);
      return new Response(response.body, {
        status: response.status,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Proxy error:", error);
      return new Response(
        JSON.stringify({
          error: "Proxy failed",
          message: error.message,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }

  // For all other routes, continue to the next middleware/page
  return context.next();
}
