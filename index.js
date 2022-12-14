const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.d1gdkts.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        const serviceCollection = client.db('petPow').collection('services');
        const reviewCollection = client.db('petPow').collection('reviews');

        // load allservices
        app.get('/services', async (req, res) => {
            const query = {};
            const sort = {index: -1}
            const cursor = serviceCollection.find(query).sort(sort);
            const services = await cursor.toArray();
            res.send(services);
        });

        // load a perticular services
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        })

        // send data to server
        app.post('/services', async (req, res) => {
            const oneservice = req.body;
            const result = await serviceCollection.insertOne(oneservice);
            res.send(result);
        })

        //send review to server
        app.post('/reviews', async (req, res) => {
            const sendreview = req.body;
            const result = await reviewCollection.insertOne(sendreview);
            res.send(result);
        })

        // get reviews from server
        app.get('/reviews', async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews)
        })

        // get id by reviews
        app.get('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { sid: id };
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        });

        // update reviews
        app.put('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const filter = {_id: ObjectId(id)};
            const review = req.body;
            const option = {upsert: true};
            const updateUser = {
                $set: {

                }
            }

        })

        //Delete add
        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        })


    }
    finally {

    }
}
run().catch(error => console.error(error))


app.get('/', (req, res) => {
    res.send('genius car server is running')
})

app.listen(port, () => {
    console.log(`Genius Car server running on ${port}`);
})