import { act, render } from '@testing-library/react-native';
import { Platform } from 'react-native';
import { CircularMapThumbnail } from '../src/images/CircularMapThumbnail';
import { determineSize } from '../src/images/image-parser';

const mockRasterize = jest.fn();

jest.mock('../src/images/image-parser', () => ({ determineSize: jest.fn() }));

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
        default: React.forwardRef((props: { children?: import('react').ReactNode }, ref) => {
            React.useImperativeHandle(ref, () => ({ toDataURL: mockRasterize }), []);
            return <View>{props.children}</View>;
        }),
        Image: (props: import('react-native-svg').ImageProps) => <View testID="svg-image" {...props} />,
        Circle: (props: import('react-native-svg').CircleProps) => <View testID="crop-circle" {...props} />,
        ClipPath: (props: import('react-native-svg').ClipPathProps) => <View testID="crop-path" {...props} />,
        Defs: View,
    };
});

beforeEach(() => mockRasterize.mockReset());

test('rasterizes cached Android images without waiting for an SVG load event', async () => {
    const originalPlatform = Platform.OS;
    Platform.OS = 'android';
    jest.mocked(determineSize).mockResolvedValueOnce({ width: 256, height: 128 });
    try {
        const screen = await render(<CircularMapThumbnail imageId="thumbnail" uri="file:///cache/photo.jpg" />);
        expect(determineSize).toHaveBeenCalledWith('file:///cache/photo.jpg');
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
    const image = screen.getByTestId('svg-image');
    expect(image.props.preserveAspectRatio).toBe('xMidYMid slice');
    expect(image.props.clipPath).toBe('url(#thumbnail-circle)');
    expect(screen.getByTestId('crop-path').props.id).toBe('thumbnail-circle');
    const circle = screen.getByTestId('crop-circle');
    expect([circle.props.cx, circle.props.cy, circle.props.r]).toEqual(['50%', '50%', '50%']);
    expect(mockRasterize).not.toHaveBeenCalled();
    await act(() => image.props.onLoad());
    await act(() => mockRasterize.mock.calls[0][0]('circular-png'));
    expect(JSON.parse(screen.getByTestId('map-images').props.accessibilityLabel)).toEqual({
        thumbnail: { source: { uri: 'data:image/png;base64,circular-png' } },
    });
    await screen.unmount();
});
