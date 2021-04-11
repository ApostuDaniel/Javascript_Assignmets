let vitrina = document.getElementById("vitrina");
let ShopingCart = document.getElementById("itemsBought");
let products = [];
let boughtItems = [];

const updateVitrina = () =>
{
    vitrina.innerHTML = "";
    products.forEach((produs, index) => {
        const itemVitrina = document.createElement("div");
        itemVitrina.id = produs.name;
        itemVitrina.classList.add("itemvitrina");
        let buttonRemove = `<button onclick="deleteProd(${index})">X</button>`;
        let buttonCart = `<button onclick="addToCart(${index})">Add</button>`;
        itemVitrina.innerHTML = `<h3>${produs.name}</h3> <p>${produs.description}</p>
                                <h3>Price: ${produs.price}$</h3>${buttonRemove}`;
        if(produs.inStock){
            itemVitrina.innerHTML += buttonCart;
        }
        vitrina.appendChild(itemVitrina);
    });
};

const newProduct = () =>{
    let product = {
        name: document.getElementById("inputName").value,
        description: document.getElementById("inputDescription").value,
        price: document.getElementById("inputPrice").value,
        inStock: document.getElementById("inputStock").checked
    }

    if (!product.name || products.some(arrObj => arrObj.name === product.name))
    {
        alert("Invalid input for product name");
        return;
    }
    if(!product.price)
    {
        product.price = 0;
    }
    products.push(product);
    updateVitrina();
}

const deleteProd = (index)=>{
    products.splice(index, 1);
    updateVitrina();
};

const updateShopingCart = ()=>{
    ShopingCart.innerHTML = '';
    let totalPrice = 0;
    boughtItems.forEach((item)=>{
        const shopingItem = document.createElement("li");
        const inCartName = item.name.toLowerCase();
        shopingItem.innerHTML = `<p>${item.numberOf}x ${inCartName}</p>`;
        totalPrice += item.price * item.numberOf;
        ShopingCart.appendChild(shopingItem);
    });
    document.getElementById("totalPrice").innerHTML = `Total Price: ${totalPrice} $`;
};


const addToCart = (index)=>{
    const boughtBefore = boughtItems.some(prod => prod.name === products[index].name);
    if(!boughtBefore){
        let boughtItem = {
            name: products[index].name,
            price: products[index].price,
            numberOf: 1
        }
        boughtItems.push(boughtItem);
    }else{
        for(let i=0; i < boughtItems.length; ++i )
        {
            if (boughtItems[i].name === products[index].name)
            {
                boughtItems[i].numberOf+=1;
                break;
            }
        }
    }
    updateShopingCart();
}

document.getElementById("addProduct").addEventListener("click", newProduct);