import { NextRequest, NextResponse } from "next/server";
export const runtime = 'edge';
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params.path, "GET");
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params.path, "POST");
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params.path, "PUT");
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params.path, "DELETE");
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params.path, "PATCH");
}

async function proxyRequest(
  request: NextRequest,
  pathSegments: string[],
  method: string
) {
  try {
    const path = pathSegments.join("/");

    // Get query parameters from the original request
    const searchParams = request.nextUrl.searchParams.toString();
    const queryString = searchParams ? `?${searchParams}` : "";

    const url = `${BACKEND_URL}/${path}${queryString}`;

    // Get body for POST, PUT, PATCH requests
    let body = undefined;
    if (["POST", "PUT", "PATCH"].includes(method)) {
      const contentType = request.headers.get("content-type");

      if (contentType?.includes("application/json")) {
        body = await request.text();
      } else if (contentType?.includes("multipart/form-data")) {
        // For file uploads
        body = await request.formData();
      } else {
        body = await request.text();
      }
    }

    // Prepare headers to forward
    const headers: HeadersInit = {
      "Content-Type": request.headers.get("content-type") || "application/json",
    };

    // Forward authorization header if present
    const authHeader = request.headers.get("authorization");
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    // Forward other common headers
    const cookieHeader = request.headers.get("cookie");
    if (cookieHeader) {
      headers["Cookie"] = cookieHeader;
    }

    // Make the proxied request
    const response = await fetch(url, {
      method,
      headers,
      body: body instanceof FormData ? body : body,
    });

    // Get response data
    const contentType = response.headers.get("content-type");
    let data;

    if (contentType?.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Return response with same status code
    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      {
        error: "Proxy request failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
