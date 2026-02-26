import { getImageUrl } from './mapperData';
import { ResolvedImage, ImageSize } from '@/types/type';

describe('getImageUrl', () => {
  const mockImage: ResolvedImage = {
    width: 1000,
    height: 1000,
    aspectRatio: 1,
    filePath: '/path/to/image.jpg',
    urls: {
      w1280: 'http://example.com/w1280.jpg',
      w780: 'http://example.com/w780.jpg',
      w500: 'http://example.com/w500.jpg',
      w342: 'http://example.com/w342.jpg',
      w300: 'http://example.com/w300.jpg',
      w185: 'http://example.com/w185.jpg',
      w154: 'http://example.com/w154.jpg',
      w92: 'http://example.com/w92.jpg',
      original: 'http://example.com/original.jpg',
    },
  };

  it('should return the preferred size if it exists', () => {
    expect(getImageUrl(mockImage, 'w1280')).toBe('http://example.com/w1280.jpg');
  });

  it('should fall back to the next available size if preferred size is missing', () => {
    const imageMissingPreferred: ResolvedImage = {
      ...mockImage,
      urls: {
        w780: 'http://example.com/w780.jpg',
        original: 'http://example.com/original.jpg',
      },
    };
    // Preferred is w1280 (default), missing. Next in priority list is w780.
    expect(getImageUrl(imageMissingPreferred)).toBe('http://example.com/w780.jpg');
  });

  it('should return empty string if image is undefined', () => {
    expect(getImageUrl(undefined)).toBe('');
  });

  it('should return empty string if image.urls is undefined', () => {
    const imageNoUrls = { ...mockImage, urls: undefined } as unknown as ResolvedImage;
    expect(getImageUrl(imageNoUrls)).toBe('');
  });

  it('should return default logo if no matching size found', () => {
    const imageNoMatchingUrls: ResolvedImage = {
      ...mockImage,
      urls: {},
    };
    expect(getImageUrl(imageNoMatchingUrls)).toBe('/public/logoFull.png');
  });

  it('should respect the preferredSize argument and skip larger sizes', () => {
    // If we prefer w300, it should return w300 even if w500 exists (which is higher priority than w300 in the list)
    // The implementation slices the priority list starting from preferredSize.
    const image: ResolvedImage = {
      ...mockImage,
      urls: {
        w500: 'http://example.com/w500.jpg',
        w300: 'http://example.com/w300.jpg',
      },
    };
    expect(getImageUrl(image, 'w300')).toBe('http://example.com/w300.jpg');
  });

  it('should fallback correctly to smaller sizes when preferred size is not found', () => {
    const image: ResolvedImage = {
      ...mockImage,
      urls: {
        w185: 'http://example.com/w185.jpg', // lower priority than w300
        original: 'http://example.com/original.jpg',
      },
    };
    // Prefer w300. Not found. Should try w185 next.
    expect(getImageUrl(image, 'w300')).toBe('http://example.com/w185.jpg');
  });

  it('should try all sizes if preferred size is not found in priority list', () => {
    const image: ResolvedImage = {
      ...mockImage,
      urls: {
        w92: 'http://example.com/w92.jpg',
      },
    };
    // 'invalid' is not in priority list, so it should try all sizes starting from w1280...
    expect(getImageUrl(image, 'invalid' as ImageSize)).toBe('http://example.com/w92.jpg');
  });
});
