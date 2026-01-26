import { ComponentType, FC } from "react";
import { MachineWardNoticesProps } from "./model";
import { useStateWarden } from "../state-warden";
import { useSubjectState } from "../state";

interface Props {
    noticesComponent: ComponentType<MachineWardNoticesProps>;
}

export const Notices: FC<Props> = (props) => {
    const { signaliumBureau } = useStateWarden();
    const [notices] = useSubjectState(signaliumBureau.notices$);

    return <props.noticesComponent notices={[...notices].reverse()} onRemove={signaliumBureau.removeNotice} />
};
