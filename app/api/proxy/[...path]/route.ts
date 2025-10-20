export const runtime = "edge";

const BACKEND_URL = "http://3.29.128.189";

export async function POST(
  request: Request,
  context: { params: { path: string[] } }
) {
  return handleRequest(request, context, "POST");
}

export async function GET(
  request: Request,
  context: { params: { path: string[] } }
) {
  return handleRequest(request, context, "GET");
}

export async function PUT(
  request: Request,
  context: { params: { path: string[] } }
) {
  return handleRequest(request, context, "PUT");
}

export async function PATCH(
  request: Request,
  context: { params: { path: string[] } }
) {
  return handleRequest(request, context, "PATCH");
}

export async function DELETE(
  request: Request,
  context: { params: { path: string[] } }
) {
  return handleRequest(request, context, "DELETE");
}

async function handleRequest(
  request: Request,
  context: { params: { path: string[] } },
  method: string
) {
  const { params } = context;
  const path = params.path.join("/");

  const url = new URL(request.url);
  const backendUrl = `${BACKEND_URL}/${path}${url.search}`;

  try {
    const body = ["POST", "PUT", "PATCH"].includes(method)
      ? await request.text()
      : undefined;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    const authHeader = request.headers.get("authorization");
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    const response = await fetch(backendUrl, {
      method,
      headers,
      body,
    });

    const data = await response.text();

    return new Response(data, {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        error: "Proxy failed",
        message: error?.message || "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
