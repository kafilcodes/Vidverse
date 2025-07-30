import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('icon');
    const destination = formData.get('destination') || 'public/logo';

    if (!file) {
      return NextResponse.json({ error: 'No file received.' }, { status: 400 });
    }

    // Get the file buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure the upload directory exists
    const uploadDir = path.join(process.cwd(), destination);
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      // Directory might already exist, that's ok
    }

    // Create unique filename with timestamp
    const fileName = file.name;
    const filePath = path.join(uploadDir, fileName);

    // Write the file
    await writeFile(filePath, buffer);

    // Return success response
    return NextResponse.json({ 
      message: 'Icon uploaded successfully',
      fileName: fileName,
      filePath: `/logo/${fileName}`,
      size: buffer.length
    });

  } catch (error) {
    console.error('Error uploading icon:', error);
    return NextResponse.json(
      { error: 'Failed to upload icon' },
      { status: 500 }
    );
  }
}
