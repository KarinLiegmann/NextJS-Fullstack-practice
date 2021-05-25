import { MongoClient } from 'mongodb';

// /api/new-meetup


async function handler(req, res) {
    if (req.method === 'POST') {

        try {
            const data = req.body;

            const client = await MongoClient.connect(process.env.DB_KEY);
            const db = client.db();

            const meetupsCollection = db.collection('meetups');

            const result = await meetupsCollection.insertOne(data);

            console.log(result);

            client.close();

            res.status(201).json({ message: 'Meetup inserted!' })

        } catch (error) {
            console.error(error.message)
        }
    }
}

export default handler;