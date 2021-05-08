const fs = require('fs');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
const mongoose = require("mongoose")
const DBurl = "mongodb+srv://<username>:<password>@cluster0.6dca8.mongodb.net/<yourDatabase>?retryWrites=true&w=majority"
mongoose.connect(DBurl, {useNewUrlParser : true, useUnifiedTopology : true});
const db = mongoose.connection;
db.on('error', () => {console.log("Could not connect")});

const productModel = new mongoose.model('products', new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    inStock: Boolean
}));

app.get('/products', async (req, res) =>{
    const myList = await productModel.find({});
    res.send(myList);
});

app.get('/products/:productId', async (req, res)=>{
    const id = req.params.productId;
    const myList = await productModel.find({});
    res.send(myList[id]);
});

app.post('/products', async (req, res) =>{
    const parameters = req.query;
    const sameName = await productModel.findOne({name: `${parameters.name}`});
    if (!parameters.name || sameName)
    {
        res.send(false);
    }
    else{
        const newProd = new productModel({name: parameters.name, description: parameters.description, price: parameters.price, inStock: parameters.inStock});
        await newProd.save();
        res.send(true);
    }
});

app.patch('/products/:productId', async(req, res)=>{
    const id = req.params.productId;
    const parameters = req.query;
    const myList = await productModel.find({});
    let validName = true;
    if(parameters.name){
        for(let i = 0; i < myList.length; ++i)
        {
            if(parameters.name == myList[i].name && i != id)
            {
                validName = false;

            }
        }
    }
    else validName = false;
    if(validName)
    {
        const query = {name: `${myList[id].name}`};
        await productModel.findOneAndUpdate(query, 
            {
                name: `${parameters.name}`,
                description: `${parameters.description}`,
                price: parameters.price,
                inStock: parameters.inStock
            });
        res.send(true);
    }
    else
    {
        res.send(false);
    }
});

app.delete('/products/:productId', async(req, res) =>{
    const id = req.params.productId;
    const myList = await productModel.find({});
    await productModel.findOneAndDelete({ name: `${myList[id].name}`});
    res.send(true); 
});

db.once('open', async () =>{app.listen(3000)});




