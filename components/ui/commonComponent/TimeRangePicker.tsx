"use client";

import React from "react";
import CommonInput from "../input";

interface TimeRangePickerProps {
    label?: string;
    value?: string;
    onChange: (value: string) => void;
    error?: string;
}

export default function TimeRangePicker({ label, value, onChange, error }: TimeRangePickerProps) {
    const [start, setStart] = React.useState("");
    const [end, setEnd] = React.useState("");

    React.useEffect(() => {
        if (value && value.includes("-")) {
            const [startVal, endVal] = value.split("-").map((t) => t.trim());
            setStart(startVal);
            setEnd(endVal);
        }
    }, [value]);

    const handleChange = (type: "start" | "end", val: string) => {
        const newStart = type === "start" ? val : start;
        const newEnd = type === "end" ? val : end;
        setStart(newStart);
        setEnd(newEnd);

        if (newStart && newEnd) {
            onChange(`${newStart} - ${newEnd}`);
        }
    };

    return (
        <div>
            {label && <label className="block text-sm mb-1">{label}</label>}
            <div className="flex items-center gap-2">
                <CommonInput
                    type="time"
                    value={start}
                    onChange={(e) => handleChange("start", e.target.value)}
                />
                <span className="text-gray-400">to</span>
                <CommonInput
                    type="time"
                    value={end}
                    onChange={(e) => handleChange("end", e.target.value)}
                />
            </div>
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );
}
