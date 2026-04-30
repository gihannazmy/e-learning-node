# Media Upload API Documentation

## Overview
The e-learning platform supports comprehensive media upload functionality for courses, allowing instructors and administrators to upload various types of media files including videos, audio files, documents, and images.

## Features
- **File Upload**: Secure multipart/form-data file uploads
- **File Type Validation**: Support for video, audio, document, and image files
- **File Size Limits**: Configurable maximum file sizes (default: 5MB)
- **File Streaming**: HTTP range requests for video/audio streaming
- **File Management**: CRUD operations for media files
- **Access Control**: Role-based permissions (instructors and admins)
- **File Storage**: Local file system storage with URL generation

## API Endpoints

### Upload Media File
**POST** `/api/v1/course-media`

Upload a media file for a course.

**Authentication:** Required (Instructor/Admin)
**Content-Type:** `multipart/form-data`

**Request Body:**
- `file` (file): The media file to upload (required)
- `courseId` (string): MongoDB ObjectId of the course (required)
- `title` (string): Media title (3-100 characters, required)
- `description` (string): Media description (optional, max 500 characters)
- `type` (string): Media type - 'video', 'audio', 'document', 'image' (required)
- `duration` (number): Duration in seconds for video/audio (optional)
- `order` (number): Display order (optional, default: 0)

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/v1/course-media \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@video.mp4" \
  -F "courseId=60d5ecb74b24c72b8c8b4567" \
  -F "title=Introduction to Programming" \
  -F "description=Basic programming concepts" \
  -F "type=video" \
  -F "duration=3600"
```

**Success Response (201):**
```json
{
  "status": "success",
  "data": {
    "courseMedia": {
      "_id": "60d5ecb74b24c72b8c8b4568",
      "courseId": "60d5ecb74b24c72b8c8b4567",
      "title": "Introduction to Programming",
      "description": "Basic programming concepts",
      "type": "video",
      "filename": "introduction-to-programming-1234567890.mp4",
      "originalName": "video.mp4",
      "mimeType": "video/mp4",
      "path": "uploads/introduction-to-programming-1234567890.mp4",
      "url": "http://localhost:3000/uploads/introduction-to-programming-1234567890.mp4",
      "size": 10485760,
      "fileSize": 10485760,
      "duration": 3600,
      "uploadedBy": "60d5ecb74b24c72b8c8b4569",
      "order": 0,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "fileSizeFormatted": "10 MB"
    }
  }
}
```

### Get Course Media
**GET** `/api/v1/course-media`

Retrieve course media with optional filtering and pagination.

**Authentication:** Required
**Query Parameters:**
- `courseId` (string): Filter by course ID
- `type` (string): Filter by media type
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)

**Example Request:**
```bash
curl -X GET "http://localhost:3000/api/v1/course-media?courseId=60d5ecb74b24c72b8c8b4567&type=video&page=1&limit=5" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Single Media
**GET** `/api/v1/course-media/:id`

Retrieve a specific media file by ID.

**Authentication:** Required

### Stream Media File
**GET** `/api/v1/course-media/:id/stream`

Stream a media file (supports range requests for video/audio).

**Authentication:** Required
**Headers:**
- `Range`: For partial content requests (e.g., `bytes=0-1023`)

### Update Media
**PUT** `/api/v1/course-media/:id`

Update media metadata (title, description, order).

**Authentication:** Required (Instructor/Admin)

### Delete Media
**DELETE** `/api/v1/course-media/:id`

Delete a media file (removes both database record and file from storage).

**Authentication:** Required (Admin only)

### Get Media Statistics
**GET** `/api/v1/course-media/stats`

Get media statistics grouped by type.

**Authentication:** Required (Admin only)

**Response:**
```json
{
  "status": "success",
  "data": {
    "byType": [
      {
        "_id": "video",
        "count": 15,
        "totalSize": 1572864000
      },
      {
        "_id": "document",
        "count": 8,
        "totalSize": 52428800
      }
    ],
    "overall": {
      "totalFiles": 23,
      "totalSize": 1625282800
    }
  }
}
```

## Supported File Types

### Video Files
- MP4 (.mp4)
- AVI (.avi)
- MOV (.mov)
- WMV (.wmv)
- FLV (.flv)
- WebM (.webm)

### Audio Files
- MP3 (.mp3)
- WAV (.wav)
- M4A (.m4a)
- AAC (.aac)
- OGG (.ogg)

### Document Files
- PDF (.pdf)
- Word (.doc, .docx)
- Plain Text (.txt)

### Image Files
- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)
- SVG (.svg)

## Configuration

File upload settings can be configured via environment variables:

```env
# Maximum file size in bytes (default: 5MB)
MAX_FILE_SIZE=5242880

# Upload directory path (default: ./uploads)
FILE_UPLOAD_PATH=./uploads
```

## Error Handling

### File Upload Errors
- **File too large**: `File too large. Maximum size allowed is XMB`
- **Invalid file type**: `File type not allowed for X uploads`
- **Missing file**: `No file uploaded`
- **Invalid media type**: `Invalid media type: X. Must be video, audio, document, or image`

### Validation Errors
- **Invalid course ID**: `Please provide a valid course ID`
- **Invalid title**: `Media title must be between 3 and 100 characters`
- **Invalid type**: `Type must be video, audio, document, or image`

## Security Features

- **File type validation**: Only allowed MIME types are accepted
- **File size limits**: Prevents oversized file uploads
- **Access control**: Role-based permissions for upload operations
- **Input sanitization**: XSS prevention on metadata fields
- **Secure file storage**: Files stored outside web root with controlled access

## File Storage

- **Location**: Files are stored in the `./uploads` directory
- **Naming**: Unique filenames with timestamps to prevent conflicts
- **URL Access**: Files accessible via `/uploads/filename` endpoint
- **Cleanup**: Files automatically deleted when media records are removed

## Best Practices

1. **File Size**: Keep video files under 100MB for better performance
2. **Compression**: Compress media files before upload
3. **Organization**: Use descriptive titles and organize by course
4. **Access**: Regularly review and clean up unused media files
5. **Backup**: Implement backup strategies for uploaded media

## Client Integration

### HTML Form Example
```html
<form action="/api/v1/course-media" method="POST" enctype="multipart/form-data">
  <input type="file" name="file" accept="video/*,audio/*,image/*,.pdf,.doc,.docx,.txt" required>
  <input type="text" name="courseId" placeholder="Course ID" required>
  <input type="text" name="title" placeholder="Media Title" required>
  <select name="type" required>
    <option value="video">Video</option>
    <option value="audio">Audio</option>
    <option value="document">Document</option>
    <option value="image">Image</option>
  </select>
  <textarea name="description" placeholder="Description"></textarea>
  <input type="number" name="duration" placeholder="Duration (seconds)">
  <button type="submit">Upload Media</button>
</form>
```

### JavaScript (Fetch API) Example
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('courseId', '60d5ecb74b24c72b8c8b4567');
formData.append('title', 'Course Introduction');
formData.append('type', 'video');
formData.append('description', 'Introduction video for the course');

fetch('/api/v1/course-media', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
})
.then(response => response.json())
.then(data => console.log('Upload successful:', data))
.catch(error => console.error('Upload failed:', error));
```