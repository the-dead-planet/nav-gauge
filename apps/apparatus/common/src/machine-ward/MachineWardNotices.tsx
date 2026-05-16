import { ComponentType, FC } from "react";
import { MachineWardNoticesProps } from "./model";
import { useSubjectState } from "@tinker-chest";
import { useMachineWard } from "./useMachineWard";

interface Props {
    noticesComponent: ComponentType<MachineWardNoticesProps>;
}

export const MachineWardNotices: FC<Props> = (props) => {
    const { signaliumBureau } = useMachineWard();
    const [notices] = useSubjectState(signaliumBureau.notices$);

    return (
        <props.noticesComponent
            notices={[...notices].reverse()}
            onRemove={signaliumBureau.removeNotice}
        />
    );
};
