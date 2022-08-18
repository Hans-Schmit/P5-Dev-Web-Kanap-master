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


const startListener = () => {
  let quantityList = Array.from(document.querySelectorAll(".itemQuantity"))
  let deleteList = Array.from(document.querySelectorAll(".deleteItem"))
  quantityList.forEach(selector => {
    selector.addEventListener("onChange", newQuantity())
  })
  deleteList.forEach(selector => {
    selector.addEventListener("click", deletItem())
  })

}

const newQuantity = () => {

}

const deletItem = () => {

}
// Wait for DOM release
window.addEventListener('load', start())