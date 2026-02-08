import { FC } from "react";
import { MachineWardNoticesProps } from "@apparatus";
import { Notice } from "./Notice";

export const Notices: FC<MachineWardNoticesProps> = ({
    notices,
    onRemove
}) => {
    return notices.map((notice, i) => (
        <Notice
            key={notice.id}
            index={i}
            notice={notice}
            onRemove={onRemove}
        />
    ));
};
