"use client";
import { useEffect, useState } from 'react';
import { Select } from 'antd';
const { Option } = Select;

export default function MarkFilter({ onMarkChange }) {
    const [marks, setMarks] = useState([]);

    useEffect(() => {
        async function fetchMarks() {
            const res = await fetch('/api/marks');
            const data = await res.json();
            setMarks(data);
        }
        fetchMarks();
    }, []);

    return (
        <Select onChange={onMarkChange} style={{ width: 200 }}>
            {marks.map(mark => (
                <Option key={mark._id} value={mark.name}>
                    {mark.name} ({mark.count})
                </Option>
            ))}
        </Select>
    );
}
