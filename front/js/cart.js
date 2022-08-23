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
  quantityList.forEach(selector => {
    selector.addEventListener("change", () => { newQuantity(selector) })
  })
  deleteList.forEach(selector => {
    selector.addEventListener("click", () => { deletItem(selector) })
  })

}

/**
 * newQuantity - check if the quantity is valid then modifiy the cart and the page
 * @param {*} theElement 
 * @param {*} prodId 
 * @param {*} prodColor 
 */
const newQuantity = (theElement) => {
  let prodId = theElement.closest(".cart__item").getAttribute("data-id")
  let prodColor = theElement.closest(".cart__item").getAttribute("data-color")
  let newQuantity = Number(theElement.value)
  oldQuantity = Number(theElement.previousElementSibling.innerText.replace("Qté : ", ""))

  if (Number.isInteger(newQuantity) && 1 <= newQuantity && newQuantity <= 100 && newQuantity != oldQuantity) {
    modifiedQuantity = oldQuantity - newQuantity
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
 * @param {*} prodId 
 * @param {*} prodColor 
 */
const deletItem = (theElement) => {
  let prodId = theElement.closest(".cart__item").getAttribute("data-id")
  let prodColor = theElement.closest(".cart__item").getAttribute("data-color")
  let cart = JSON.parse(localStorage.cart)
  let deletedQuantity = theElement.parentElement.previousElementSibling.firstElementChild.nextElementSibling.getAttribute("value")
  let deletedPrice = Number(theElement.parentElement.parentElement.previousElementSibling.firstElementChild.nextElementSibling.nextElementSibling.innerText.replace(" €", ""))
  cart.splice(cart.findIndex(checking = (product) => { return Boolean(product.id == prodId && product.color == prodColor) }), 1)
  console.log(cart)
  localStorage.cart = JSON.stringify(cart)
  theElement.closest(".cart__item").remove()
  document.querySelector("#totalQuantity").innerText -= deletedQuantity
  document.querySelector("#totalPrice").innerText -= (deletedQuantity * deletedPrice)
}

// Wait for DOM release
window.addEventListener('load', start())