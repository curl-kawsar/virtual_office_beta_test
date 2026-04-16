export async function GET() {
  return Response.json({
    ok: true,
    service: "virtual-office",
    timestamp: new Date().toISOString(),
  });
}
