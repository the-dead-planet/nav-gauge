import { Fragment } from 'react';
import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { Icons, useTheme } from '@ui';
import iconRegistry from '../../../common/src/icons/svg/noun-project/icon-registry.json';
import { Icon } from './Icon';

const { NounProject, ...rest } = Icons;
const IconData = {
    ...NounProject,
    ...rest,
}

const meta = {
    title: 'Icons'
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary = {
    render: () => {
        const theme = useTheme();

        return (
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'max-content max-content max-content max-content',
                alignItems: 'center',
                gap: "20px",
            }}>
                <h5>Img</h5>
                <h5>Component</h5>
                <h5>Name</h5>
                <h5>Creator</h5>
                {Object.entries(IconData)
                    .toSorted((a, b) => a[0].localeCompare(b[0]))
                    .map(([iconName, src]) => {
                        const data = iconRegistry.find(
                            (el) => el.id.replace('-', '') === iconName.toLowerCase()
                        ) as { creator: string; source: string; href: string } | undefined;

                        return (
                            <Fragment key={iconName}>
                                <img src={src} width={20} />
                                <Icon src={src} style={{ marginLeft: "40px" }} color={theme.componentColor('text')} />
                                <p style={{ margin: 0 }}>{iconName}</p>
                                {data ? <p style={{ margin: 0 }}>{data.creator} from <a href={data.href} target='_blank'>{data.source}</a></p> : <p>N/A</p>}
                            </Fragment>
                        );
                    })}
            </div>
        );
    },
} satisfies Story;
