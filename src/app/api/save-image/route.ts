import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { filename, data, folder = "demo" } = body as {
      filename: string;
      data: string;
      folder?: string;
    };

    if (!filename || !data) {
      return NextResponse.json({ error: "missing filename or data" }, { status: 400 });
    }

    // prevent path traversal
    const safeName = path.basename(filename).replace(/[^a-zA-Z0-9._-]/g, "_");
    const safeFolder = folder.replace(/[^a-zA-Z0-9_-]/g, "");
    const dir = path.join(process.cwd(), "public", "images", safeFolder);
    await mkdir(dir, { recursive: true });

    const buffer = Buffer.from(data, "base64");
    const filePath = path.join(dir, safeName);
    await writeFile(filePath, buffer);

    return NextResponse.json({
      ok: true,
      path: `/images/${safeFolder}/${safeName}`,
      bytes: buffer.length,
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "save failed" },
      { status: 500 }
    );
  }
}
