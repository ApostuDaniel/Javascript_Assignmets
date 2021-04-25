let vitrina = document.getElementById("vitrina");
let ShopingCart = document.getElementById("itemsBought");
let products = [];
let boughtItems = [];

const updateVitrina = async () =>
{
    const unfProducts = await fetch('http://localhost:3000/products');
    const products = await unfProducts.json();
    vitrina.innerHTML = "";
    products.forEach((produs, index) => {
        const itemVitrina = document.createElement("div");
        itemVitrina.id = produs.name;
        itemVitrina.classList.add("itemvitrina");
        let buttonRemove = `<button onclick="deleteProd(${index})">X</button>`;
        let buttonCart = `<button onclick="addToCart(${index})">Add</button>`;
        let buttonChange = `<button onclick="changeDetails(${index})">Modify</button>`;
        itemVitrina.innerHTML = `<h3>${produs.name}</h3> <p>${produs.description}</p>
                                <h3>Price: ${produs.price}$</h3>${buttonRemove}${buttonChange}`;
        if(produs.inStock){
            itemVitrina.innerHTML += buttonCart;
        }
        vitrina.appendChild(itemVitrina);
    });
};

updateVitrina()

const newProduct = async() =>
{
   
       const name = document.getElementById("inputName").value;
       const description = document.getElementById("inputDescription").value;
       let price = document.getElementById("inputPrice").value;
       const inStock = document.getElementById("inputStock").checked;
    
    if(!description)
    {
        alert("Invalid input for description")
        return;
    }

    if(!price)
    {
        price = 0;
    }
    let validName = await fetch(`http://localhost:3000/products?name=${name}&description=${description}&price=${price}&inStock=${inStock}`, {method: 'POST'});
    validName = await validName.json()
    if(!validName)
    {
        alert("Invalid input for product name");
        return;
    }
    updateVitrina();
};

const deleteProd = async (index)=>{
    await fetch(`http://localhost:3000/products/${index}`, {method: 'DELETE'});
    updateVitrina();
};

const changeDetails = async (index)=>{
    const unformated = await fetch(`http://localhost:3000/products/${index}`);
    const product = await unformated.json();
    let newName = prompt("New name:", product.name);
    let newDescription = prompt("New description:", product.description)
    let newPrice = prompt("New price:", product.price);
    let newStock = prompt("In stock(y/n)(true/false):", product.inStock);
    if(newName && newDescription && newPrice && newStock)
    {
        if(newStock === "y" || newStock === "true") newStock = true;
        else newStock = false;
        newPrice = Number(newPrice);
        if(newPrice !== NaN)
        {
            const unf = await fetch(`http://localhost:3000/products/${index}?name=${newName}&description=${newDescription}&price=${newPrice}&inStock=${newStock}`, {method: 'PATCH'});
            const response = await unf.json();
            if(response){
                alert("Changes applied sucessfuly")
                updateVitrina();
                return;
            }
            else {
                alert("Invalid product name");
                return;
            }
        }
    }
    else
    {
        alert("One or more of the data fields were empty or cancel was presed, no changes applied");
    }

}

const updateShopingCart = () =>{
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


const addToCart = async(index)=>{
    const unformated = await fetch(`http://localhost:3000/products/${index}`);
    const product = await unformated.json();
    const boughtBefore = boughtItems.some(prod => prod.name === product.name);
    if(!boughtBefore){
        let boughtItem = {
            name: product.name,
            price: product.price,
            numberOf: 1
        }
        boughtItems.push(boughtItem);
    }else{
        for(let i=0; i < boughtItems.length; ++i )
        {
            if (boughtItems[i].name === product.name)
            {
                boughtItems[i].numberOf+=1;
                break;
            }
        }
    }
    updateShopingCart();
}
document.getElementById("addProduct").addEventListener("click", newProduct);