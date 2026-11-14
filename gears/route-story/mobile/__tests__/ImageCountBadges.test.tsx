import { render } from '@testing-library/react-native';
import { getImageCountBadges } from '@the-dead-planet/nav-gauge-gears-route-story-common/src/layer-specification/image-count-badges';
import { ImageCountBadges } from '../src/images/ImageCountBadges';

const mockRemovedImages: string[] = [];
const mockRasterize = jest.fn((callback: (base64: string) => void) => callback('badge-png'));

jest.mock('@the-dead-planet/nav-gauge-gears-route-story-common', () =>
    jest.requireActual('@the-dead-planet/nav-gauge-gears-route-story-common/src/layer-specification/image-count-badges'),
);
jest.mock('react-native-svg', () => {
    const React = jest.requireActual<typeof import('react')>('react');
    const Svg = React.forwardRef((_props, ref) => {
        React.useImperativeHandle(ref, () => ({ toDataURL: mockRasterize }), []);
        return null;
    });
    return {
        SvgXml: ({ override }: { override: import('react').RefAttributes<unknown> }) => <Svg {...override} />,
    };
});
jest.mock('@maplibre/maplibre-react-native', () => {
    const React = jest.requireActual<typeof import('react')>('react');
    const { View } = jest.requireActual<typeof import('react-native')>('react-native');
    return {
        Images: ({ images }: { images: Record<string, object> }) => {
            React.useEffect(() => () => { mockRemovedImages.push(...Object.keys(images)); }, []);
            return <View testID="count-badge" accessibilityLabel={Object.keys(images)[0]} />;
        },
    };
});

test('replaces the ten in-memory map images when badge colors change', async () => {
    const screen = await render(<ImageCountBadges backgroundColor="#123456" textColor="#ffffff" />);
    const originalNames = getImageCountBadges('#123456', '#ffffff').map(({ id }) => id);
    expect(screen.getAllByTestId('count-badge').map((element) => element.props.accessibilityLabel)).toEqual(originalNames);
    expect(mockRasterize).toHaveBeenCalledTimes(10);

    await screen.rerender(<ImageCountBadges backgroundColor="#abcdef" textColor="#111111" />);
    expect(mockRemovedImages).toEqual(originalNames);
    expect(screen.getAllByTestId('count-badge').map((element) => element.props.accessibilityLabel)).toEqual(
        getImageCountBadges('#abcdef', '#111111').map(({ id }) => id),
    );
    expect(mockRasterize).toHaveBeenCalledTimes(20);
    await screen.unmount();
});
