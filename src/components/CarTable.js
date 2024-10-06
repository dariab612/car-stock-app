"use client";
import { Table } from 'antd';

export default function CarTable({ cars }) {
    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Марка/Модель', dataIndex: 'mark', key: 'mark', render: (_, record) => `${record.mark} / ${record.model}` },
        { title: 'Модификация', dataIndex: 'modification', key: 'modification' },
        { title: 'Комплектация', dataIndex: 'equipment', key: 'equipment' },
        { title: 'Стоимость', dataIndex: 'price', key: 'price', render: price => `${price.toLocaleString()} ₽` },
        { title: 'Дата создания', dataIndex: 'createdAt', key: 'createdAt', render: date => new Date(date).toLocaleDateString() },
    ];

    return <Table columns={columns} dataSource={cars} pagination={false} rowKey="id" />;
}
