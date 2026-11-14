import { act, render } from '@testing-library/react-native';
import { Platform } from 'react-native';
import RNFS from 'react-native-fs';
import { CircularMapThumbnail } from '../src/images/CircularMapThumbnail';
import { determineSize } from '../src/images/image-parser';

const mockRasterize = jest.fn();

jest.mock('../src/images/image-parser', () => ({
    determineSize: jest.fn(),
    extractFilePathFromData: (uri: string) => uri.replace('file://', ''),
}));
jest.mock('react-native-fs', () => ({ readFile: jest.fn() }));

jest.mock('@apparatus', () => ({ glitchmitter: { transmit: jest.fn() } }));
jest.mock('@the-dead-planet/nav-gauge-gears-route-story-common', () => ({ MAP_THUMBNAIL_SIZE: 128 }));
jest.mock('@maplibre/maplibre-react-native', () => {
    const { View } = jest.requireActual<typeof import('react-native')>('react-native');
    return { Images: (props: { images: object }) => <View testID="map-images" accessibilityLabel={JSON.stringify(props.images)} /> };
});
jest.mock('react-native-svg', () => {
    const React = jest.requireActual<typeof import('react')>('react');
    const { View } = jest.requireActual<typeof import('react-native')>('react-native');
    return {
        __esModule: true,
        default: React.forwardRef((props: import('react-native-svg').SvgProps, ref) => {
            React.useImperativeHandle(ref, () => ({ toDataURL: mockRasterize }), []);
            return <View testID="thumbnail-svg" {...props}>{props.children}</View>;
        }),
        Image: (props: import('react-native-svg').ImageProps) => <View testID="svg-image" {...props} />,
        Circle: (props: import('react-native-svg').CircleProps) => <View testID="crop-circle" {...props} />,
        ClipPath: (props: import('react-native-svg').ClipPathProps) => <View testID="crop-path" {...props} />,
        Defs: View,
    };
});

beforeEach(() => jest.clearAllMocks());

test('decodes Android thumbnail data before mounting and rasterizing the SVG', async () => {
    const originalPlatform = Platform.OS;
    Platform.OS = 'android';
    jest.mocked(RNFS.readFile).mockResolvedValueOnce('photo-jpeg');
    let finishDecode: (size: { width: number; height: number }) => void = () => {};
    jest.mocked(determineSize).mockImplementationOnce(() => new Promise((resolve) => {
        finishDecode = resolve;
    }));
    try {
        const screen = await render(<CircularMapThumbnail imageId="thumbnail" uri="file:///cache/photo.jpg" />);
        expect(RNFS.readFile).toHaveBeenCalledWith('/cache/photo.jpg', 'base64');
        expect(determineSize).toHaveBeenCalledWith('data:image/jpeg;base64,photo-jpeg');
        expect(screen.queryByTestId('svg-image')).toBeNull();
        expect(mockRasterize).not.toHaveBeenCalled();
        await act(() => finishDecode({ width: 256, height: 128 }));
        expect(screen.getByTestId('svg-image').props.href).toEqual({ uri: 'data:image/jpeg;base64,photo-jpeg' });
        expect(mockRasterize).toHaveBeenCalledTimes(1);
        await act(() => mockRasterize.mock.calls[0][0]('cached-png'));
        expect(screen.getByTestId('map-images').props.accessibilityLabel).toContain('cached-png');
        await screen.unmount();
    } finally {
        Platform.OS = originalPlatform;
    }
});

test('crops to a circle and registers only the in-memory PNG after the image loads', async () => {
    const screen = await render(<CircularMapThumbnail imageId="thumbnail" uri="file:///cache/photo.jpg" />);
    expect(screen.getByTestId('thumbnail-svg').props.viewBox).toBe('0 0 128 128');
    const image = screen.getByTestId('svg-image');
    expect(image.props.preserveAspectRatio).toBe('xMidYMid slice');
    expect(image.props.clipPath).toBe('url(#thumbnail-circle)');
    expect(screen.getByTestId('crop-path').props.id).toBe('thumbnail-circle');
    const circle = screen.getByTestId('crop-circle');
    expect([circle.props.cx, circle.props.cy, circle.props.r]).toEqual(['50%', '50%', '50%']);
    expect(mockRasterize).not.toHaveBeenCalled();
    await act(() => image.props.onLoad());
    expect(mockRasterize.mock.calls[0][1]).toEqual({ width: 128, height: 128 });
    await act(() => mockRasterize.mock.calls[0][0]('circular-png'));
    expect(JSON.parse(screen.getByTestId('map-images').props.accessibilityLabel)).toEqual({
        thumbnail: { source: { uri: 'data:image/png;base64,circular-png' } },
    });
    await screen.unmount();
});
