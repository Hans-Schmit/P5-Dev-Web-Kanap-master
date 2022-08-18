/**
 * Start - Function to get the product with the right id from the api
 */
const start = () => {
    fetch(`http://localhost:3000/api/products/${productId}`)
        .then(res => res.json())
        .then(product => {
            insertIntoHtml(product)
        })
        .catch(err => {
            console.log(`An error has occured : ${err}`)
        })
}

class Product {
    constructor(id, color, quantity) {
        this.id = id
        this.color = color
        this.quantity = quantity
    }
}

/**
 * extract the product id from the url
 */
let url = new URL(window.location.href)
let productId = url.searchParams.get("id")

/**
 * insert the product datas in the DOM
 */
const insertIntoHtml = (product) => {
    document.title = product.name
    document.querySelector(".item__img").innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`
    document.querySelector("#title").innerText = product.name
    document.querySelector("#price").innerText = product.price
    document.querySelector("#description").innerText = product.description
    document.querySelector("#colors").insertAdjacentHTML('beforeend', product.colors.map(color => `<option value="${color}">${color}</option>`).join(''))

    startListener()
}

/**
 * Set listener to handle add product action
 */
const startListener = () => {
    document.querySelector("#addToCart").addEventListener("click", addProduct)
}

/**
 * creat and add the product (id, color and quantity) to the cart
 */
const addProduct = () => {
    let color = document.querySelector("#colors").value
    let quantity = Number(document.querySelector("#quantity").value)
    if (checkColor(color)) {
        if (checkQuantity(quantity)) {
            let addedProduct = new Product(productId, color, quantity)
            if (checkIfCartExist()) {
                checkCartForProduct(addedProduct)
            }
            else {
                addProductToCart(addedProduct)
            }
        }
    }
}
/**
 * checkColor - check if a color is selected
 * @param {*} color 
 * @returns 
 */
const checkColor = (color) => {
    let response = ""
    if (color != "") {
        response = true
    }
    else {
        alert("Veuillez selectionner une couleur")
        response = false
    }
    return response
}

/**
 * checkQuantity - check if the quantity is a number between 1 and 100 included
 * @param {*} quantity 
 * @returns 
 */
const checkQuantity = (quantity) => {
    let response = ""
    if (Number.isInteger(quantity) && 1 <= quantity && quantity <= 100) {
        response = true
    }
    else {
        alert("Veuillez selectionner une quantité (nombre entier) comprise entre 1 et 100")
        response = false
    }
    return response
}

/**
 * checkIfCartExist - check if cart exist in local storage and if not creat it
 */
const checkIfCartExist = () => {
    let cartExist = true
    if (localStorage.cart == null) {
        localStorage.cart = JSON.stringify([])
        cartExist = false
    }
    return cartExist
}

/**
 * checkCartForProduct - check if the product is already in localStorage.cart to increase the amount, if not call addProductToCart
 * @param {*} product 
 */
const checkCartForProduct = (product) => {
    let productNotAdded = true

    let tempCheckCart = JSON.parse(localStorage.cart)
    tempCheckCart.forEach(ref => {
        if (product.id == ref.id && product.color == ref.color) {
            if ((ref.quantity + product.quantity) <= 100) {
                ref.quantity += product.quantity
            }
            else {
                alert("Quantité maximum atteinte pour cet article (100 exemplaires)")
                ref.quantity = 100
            }
            productNotAdded = false
        }
    })
    localStorage.cart = JSON.stringify(tempCheckCart)

    if (productNotAdded) {
        addProductToCart(product)
    }
}

/**
 * addProductToCart - add the product at the end of the cart
 * @param {*} product 
 */
const addProductToCart = (product) => {
    let tempAddCart = JSON.parse(localStorage.cart)
    tempAddCart.push(product)
    localStorage.cart = JSON.stringify(tempAddCart)
}

// Wait for DOM release
window.addEventListener('load', start())