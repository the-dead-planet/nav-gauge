import { Image } from 'react-native';
import RNFS from 'react-native-fs';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import { DocumentPickerResponse } from '@react-native-documents/picker';
import type { MarkerImage } from '@apparatus';
import { MobileRouteStoryGear } from '../src/route-story-gear';
import { cacheReducedImage, MobileMarkerImageData, prependFilePrefix, removeCachedImageFiles } from '../src/images/image-parser';

jest.mock('react-native-fs', () => ({
    TemporaryDirectoryPath: '/cache',
    exists: jest.fn(async () => true),
    unlink: jest.fn(async () => undefined),
    mkdir: jest.fn(async () => undefined),
    readFileAssets: jest.fn(() => new Promise<string>(() => {})),
}));
jest.mock('@lodev09/react-native-exify', () => ({ read: jest.fn(async () => ({})) }));
jest.mock('../src/layers/RouteLayer', () => ({}));
jest.mock('../src/images/ImagesLayer', () => ({}));
jest.mock('../src/player/Player', () => ({}));
jest.mock('../src/player/RouteName', () => ({}));
jest.mock('../src/animation-controls/AnimationControlsSearch', () => ({}));
jest.mock('../src/animation-controls/AnimationControls', () => ({}));
jest.mock('../src/top-bar/RecChip', () => ({}));
jest.mock('../src/layer-styling/LayerStylingPopup', () => ({}));
jest.mock('@bam.tech/react-native-image-resizer', () => ({ createResizedImage: jest.fn() }));
jest.mock('@apparatus', () => ({ glitchmitter: { transmit: jest.fn() } }));
jest.mock('@the-dead-planet/nav-gauge-gears-route-story-common', () => {
    const { BehaviorSubject } = jest.requireActual<typeof import('rxjs')>('rxjs');
    return {
        FULL_SIZE_IMAGE_SIZE: 1024,
        MAP_THUMBNAIL_SIZE: 128,
        RouteStoryGear: class {
            public images$ = new BehaviorSubject<MarkerImage<MobileMarkerImageData>[]>([]);
            public fileOperator = {
                pushInitialImage: (name: string) => this.images$.next([{ id: 0, name, progress: 0 }]),
            };
        },
    };
});
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

test('purging during a resize discards and deletes the late files', async () => {
    let finishThumbnail: (image: Awaited<ReturnType<typeof ImageResizer.createResizedImage>>) => void = () => {
        throw new Error('Thumbnail resize did not start');
    };
    let markResizeStarted: () => void = () => {};
    const resizeStarted = new Promise<void>((resolve) => { markResizeStarted = resolve; });
    jest.mocked(ImageResizer.createResizedImage)
        .mockResolvedValueOnce({ uri: 'file:///cache/images/full.jpg', path: '/cache/images/full.jpg', name: 'full.jpg', size: 10, width: 128, height: 128 })
        .mockImplementationOnce(() => new Promise((resolve) => {
            finishThumbnail = resolve;
            markResizeStarted();
        }));
    const gear = new MobileRouteStoryGear({} as ConstructorParameters<typeof MobileRouteStoryGear>[0]);
    const processing = gear.readImage(file);
    await resizeStarted;
    expect(RNFS.unlink).not.toHaveBeenCalled();
    await gear.onCleanupStory({}, gear.images$.value);
    expect(RNFS.unlink).toHaveBeenCalledWith('/cache/images');
    gear.images$.next([]);
    finishThumbnail({ uri: 'file:///cache/images/thumbnail.jpg', path: '/cache/images/thumbnail.jpg', name: 'thumbnail.jpg', size: 10, width: 128, height: 128 });
    await processing;
    expect(gear.images$.value).toEqual([]);
    expect(RNFS.unlink).toHaveBeenCalledWith('/cache/images/full.jpg');
    expect(RNFS.unlink).toHaveBeenCalledWith('/cache/images/thumbnail.jpg');
});
