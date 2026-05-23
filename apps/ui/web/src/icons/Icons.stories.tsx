import { Fragment } from 'react';
import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { Icons } from '@ui';
import * as Components from './components';
import iconRegistry from '../../../common/src/icons/svg/noun-project/icon-registry.json';

const { NounProject, ...rest } = Icons;
const IconData = {
    ...NounProject,
    ...rest,
    ...Components,
}

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
                gridTemplateColumns: 'max-content max-content max-content max-content max-content',
                alignItems: 'center',
                gap: "20px",
            }}>
                <h5></h5>
                <h5>Image url</h5>
                <h5></h5>
                <h5>Icon component</h5>
                <h5>Creator</h5>
                {Object.entries(IconData)
                    .toSorted((a, b) => a[0].localeCompare(b[0]))
                    .map(([iconName, Component]) => {
                        if (typeof Component === 'string') {
                            return (
                                <Fragment key={iconName}>
                                    <img src={Component} width={20} />
                                    <p style={{ margin: 0 }}>{iconName}</p>
                                </Fragment>
                            );
                        }
                        const data = iconRegistry.find(
                            (el) => el.id.replace('-', '') === iconName.substring(0, 'Icon'.length + 1).toLowerCase()
                        ) as { creator: string; source: string; href: string } | undefined;

                        return (
                            <Fragment key={iconName}>
                                <Component style={{ marginLeft: "40px" }} />
                                <p style={{ margin: 0 }}>{iconName}</p>
                                {data ? <p style={{ margin: 0 }}>{data.creator} from <a href={data.href} target='_blank'>{data.source}</a></p> : <p>N/A</p>}
                            </Fragment>
                        );
                    })}
            </div>
        );
    },
} satisfies Story;
