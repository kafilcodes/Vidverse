import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile, mkdir, unlink } from 'fs/promises';
import path from 'path';

export async function POST(request) {
  try {
    const { iconSettings } = await request.json();

    if (!iconSettings) {
      return NextResponse.json({ error: 'No icon settings provided.' }, { status: 400 });
    }

    // Ensure the config directory exists
    const configDir = path.join(process.cwd(), 'src', 'config');
    try {
      await mkdir(configDir, { recursive: true });
    } catch (error) {
      // Directory might already exist, that's ok
    }

    // Read existing config or create new one
    const configPath = path.join(configDir, 'website-icons.json');
    let existingConfig = {};
    
    try {
      const existingData = await readFile(configPath, 'utf8');
      existingConfig = JSON.parse(existingData);
    } catch (error) {
      // File doesn't exist yet, start with empty config
      existingConfig = { icons: {}, lastUpdated: null };
    }

    // Update with new icon settings
    existingConfig.icons[iconSettings.id] = iconSettings;
    existingConfig.lastUpdated = new Date().toISOString();

    // Write updated config
    await writeFile(configPath, JSON.stringify(existingConfig, null, 2));

    return NextResponse.json({ 
      message: 'Icon settings saved successfully',
      configPath: '/src/config/website-icons.json',
      iconCount: Object.keys(existingConfig.icons).length
    });

  } catch (error) {
    console.error('Error saving icon settings:', error);
    return NextResponse.json(
      { error: 'Failed to save icon settings' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const configPath = path.join(process.cwd(), 'src', 'config', 'website-icons.json');
    
    try {
      const configData = await readFile(configPath, 'utf8');
      const config = JSON.parse(configData);
      
      return NextResponse.json(config);
    } catch (error) {
      // Config file doesn't exist yet
      return NextResponse.json({ icons: {}, lastUpdated: null });
    }

  } catch (error) {
    console.error('Error reading icon settings:', error);
    return NextResponse.json(
      { error: 'Failed to read icon settings' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { iconId, deleteFile } = await request.json();

    if (!iconId) {
      return NextResponse.json({ error: 'No icon ID provided.' }, { status: 400 });
    }

    const configPath = path.join(process.cwd(), 'src', 'config', 'website-icons.json');
    
    // Read existing config
    let existingConfig = {};
    try {
      const existingData = await readFile(configPath, 'utf8');
      existingConfig = JSON.parse(existingData);
    } catch (error) {
      return NextResponse.json({ error: 'No configuration found' }, { status: 404 });
    }

    // Get icon info before deletion for file cleanup
    const iconToDelete = existingConfig.icons[iconId];
    
    if (!iconToDelete) {
      return NextResponse.json({ error: 'Icon not found' }, { status: 404 });
    }

    // Delete from config
    delete existingConfig.icons[iconId];
    existingConfig.lastUpdated = new Date().toISOString();

    // Write updated config
    await writeFile(configPath, JSON.stringify(existingConfig, null, 2));

    // Optionally delete the physical file
    if (deleteFile && iconToDelete.fileName) {
      try {
        const filePath = path.join(process.cwd(), 'public', 'logo', iconToDelete.fileName);
        await unlink(filePath);
      } catch (fileError) {
        console.warn('Could not delete file:', fileError);
        // Continue anyway, config was updated
      }
    }

    return NextResponse.json({ 
      message: 'Icon deleted successfully',
      deletedIcon: iconToDelete,
      remainingIcons: Object.keys(existingConfig.icons).length
    });

  } catch (error) {
    console.error('Error deleting icon:', error);
    return NextResponse.json(
      { error: 'Failed to delete icon' },
      { status: 500 }
    );
  }
}
