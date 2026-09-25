import { FC, ReactNode, useState } from "react";
import { TypographyProps } from "@ui";

const booleanProps = ['bold', 'uppercase', 'tabular', 'nowrap', 'shadow', 'disabled'] as const;

export type TypographyPreviewProps = Pick<TypographyProps, (typeof booleanProps)[number]>;

export const TypographyPreview: FC<{ children: (props: TypographyPreviewProps) => ReactNode }> = ({ children }) => {
    const [props, setProps] = useState<TypographyPreviewProps>({});

    return (
        <div style={{ display: 'grid', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                {booleanProps.map((prop) => (
                    <label key={prop}>
                        <input
                            type="checkbox"
                            checked={!!props[prop]}
                            onChange={(event) => setProps({ ...props, [prop]: event.target.checked })}
                        /> {prop}
                    </label>
                ))}
            </div>
            {children(props)}
        </div>
    );
};
