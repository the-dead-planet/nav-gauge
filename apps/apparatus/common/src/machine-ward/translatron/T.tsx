import { FC } from "react";
import { useMachineWard } from "../useMachineWard";
import { useSubjectState } from "@tinker-chest";

export interface TranslatronWrapperProps {
    namespace: string;
    params?: { [key in string]: string | number; };
    /**
     * Key of the translation
     */
    children: string;
}

/**
 * Wrapper component for texts which translates
 * @returns 
 */
export const T: FC<TranslatronWrapperProps> = ({
    namespace,
    params,
    children
}) => {
    const { individuator, translatron } = useMachineWard();
    const [settings] = useSubjectState(individuator.settings$);
    const [registry] = useSubjectState(translatron.registry$);

    return (
        <>{translatron.translate(settings.language, registry, namespace, children, params)}</>
    );
};
