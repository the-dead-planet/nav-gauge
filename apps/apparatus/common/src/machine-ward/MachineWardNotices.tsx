import { ComponentType, FC } from "react";
import { MachineWardNoticesProps } from "./model";
import { useStateWarden } from "../state-warden";
import { useSubjectState } from "@tinker-chest";

interface Props {
    noticesComponent: ComponentType<MachineWardNoticesProps>;
}

export const MachineWardNotices: FC<Props> = (props) => {
    const { signaliumBureau } = useStateWarden();
    const [notices] = useSubjectState(signaliumBureau.notices$);

    return (
        <props.noticesComponent
            notices={[...notices].reverse()}
            onRemove={signaliumBureau.removeNotice}
        />
    );
};
