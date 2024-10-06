"use client";
import { useEffect, useState } from 'react';
import MarkFilter from '@/components/MarkFilter';
import ModelFilter from '@/components/ModelFilter';
import CarTable from '@/components/CarTable';
import { Pagination } from 'antd';
import styles from './page.module.css';

export default function Home() {
    const [mark, setMark] = useState(null);
    const [models, setModels] = useState([]);
    const [cars, setCars] = useState([]);
    const [page, setPage] = useState(1);

    useEffect(() => {
        async function fetchCars() {
            const res = await fetch(`/api/stock?mark=${mark}&models=${models.join(',')}&page=${page}`);
            const data = await res.json();
            setCars(data.cars);
        }
        fetchCars();
    }, [mark, models, page]);

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <h1>Сток автомобилей</h1>
                <MarkFilter onMarkChange={value => setMark(value)} />
                {mark && <ModelFilter mark={mark} onModelsChange={value => setModels(value)} />}
                <CarTable cars={cars} />
                <Pagination current={page} onChange={setPage} pageSize={20} total={100} />
            </main>
        </div>
    );
}
