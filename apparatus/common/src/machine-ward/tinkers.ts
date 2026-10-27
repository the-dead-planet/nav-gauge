export const getMachineMenuLinks = (hostname?: string) => {
    const origin =
        hostname === 'localhost' ? '' : 'https://gauge.spookydoodle.com';
    const componentLibrary = hostname === 'localhost'
        ? 'http://127.0.0.1:6006'
        : `${origin}/storybook`;

    return {
        componentLibrary,
        iconCreators: `${componentLibrary}/?path=/docs/design-system-icons--docs`,
        legal: `${origin}/legal`,
        privacy: `${origin}/privacy`,
    };
};
