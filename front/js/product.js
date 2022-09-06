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
            document.querySelector("article").textContent = `Une erreur est survenue : ${err}`
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
    document.querySelector(".item__img").insertAdjacentHTML('afterbegin', `<img src="${product.imageUrl}" alt="${product.altTxt}">`)
    document.querySelector("#title").textContent = product.name
    document.querySelector("#price").textContent = product.price
    document.querySelector("#description").textContent = product.description
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
                if (product.quantity == 1) {
                    alert(`1 Kanap ${product.color} a été ajouté au panier`)
                }
                else {
                    alert(`${product.quantity} Kanaps ${product.color} ont été ajoutés au panier`)
                }
            }
            else {
                alert("Quantité maximum atteinte pour cet article (100 exemplaires)")
                ref.quantity = 100
            }
            productNotAdded = false
        }
    })

    if (productNotAdded) {
        addProductToCart(product)
    }
    else {
        localStorage.cart = JSON.stringify(tempCheckCart)
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
    if (product.quantity == 1) {
        alert(`1 Kanap ${product.color} a été ajouté au panier`)
    }
    else {
        alert(`${product.quantity} Kanaps ${product.color} ont été ajoutés au panier`)
    }
}

// Wait for DOM release
window.addEventListener('load', start())