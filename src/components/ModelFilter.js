import { useEffect, useState } from 'react';
import { Select } from 'antd';
const { Option } = Select;

export default function ModelFilter({ mark, onModelsChange }) {
    const [models, setModels] = useState([]);

    useEffect(() => {
        if (!mark) return;
        async function fetchModels() {
            const res = await fetch(`/api/stock?mark=${mark}&models=fetch`);
            const data = await res.json();
            setModels(data.map(item => item.model));
            onModelsChange(data.map(item => item.model));
        }
        fetchModels();
    }, [mark]);

    return (
        <Select mode="multiple" onChange={onModelsChange} style={{ width: 300 }}>
            {models.map(model => (
                <Option key={model} value={model}>
                    {model}
                </Option>
            ))}
        </Select>
    );
}
