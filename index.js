const express = require('express');
const cors = require('cors');

const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

require('dotenv').config()
console.log(process.env.DB_PASS)

const app = express();
const port = process.env.PORT || 5000;

// use middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.f3xgc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        const productCollection = client.db('Inventory').collection('product');

        // get product
        app.get('/product', async(req, res) =>{
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        });

        app.get('/product/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await productCollection.findOne(query);
            res.send(result);
        });

        // POST product
        app.post('/product', async(req, res) =>{
            const newproduct = req.body;
            console.log('adding new user', newproduct);
            const result = await productCollection.insertOne(newproduct);
            res.send(result)
        });

        // update product
        app.put('/product/:id', async(req, res) =>{
            const id = req.params.id;
            const updatedProduct = req.body;
            console.log(updatedProduct)
            const filter = {_id: ObjectId(id)};
            const options = { upsert: true };
            const updatedDoc = {
                $set: {

                  quantity: updatedProduct.quantity

                }
            };
            const result = await productCollection.updateOne(filter, updatedDoc, options);
            res.send(result);

        })

        // delete a user
        app.delete('/product/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await productCollection.deleteOne(query);
            res.send(result);
        })

    }
    finally{

    }
}

run().catch(console.dir);


app.get('/', (req, res) =>{
    res.send('Running My Node CRUD Server');
});

app.listen(port, () =>{
    console.log('CRUD Server is running');
})
