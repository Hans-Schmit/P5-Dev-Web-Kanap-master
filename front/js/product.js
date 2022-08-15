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
    let colorsHtml = ""
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
 * add the product (id, color and quantity) to the cart
 */
const addProduct = () => {
    let color = document.querySelector("#colors").value
    let quantity = Number(document.querySelector("#quantity").value)
    if (checkColor(color) && checkQuantity(quantity)) {
        let addedProduct = new Product(productId, color, quantity)
        console.log(addedProduct)
    }
}
/**
 * checkColor - check if a color is selected
 * @param {*} color 
 * @returns 
 */
const checkColor = (color) => Boolean(color != "")

/**
 * checkQuantity - check if the quantity is a number between 1 and 100 included
 * @param {*} quantity 
 * @returns 
 */
const checkQuantity = (quantity) => Boolean(1 <= quantity && quantity <= 100)

// Wait for DOM release
window.addEventListener('load', start())