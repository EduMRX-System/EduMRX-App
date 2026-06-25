"use client";

import AsyncBranchSelect from "@/components/common/AsyncBranchSelect";
import { useActiveCenterStore } from "@/store/activeCenterStore";

interface Props {
    branchValue: string;
    onBranchChange: (id: string) => void;
    branchError?: string;
    // Backward-compat props — kept so existing callers compile without changes
    centerValue?: string;
    onCenterChange?: (id: string) => void;
    centerError?: string;
    centerEditable?: boolean;
}

export default function ScopeFormFields({ branchValue, onBranchChange, branchError }: Props) {
    const { activeCenter } = useActiveCenterStore();
    return (
        <AsyncBranchSelect
            centerId={activeCenter}
            value={branchValue}
            onChange={onBranchChange}
            required
            error={branchError}
        />
    );
}
