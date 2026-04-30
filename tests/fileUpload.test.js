const { fileFilter } = require('../utils/fileUpload');

describe('File upload fileFilter', () => {
  const makeReq = (type) => ({ body: { type } });
  const makeFile = (mimetype) => ({ mimetype });

  test('accepts valid video MIME type', () => {
    const cb = jest.fn();
    fileFilter(makeReq('video'), makeFile('video/mp4'), cb);
    expect(cb).toHaveBeenCalledWith(null, true);
  });

  test('rejects invalid MIME type for video uploads', () => {
    const cb = jest.fn();
    fileFilter(makeReq('video'), makeFile('image/png'), cb);
    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb.mock.calls[0][1]).toBe(false);
    expect(cb.mock.calls[0][0]).toBeInstanceOf(Error);
    expect(cb.mock.calls[0][0].message).toContain('not allowed for video uploads');
  });

  test('rejects unknown media type', () => {
    const cb = jest.fn();
    fileFilter(makeReq('unknown'), makeFile('video/mp4'), cb);
    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb.mock.calls[0][1]).toBe(false);
    expect(cb.mock.calls[0][0]).toBeInstanceOf(Error);
    expect(cb.mock.calls[0][0].message).toContain('Invalid media type');
  });
});
