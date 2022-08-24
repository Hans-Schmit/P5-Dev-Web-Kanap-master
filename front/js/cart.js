/**
 * start - get the cart and the products then call the function to add the elements to the page
 */
const start = async () => {
  let cart = JSON.parse(localStorage.cart)
  try {
    let products = await fetch("http://localhost:3000/api/products/")
      .then(res => res.json())
      .then(data => {
        return (data)
      })
      .catch(err => {
        console.error(`An error has occured : ${err}`)
      })
    let datas = loopThroughCart(cart, products)
    addToPage(datas)
    startListener()
  }
  catch (err) {
    console.log(err)
  }

}

/**
 * loopThroughCart - go through the cart and  for each products call addToHtm, increase the total quantity and the total price
 * @param {*} cart 
 * @param {*} products 
 * @returns 
 */
const loopThroughCart = (cart, products) => {
  let datas = { htmlCode: "", totalArticles: 0, totalPrice: 0 }
  cart.forEach(article => {
    let product = products.find((aProduct) => aProduct._id == article.id)
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
  document.querySelector("#totalQuantity").innerText = datas.totalArticles.toString()
  document.querySelector("#totalPrice").innerText = datas.totalPrice.toString()
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
  document.querySelector("#order").addEventListener("click", () => { checkAndSubmit(inputList) })
}

/**
 * newQuantity - check if the quantity is valid then modifiy the cart and the page
 * @param {*} theElement
 */
const newQuantity = (theElement) => {
  let prodId = theElement.closest(".cart__item").getAttribute("data-id")
  let prodColor = theElement.closest(".cart__item").getAttribute("data-color")
  let newQuantity = Number(theElement.value)
  oldQuantity = Number(theElement.previousElementSibling.innerText.replace("Qté : ", ""))

  if (Number.isInteger(newQuantity) && 1 <= newQuantity && newQuantity <= 100 && newQuantity != oldQuantity) {
    modifiedQuantity = oldQuantity - newQuantity
    //modifier avec data
    productPrice = Number(theElement.parentElement.parentElement.previousElementSibling.firstElementChild.nextElementSibling.nextElementSibling.innerText.replace(" €", ""))

    let cart = JSON.parse(localStorage.cart)
    cart[cart.findIndex(checking = (product) => { return Boolean(product.id == prodId && product.color == prodColor) })].quantity = newQuantity
    localStorage.cart = JSON.stringify(cart)

    theElement.previousElementSibling.innerText = `Qté : ${newQuantity}`
    document.querySelector("#totalQuantity").innerText -= modifiedQuantity
    document.querySelector("#totalPrice").innerText -= (modifiedQuantity * productPrice)
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
  let cart = JSON.parse(localStorage.cart)
  //passer par le cart
  let deletedQuantity = theElement.parentElement.previousElementSibling.firstElementChild.nextElementSibling.getAttribute("value")
  //modifier avec data
  let deletedPrice = Number(theElement.parentElement.parentElement.previousElementSibling.firstElementChild.nextElementSibling.nextElementSibling.innerText.replace(" €", ""))
  cart.splice(cart.findIndex(checking = (product) => { return Boolean(product.id == prodId && product.color == prodColor) }), 1)
  localStorage.cart = JSON.stringify(cart)
  theElement.closest(".cart__item").remove()
  document.querySelector("#totalQuantity").innerText -= deletedQuantity
  document.querySelector("#totalPrice").innerText -= (deletedQuantity * deletedPrice)
}

const testInput = (theElement) => {
  let ref = theElement.getAttribute("id")
  let input = theElement.value
  let regexChoice = ""

  switch (ref) {
    case "firstName":
    case "lastName":
    case "city":
      regexChoice = /^[A-Za-z]+$/
      // regexChoice = /^(([A-Za-z]+[\-\']?)*([A-Za-z]+)?\s)+([A-Za-z]+[\-\']?)*([A-Za-z]+)?$/
      // regexChoice = /^[A-Z\u00C0-\u00D6\u00D8-\u00DE][\s\'\-]?([a-zA-Z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF]+[\s\'\-]?)*[a-zA-Z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF\]+$/
      break
    case "address":
      regexChoice = /^[a-zA-Z0-9\s,.'-]{3,}$/
      // regexChoice = /^[0-9]*[A-Z\u00C0-\u00D6\u00D8-\u00DE][\\s\'\-]?([a-zA-Z0-9\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF]+[\\s\'\-]?)*[a-zA-Z0-9\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF\]+$/
      break
    case "email":
      regexChoice = /^[a-zA-Z0-9\.%\+-_]{1,64}@([a-zA-Z0-9-_]{1,63}\.){1,125}[a-zA-Z]{2,63}$/
      break
    default:
      console.log("error on testInput element")
  }

  const theRegex = regexChoice
  console.log(theRegex)

  if (theRegex.test(input)) {
    theElement.nextElementSibling.innerText = "Ok"
    return true
  }
  else {
    theElement.nextElementSibling.innerText = "Incorrect"
    return false
  }
}

const checkAndSubmit = (inputList) => {
  let checkValue = true
  let contact = {}

  inputList.forEach(input => {
    if (testInput(input)) {
      let attributName = input.getAttribute("id")
      contact[attributName] = input.value
    }
    else {
      checkValue = false
    }
  })

  if (checkValue) {
    let cart = JSON.parse(localStorage.cart)
    let products = []
    cart.forEach(product => {
      products.push(product.id)
    })
    console.log(contact)
    console.log(products)
    // submitDatas(contact, products)
    alert("ça marche !")
  }
  else {
    alert("error some inputs are incorrect")
  }
}

const submitDatas = (contact, products) => {

}

// Wait for DOM release
window.addEventListener('load', start())