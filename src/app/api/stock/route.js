import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const mark = searchParams.get('mark');
    const modelsQuery = searchParams.get('models');
    const page = parseInt(searchParams.get('page')) || 1;
    const pageSize = 20;

    try {
        const client = await clientPromise;
        const db = client.db('hrTest');

        if (modelsQuery === 'fetch' && mark && mark !== 'null') {
            const models = await db.collection('stock')
                .aggregate([
                    { $match: { mark } },
                    { $group: { _id: '$model', count: { $sum: 1 } } }
                ])
                .toArray();
            return NextResponse.json(models.map(model => ({ model: model._id, count: model.count })));
        }

        const query = {};
        if (mark && mark !== 'null') {
            query.mark = mark;
        }
        if (modelsQuery && modelsQuery !== 'null') {
            const models = modelsQuery.split(',').filter(model => model);
            if (models.length > 0) {
                query.model = { $in: models };
            }
        }

        const totalCount = await db.collection('stock').countDocuments(query);
        const cars = await db.collection('stock')
            .aggregate([
                { $match: query },
                { $skip: (page - 1) * pageSize }, 
                { $limit: pageSize },
                {
                    $project: {
                        id: { $toString: '$_id' },
                        mark: 1,
                        model: 1,
                        modification: {
                            $concat: [
                                { $toString: '$engine.volume' },
                                ' ',
                                '$engine.transmission',
                                ' (',
                                { $toString: '$engine.power' },
                                ' л.c.) ',
                                '$drive'
                            ]
                        },
                        equipment: '$equipmentName',
                        price: { $round: ['$price', 2] },
                        createdAt: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
                    }
                }
            ])
            .toArray();

        const formattedCars = cars.map(car => ({
            ...car,
            price: car.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        }));

        return NextResponse.json({
            totalCount,
            cars: formattedCars,
            currentPage: page,
            totalPages: Math.ceil(totalCount / pageSize),
        });
    } catch (error) {
        console.error('Failed to fetch stock data:', error);
        return NextResponse.json({ message: 'Failed to fetch stock data' }, { status: 500 });
    }
}
