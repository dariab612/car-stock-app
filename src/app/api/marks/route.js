import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db('hrTest');

        const marks = await db.collection('stock').aggregate([
            {
                $group: {
                    _id: '$mark',
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    name: '$_id',
                    count: 1
                }
            }
        ]).toArray();

        const formattedMarks = marks.map((mark, index) => ({
            id: index + 1,
            name: mark.name,
            count: mark.count
        }));

        return NextResponse.json(formattedMarks);
    } catch (error) {
        console.error('Failed to fetch marks:', error);
        return NextResponse.json({ message: 'Failed to fetch marks' }, { status: 500 });
    }
}
