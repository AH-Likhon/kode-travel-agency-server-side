const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.q3g5t.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('Travel_Agency');
        const offersCollection = database.collection('offers');
        const bookingCollection = database.collection('booking');


        // GET AllOffers API
        app.get("/allOffers", async (req, res) => {
            const result = await offersCollection.find({}).toArray();
            console.log(req.body);
            res.send(result);
        });

        // find one offer
        app.get('/allOffers/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const user = await offersCollection.findOne(query);
            console.log('Find with id', id);
            res.send(user);
        });

        // add offers api
        app.post('/offers', async (req, res) => {
            const order = req.body;
            const result = await offersCollection.insertOne(order);
            res.json(result);
        });



        //Get Booking API
        app.get("/booking", async (req, res) => {
            const result = await bookingCollection.find({}).toArray();
            console.log(req.body);
            res.send(result);
        });

        //Add Booking POST API
        app.post('/booking', async (req, res) => {
            const order = req.body;
            const result = await bookingCollection.insertOne(order);
            res.json(result);
        });

        // Delete Offer
        app.delete("/allOffers/:id", async (req, res) => {
            console.log(req.params.id);
            const result = await offersCollection.deleteOne({
                _id: ObjectId(req.params.id),
            });
            res.send(result);
        });

        // get myBooking
        app.get("/myBooking/:email", async (req, res) => {
            const result = await bookingCollection.find({
                email: req.params.email,
            }).toArray();
            res.send(result);
        });

        // update myBooking
        app.put('/myBooking/:id', async (req, res) => {
            const id = req.params.id;
            const updateBooking = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updateBooking.name,
                    email: updateBooking.email,
                    address: updateBooking.address,
                    city: updateBooking.city,
                    status: updateBooking.status,
                    phone: updateBooking.phone
                },
            };
            const result = await bookingCollection.updateOne(filter, updateDoc, options);

            console.log('Updating id', id);
            // console.log(req.body);
            res.json(result);
        })

        // Delete myBooking
        app.delete("/myBooking/:id", async (req, res) => {
            console.log(req.params.id);
            const result = await bookingCollection.deleteOne({
                _id: ObjectId(req.params.id),
            });
            res.send(result);
        });
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running My Server');
});

app.listen(port, () => {
    console.log('Server Running On Port: ', port);
});