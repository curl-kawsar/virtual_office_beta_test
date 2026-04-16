export function jsonError(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

export async function readJson<T>(request: Request): Promise<T | { error: string }> {
  try {
    return (await request.json()) as T;
  } catch {
    return { error: "Invalid JSON body" };
  }
}
