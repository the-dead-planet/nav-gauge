import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import * as Icons from './';

const meta = {
    title: 'Icons'
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary = {
    args: {},
    render: () => {
        return (
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'max-content max-content max-content max-content',
                alignItems: 'center',
                gap: "20px",
            }}>
                <h5></h5>
                <h5>Image url</h5>
                <h5></h5>
                <h5>React SVG component</h5>
                {Object.entries(Icons)
                    .toSorted((a, b) => a[0].localeCompare(b[0]))
                    .map(([iconName, Component]) => {
                        return (
                            <>
                                {typeof Component === 'string'
                                    ? <img src={Component} width={20} />
                                    : <Component style={{ marginLeft: "40px" }} />}
                                <p style={{ margin: 0 }}>{iconName}</p>
                            </>
                        );
                    })}
            </div>
        );
    },
} satisfies Story;
