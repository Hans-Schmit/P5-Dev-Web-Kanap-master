class Product {
    constructor(id, color, quantity) {
        this.id = id;
        this.color = color;
        this.quantity = quantity;
    }
}

//extract the product id from the url
let url = new URL(window.location.href);
let productId = url.searchParams.get("id");

//insert the product datas in the DOM
const insertIntoHtml = (product) => {
    let colorsHtml = "";
    document.title = product.name;
    document.getElementsByClassName("item__img")[0].innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`;
    document.getElementById("title").innerText = product.name;
    document.getElementById("price").innerText = product.price;
    document.getElementById("description").innerText = product.description;
    for (let color of product.colors) {
        colorsHtml += `<option value="${color}">${color}</option>`;
    }
    document.getElementById("colors").innerHTML += colorsHtml;
}

//add the product (id, color and quantity) to the cart
const addProduct = (event) => {
    event.stopPropagation();
    let color = document.getElementById("colors").value;
    let quantity = document.getElementById("quantity").value;
    let addedProduct = new Product(productId, color, quantity);
    console.log(addedProduct);
}

fetch(`http://localhost:3000/api/products/${productId}`) //get the product with the right id from the api
    .then(function (res) {
        if (res.ok) {
            return res.json();
        }
    })
    .then(function (product) {
        insertIntoHtml(product);
    })
    .catch(function (err) {
        console.log(`An error has occured : ${err}`);
    });


document.getElementById("addToCart").addEventListener("click", addProduct);