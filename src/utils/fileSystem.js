export async function writeFile(path, content) {
  try {
    const contentType = path.endsWith('.json') ? 'application/json' : 'text/markdown'
    const response = await fetch(path, {
      method: 'PUT',
      headers: {
        'Content-Type': contentType,
      },
      body: content
    })
    
    if (!response.ok) {
      console.error('[FileSystem] Write error:', {
        status: response.status,
        statusText: response.statusText,
        path
      })
      throw new Error(`Failed to write file: ${response.statusText}`)
    }
    
    console.log('[FileSystem] Successfully wrote file:', path)
  } catch (error) {
    console.error('[FileSystem] Error writing file:', error)
    throw error
  }
}

export async function deleteDirectory(path) {
  try {
    const response = await fetch(path, {
      method: 'DELETE'
    })
    
    if (!response.ok) {
      console.error('[FileSystem] Delete error:', {
        status: response.status,
        statusText: response.statusText,
        path
      })
      throw new Error(`Failed to delete directory: ${response.statusText}`)
    }
    
    console.log('[FileSystem] Successfully deleted directory:', path)
  } catch (error) {
    console.error('[FileSystem] Error deleting directory:', error)
    throw error
  }
}

export async function ensureDirectoryExists(path) {
  try {
    const response = await fetch(path, {
      method: 'HEAD'
    })
    
    if (!response.ok && response.status === 404) {
      console.log('[FileSystem] Directory does not exist, creating:', path)
      await fetch(path, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      })
    }
  } catch (error) {
    console.error('[FileSystem] Error ensuring directory exists:', error)
    throw error
  }
}
