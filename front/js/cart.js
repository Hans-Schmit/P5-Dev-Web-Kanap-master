let cart = []
let allProducts = []

/**
 * start - get the products then call the function to add the elements to the page
 */
const start = async () => {
  if (checkIfCartExist() == true && getCart().length > 0) {
    cart = getCart()
    try {
      allProducts = await fetch("http://localhost:3000/api/products/")
        .then(res => res.json())
        .then(data => {
          return (data)
        })
      // .catch(err => {
      //   document.querySelector("#cart__items").textContent = `Une erreur est survenue : ${err}`
      // })
      let datas = loopThroughCart()
      addToPage(datas)
      startListener()
    }
    catch (err) {
      document.querySelector("#cart__items").textContent = `Une erreur est survenue : ${err}`
    }
  }
  else {
    document.querySelector("#cart__items").textContent = "Panier vide !"
  }

}

/**
 * checkIfCartExist - check if cart exist in local storage and if not creat it
 */
const checkIfCartExist = () => {
  let cartExist = true
  if (localStorage.cart == null) {
    updateCart([])
    cartExist = false
  }
  return cartExist
}

/**
 * getCart - return the cart from the localStorage
 * @returns 
 */
const getCart = () => JSON.parse(localStorage.cart)

/**
 * updateCart - update the localStorage cart with a new cart
 * @param {*} cart 
 */
const updateCart = (cart) => {
  localStorage.cart = JSON.stringify(cart)
}

/**
 * deletCart - remove the "cart" item from localStorage
 */
const deletCart = () => {
  localStorage.removeItem("cart")
}

/**
 * getQuantity - return the quantity of a product in the cart
 * @param {*} prodId 
 * @param {*} prodColor 
 * @returns 
 */
const getQuantity = (prodId, prodColor) => cart.find((aProduct) => aProduct.id == prodId && aProduct.color == prodColor).quantity

/**
 * getPrice - return the price of a product
 * @param {*} prodId 
 * @returns 
 */
const getPrice = (prodId) => allProducts.find((aProduct) => aProduct._id == prodId).price

/**
 * loopThroughCart - go through the cart and  for each products call addToHtm, increase the total quantity and the total price
 * @returns 
 */
const loopThroughCart = () => {
  let datas = { htmlCode: "", totalArticles: 0, totalPrice: 0 }
  cart.forEach(article => {
    let product = allProducts.find((aProduct) => aProduct._id == article.id)
    datas.htmlCode += addToHtml(article, product)
    datas.totalArticles += Number(article.quantity)
    datas.totalPrice += Number(product.price * article.quantity)
  })
  return datas
}

/**
 * addToPage - add the cart products, total of articles and total price to the page
 * @param {*} datas 
 */
const addToPage = (datas) => {
  document.querySelector("#cart__items").innerHTML = datas.htmlCode
  document.querySelector("#totalQuantity").textContent = datas.totalArticles.toString()
  document.querySelector("#totalPrice").textContent = datas.totalPrice.toString()
}

/**
 * addToHtml - return the html code for a product
 * @param {*} article 
 * @param {*} product 
 * @returns 
 */
const addToHtml = (article, product) => {
  return `<article class="cart__item" data-id="${product._id}" data-color="${article.color}">
    <div class="cart__item__img">
      <img src="${product.imageUrl}" alt="${product.altTxt}">
    </div>
    <div class="cart__item__content">
      <div class="cart__item__content__description">
        <h2>${product.name}</h2>
        <p>${article.color}</p>
        <p>${product.price} €</p>
      </div>
      <div class="cart__item__content__settings">
        <div class="cart__item__content__settings__quantity">
          <p>Qté : ${article.quantity}</p>
          <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${article.quantity}">
        </div>
        <div class="cart__item__content__settings__delete">
          <p class="deleteItem">Supprimer</p>
        </div>
      </div>
    </div>
  </article>`
}

/**
 * startListener - add the event listener on the page
 */
const startListener = () => {
  let quantityList = document.querySelectorAll(".itemQuantity")
  let deleteList = document.querySelectorAll(".deleteItem")
  let inputList = document.querySelectorAll(".cart__order__form__question input")
  quantityList.forEach(selector => {
    selector.addEventListener("change", () => { newQuantity(selector) })
  })
  deleteList.forEach(selector => {
    selector.addEventListener("click", () => { deletItem(selector) })
  })
  inputList.forEach(selector => {
    selector.addEventListener("change", () => { testInput(selector) })
  })
  document.querySelector("#order").addEventListener("click", (event) => {
    event.preventDefault()
    checkAndSubmit(inputList)
  })
}

/**
 * newQuantity - check if the quantity is valid then modifiy the cart and the page
 * @param {*} theElement
 */
const newQuantity = (theElement) => {
  let prodId = theElement.closest(".cart__item").getAttribute("data-id")
  let prodColor = theElement.closest(".cart__item").getAttribute("data-color")
  let newQuantity = Number(theElement.value)
  oldQuantity = getQuantity(prodId, prodColor)

  if (Number.isInteger(newQuantity) && 1 <= newQuantity && newQuantity <= 100 && newQuantity != oldQuantity) {
    let modifiedQuantity = oldQuantity - newQuantity
    let productPrice = getPrice(prodId)

    cart = getCart()
    cart[cart.findIndex(checking = (product) => { return Boolean(product.id == prodId && product.color == prodColor) })].quantity = newQuantity
    updateCart(cart)

    theElement.previousElementSibling.textContent = `Qté : ${newQuantity}`
    document.querySelector("#totalQuantity").textContent -= modifiedQuantity
    document.querySelector("#totalPrice").textContent -= (modifiedQuantity * productPrice)
  }
  else {
    alert("Veuillez selectionner une quantité (nombre entier) comprise entre 1 et 100 et différente de la quantité préexistante")
  }

}

/**
 * deletItem - remove the element from the page and the local storage and adjust total quantity and total price
 * @param {*} theElement 
 */
const deletItem = (theElement) => {
  let prodId = theElement.closest(".cart__item").getAttribute("data-id")
  let prodColor = theElement.closest(".cart__item").getAttribute("data-color")
  cart = getCart()
  let deletedQuantity = getQuantity(prodId, prodColor)
  let deletedPrice = getPrice(prodId)
  cart.splice(cart.findIndex(checking = (product) => { return Boolean(product.id == prodId && product.color == prodColor) }), 1)
  updateCart(cart)
  theElement.closest(".cart__item").remove()
  document.querySelector("#totalQuantity").textContent -= deletedQuantity
  document.querySelector("#totalPrice").textContent -= (deletedQuantity * deletedPrice)
}

/**
 * testInput - test if the input of the element is valid (according to the regex associated to the element) and indicate the result to the user
 * @param {*} theElement 
 * @returns 
 */
const testInput = (theElement) => {
  let ref = theElement.getAttribute("id")
  let input = theElement.value
  let regexChoice = ""

  switch (ref) {
    case "address":
      regexChoice = /^[a-zA-Z0-9 ,.'-]{3,}$/
      // regexChoice = /^[0-9]*[A-Z\u00C0-\u00D6\u00D8-\u00DE][\\s\'\-]?([a-zA-Z0-9\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF]+[\\s\'\-]?)*[a-zA-Z0-9\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF]+$/
      break
    case "email":
      regexChoice = /^[a-zA-Z0-9\.%\+-_]{1,64}@([a-zA-Z0-9-_]{1,63}\.){1,125}[a-zA-Z]{2,63}$/
      break
    default:
      regexChoice = /^[A-Z\u00C0-\u00D6\u00D8-\u00DE][ '-]?([a-zA-Z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF]+[ '-]?)*[a-zA-Z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF]+$/
  }

  const theRegex = regexChoice

  if (theRegex.test(input)) {
    theElement.nextElementSibling.textContent = "Ok"
    return true
  }
  else {
    theElement.nextElementSibling.textContent = "Champ invalide"
    return false
  }
}

/**
 * checkAndSubmit - check the validity of the form then creat the datas to send and call submitDatas or indicates the number of errors
 * @param {*} inputList 
 */
const checkAndSubmit = (inputList) => {
  let checkValue = true
  let contact = {}
  let errorsCount = 0

  inputList.forEach(input => {
    if (testInput(input)) {
      let attributName = input.getAttribute("id")
      contact[attributName] = input.value
    }
    else {
      checkValue = false
      errorsCount += 1
    }
  })

  if (checkValue) {
    cart = getCart()
    let products = []
    cart.forEach(product => {
      products.push(product.id)
    })
    submitDatas(contact, products)
  }
  else {
    if (errorsCount == 1) {
      alert("Erreur un champ est invalide")
    }
    else {
      alert(`Erreur ${errorsCount} champs sont invalides`)
    }
  }
}

/**
 * submitDatas - send contact and products to the api then call functions deletCart and redirectToConfirmation
 * @param {*} contact 
 * @param {*} products 
 */
const submitDatas = (contact, products) => {
  let order = { contact, products }
  fetch("http://localhost:3000/api/products/order", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(order)
  })
    .then(res => res.json())
    .then(response => {
      // deletCart()
      redirectToConfirmation(response.orderId)
    })
    .catch(err => {
      alert(`Une erreur est survenue : ${err}`)
    })


}

/**
 * redirectToConfirmation - redirect to the page confirmation.html with orderId included as a parameter
 * @param {*} orderId 
 */
const redirectToConfirmation = (orderId) => {
  window.location.href = `./confirmation.html?orderId=${orderId}`
}

// Wait for DOM release
window.addEventListener('load', start())