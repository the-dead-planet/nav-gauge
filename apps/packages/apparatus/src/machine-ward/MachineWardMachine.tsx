import { FC, ReactNode } from "react";

interface Props {
    children: ReactNode;
}

export const MachineWardMachine: FC<Props> = ({ children}) => {

    return (
        <>
            {children}
        </>
    );
};
