const fs = require('fs');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
fs.closeSync(fs.openSync('data.json', 'a'))
const unformated = fs.readFileSync('data.json');
let myList = [];
if(unformated.length !== 0){
    let formated = JSON.parse(unformated);
    myList = [...formated];
}

app.get('/products', (req, res) =>{
    res.send(myList);
});

app.get('/products/:productId', (req, res)=>{
    const id = req.params.productId;
    res.send(myList[id]);
});

app.post('/products', (req, res) =>{
    const parameters = req.query;
    if (!parameters.name || myList.some(arrObj => arrObj.name === parameters.name))
    {
        res.send(false);
    }
    else{
        myList.push({name: parameters.name, description: parameters.description, price: parameters.price, inStock: parameters.inStock});
        fs.writeFileSync('data.json', JSON.stringify(myList));
        res.send(true);
    }
});

app.patch('/products/:productId', (req, res)=>{
    const id = req.params.productId;
    const parameters = req.query;
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
        myList[id].name = parameters.name;
        myList[id].description = parameters.description;
        myList[id].price = parameters.price;
        myList[id].inStock = parameters.inStock;
        fs.writeFileSync('data.json', JSON.stringify(myList));
        res.send(true);
    }
    else
    {
        res.send(false);
    }
});

app.delete('/products/:productId', (req, res) =>{
    const id = req.params.productId;
    myList.splice(id, 1);
    fs.writeFileSync('data.json', JSON.stringify(myList));
    res.send(true); 
});

app.listen(3000);



