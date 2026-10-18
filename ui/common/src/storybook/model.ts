export type StoryControl =
    | { control: 'boolean' | 'text'; name?: string }
    | { control: 'select'; name?: string; options: readonly unknown[]; mapping?: Record<string, unknown> }
    | { control: { type: 'number' | 'range'; min?: number; max?: number; step?: number }; name?: string };

export type StoryControls<Props extends object = Record<string, unknown>> = Partial<Record<Extract<keyof Props, string>, StoryControl>>;
