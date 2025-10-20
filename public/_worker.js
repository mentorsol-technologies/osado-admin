export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Intercept /api/proxy/* routes
    if (url.pathname.startsWith('/api/proxy/')) {
      const BACKEND_URL = 'http://3.29.128.189';
      
      // Remove /api/proxy from the path
      const backendPath = url.pathname.replace('/api/proxy', '');
      const backendUrl = `${BACKEND_URL}${backendPath}${url.search}`;
      
      try {
        // Get the request body if it exists
        let body = null;
        if (request.method !== 'GET' && request.method !== 'HEAD') {
          body = await request.text();
        }
        
        // Forward the request
        const response = await fetch(backendUrl, {
          method: request.method,
          headers: {
            'Content-Type': request.headers.get('Content-Type') || 'application/json',
            'Authorization': request.headers.get('Authorization') || '',
          },
          body: body,
        });
        
        // Return the response
        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
        });
      } catch (error) {
        return new Response(
          JSON.stringify({ 
            error: 'Proxy failed', 
            message: error.message 
          }), 
          { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
    }
    
    // For all other routes, fetch from assets
    return env.ASSETS.fetch(request);
  }
};