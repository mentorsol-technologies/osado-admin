export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Only intercept /api/proxy/* routes
    if (url.pathname.startsWith("/api/proxy/")) {
      const BACKEND_URL = "http://3.29.128.189";

      // Remove /api/proxy from the path
      const backendPath = url.pathname.replace("/api/proxy", "");
      const backendUrl = `${BACKEND_URL}${backendPath}${url.search}`;

      try {
        const response = await fetch(backendUrl, {
          method: request.method,
          headers: request.headers,
          body: request.body,
        });

        return response;
      } catch (error) {
        return new Response(
          JSON.stringify({ error: "Proxy failed", message: error.message }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }

    // For all other routes, pass through to Pages
    return env.ASSETS.fetch(request);
  },
};
