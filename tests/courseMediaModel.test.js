const mongoose = require('mongoose');
const config = require('../utils/config');
const CourseMedia = require('../models/CourseMedia');

jest.setTimeout(20000);

describe('CourseMedia model validation', () => {
  beforeAll(async () => {
    await mongoose.connect(config.database.testUri);
  });

  afterEach(async () => {
    if (mongoose.connection.readyState === 1) {
      await CourseMedia.deleteMany({});
    }
  });

  afterAll(async () => {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.dropDatabase();
      await mongoose.disconnect();
    }
  });

  test('creates a valid CourseMedia document', async () => {
    const doc = await CourseMedia.create({
      courseId: new mongoose.Types.ObjectId(),
      title: 'Sample Media',
      description: 'A reliable test media item',
      type: 'video',
      filename: 'sample-video.mp4',
      originalName: 'video.mp4',
      mimeType: 'video/mp4',
      path: 'uploads/sample-video.mp4',
      url: 'http://localhost:3000/uploads/sample-video.mp4',
      size: 1024,
      fileSize: 1024,
      uploadedBy: new mongoose.Types.ObjectId(),
      order: 1
    });

    expect(doc).toBeDefined();
    expect(doc.title).toBe('Sample Media');
    expect(doc.type).toBe('video');
    expect(doc.fileSizeFormatted).toMatch(/KB|Bytes/);
  });

  test('throws validation error when required fields are missing', async () => {
    expect.assertions(2);

    try {
      await CourseMedia.create({
        title: 'Incomplete media'
      });
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.name).toBe('ValidationError');
    }
  });
});
