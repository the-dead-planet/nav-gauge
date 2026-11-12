import { Image } from 'react-native';
import RNFS from 'react-native-fs';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import { DocumentPickerResponse } from '@react-native-documents/picker';
import { cacheReducedImage, prependFilePrefix, removeCachedImageFiles } from '../src/images/image-parser';

jest.mock('react-native-fs', () => ({
    TemporaryDirectoryPath: '/cache',
    exists: jest.fn(async () => true),
    unlink: jest.fn(async () => undefined),
}));
jest.mock('@bam.tech/react-native-image-resizer', () => ({ createResizedImage: jest.fn() }));
jest.mock('@apparatus', () => ({ glitchmitter: { transmit: jest.fn() } }));
jest.mock('@the-dead-planet/nav-gauge-gears-route-story-common', () => ({
    FULL_SIZE_IMAGE_SIZE: 1024,
    MAP_THUMBNAIL_SIZE: 128,
}));
jest.mock('@the-dead-planet/nav-gauge-gears-route-story-common/src/file-parser', () => ({
    getResizeDimensions: () => ({ targetWidth: 128, targetHeight: 128 }),
}));

const file: DocumentPickerResponse = {
    uri: 'file:///photos/original.jpg',
    name: 'original.jpg',
    type: 'image/jpeg',
    nativeType: 'image/jpeg',
    size: null,
    error: null,
    isVirtual: false,
    convertibleToMimeTypes: null,
    hasRequestedType: true,
};

beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Image, 'getSize').mockImplementation((_uri, success) => {
        success?.(256, 128);
        return Promise.resolve({ width: 256, height: 128 });
    });
});

afterEach(() => jest.restoreAllMocks());

test('cleans the successful resize when the other resize fails', async () => {
    const error = new Error('resize failed');
    jest.mocked(ImageResizer.createResizedImage)
        .mockRejectedValueOnce(error)
        .mockResolvedValueOnce({ uri: 'file:///cache/images/thumbnail.jpg', path: '/cache/images/thumbnail.jpg', name: 'thumbnail.jpg', size: 10, width: 128, height: 128 });
    const onError = jest.fn();
    expect(await cacheReducedImage(file, onError)).toEqual({});
    expect(RNFS.unlink).toHaveBeenCalledWith('/cache/images/thumbnail.jpg');
    expect(onError).toHaveBeenCalledWith(error);
});

test('only removes owned cache files, normalizes URIs, and deduplicates paths', async () => {
    await removeCachedImageFiles([
        'file:///cache/images/thumbnail.jpg',
        '/cache/images/thumbnail.jpg',
        file.uri,
        '/cache/unrelated.jpg',
        undefined,
    ]);
    expect(RNFS.unlink).toHaveBeenCalledTimes(1);
    expect(RNFS.unlink).toHaveBeenCalledWith('/cache/images/thumbnail.jpg');
    expect(prependFilePrefix('file:///cache/images/full.jpg')).toBe('file:///cache/images/full.jpg');
});

test('keeps successful cached images until their owner removes them', async () => {
    jest.mocked(ImageResizer.createResizedImage)
        .mockResolvedValueOnce({ uri: 'file:///cache/images/full.jpg', path: '/cache/images/full.jpg', name: 'full.jpg', size: 10, width: 128, height: 128 })
        .mockResolvedValueOnce({ uri: 'file:///cache/images/thumbnail.jpg', path: '/cache/images/thumbnail.jpg', name: 'thumbnail.jpg', size: 10, width: 128, height: 128 });
    const cached = await cacheReducedImage(file);
    expect(cached).toEqual({ fullSize: 'file:///cache/images/full.jpg', thumbnail: 'file:///cache/images/thumbnail.jpg' });
    expect(RNFS.unlink).not.toHaveBeenCalled();
    await removeCachedImageFiles([cached.fullSize, cached.thumbnail]);
    expect(RNFS.unlink).toHaveBeenCalledTimes(2);
});
