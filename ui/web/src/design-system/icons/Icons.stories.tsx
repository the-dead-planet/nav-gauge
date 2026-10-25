import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { makeLiveEditStory } from "storybook-addon-code-editor";
import {
    appearanceColorOptions,
    Icons,
    iconStoryArgs,
    iconStoryControls,
    sizeOptions,
    themeAppearanceStateOptions,
} from "@ui";
import iconRegistry from "@the-dead-planet/nav-gauge-ui-common/src/design-system/icons/svg/noun-project/icon-registry.json";
import { Icon } from "./Icon";
import { LinkText } from "../typography";
import styles from "./icons-gallery.module.css";

const { NounProject, ...otherIcons } = Icons;
const iconSources = {
    ...NounProject,
    ...otherIcons,
};

const meta = {
    title: "Design System/Icon",
    component: Icon,
    args: {
        ...iconStoryArgs,
        src: Icons.NounProject.Gear,
    },
    argTypes: iconStoryControls,
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    name: "Playground with Live code editor",
};
makeLiveEditStory(Playground, {
    availableImports: {
        "@web-ui": {
            Icon,
        },
    },
    code: `import { Icon } from '@web-ui';

export default Icon;`,
    modifyEditor: (monaco) => monaco.editor.setTheme("vs-dark"),
});

export const Gallery: Story = {
    argTypes: {
        color: {
            table: {
                disable: true,
            },
        },
        size: {
            table: {
                disable: true,
            },
        },
        src: {
            table: {
                disable: true,
            },
        },
        width: {
            table: {
                disable: true,
            },
        },
        height: {
            table: {
                disable: true,
            },
        },
        appearanceState: {
            table: {
                disable: true,
            },
        },
    },
    render: (args) => (
        <div className={styles.gallery}>
            {sizeOptions.map((size) =>
                appearanceColorOptions.map((color) => (
                    <section
                        key={`${color}-${size}`}
                        className={styles.section}
                    >
                        <h3>
                            {size} / {color}
                        </h3>
                        {themeAppearanceStateOptions.map((appearanceState) => (
                            <div key={appearanceState} className={styles.row}>
                                <span>{appearanceState}</span>
                                {[
                                    Icons.Circle,
                                    Icons.Play,
                                    Icons.NounProject.Gear,
                                ].map((src) => (
                                    <Icon
                                        {...args}
                                        key={src}
                                        src={src}
                                        color={color}
                                        size={size}
                                        width={undefined}
                                        height={undefined}
                                        appearanceState={appearanceState}
                                    />
                                ))}
                            </div>
                        ))}
                    </section>
                )),
            )}
        </div>
    ),
};

export const IconsWithCreators: Story = {
    parameters: {
        controls: {
            disable: true,
        },
    },
    render: () => (
        <table className={styles.creators}>
            <thead>
                <tr>
                    <th scope="col">Image</th>
                    <th scope="col">Component</th>
                    <th scope="col">Name</th>
                    <th scope="col">Creator</th>
                </tr>
            </thead>
            <tbody>
                {Object.entries(iconSources)
                    .sort(([first], [second]) => first.localeCompare(second))
                    .map(([iconName, src]) => {
                        const data = iconRegistry.find(
                            (entry) =>
                                entry.id.replaceAll("-", "").toLowerCase() ===
                                iconName.toLowerCase(),
                        );

                        return (
                            <tr key={iconName}>
                                <td>
                                    <img
                                        src={src}
                                        width={20}
                                        height={20}
                                        alt={iconName}
                                    />
                                </td>
                                <td>
                                    <Icon
                                        src={src}
                                        width={24}
                                        height={24}
                                        color="neutral"
                                    />
                                </td>
                                <th scope="row">{iconName}</th>
                                <td>
                                    {data ? (
                                        <>
                                            {data.creator} from{" "}
                                            <LinkText href={data.href}>
                                                {data.source}
                                            </LinkText>
                                        </>
                                    ) : (
                                        <>
                                            <LinkText href="https://boxicons.com/icons?free=true">
                                                Boxicons
                                            </LinkText>
                                            {" or "}
                                            <LinkText href="https://lucide.dev/icons">
                                                Lucide
                                            </LinkText>
                                        </>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
            </tbody>
        </table>
    ),
};
