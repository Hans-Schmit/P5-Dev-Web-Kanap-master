/**
 * Start - Function to get all product from API
 */
const start = () => {
    fetch("http://localhost:3000/api/products/")
        .then(res => res.json())
        .then(data => {
            productsBrowse(data)
        })
        .catch(err => {
            document.querySelector("#items").innerText = `Une erreur est survenue : ${err}`
        })
}

/**
 * productsBrowse - browse each product in the array and add the html code with correct product infos in a variable htmlContent
 * 
 * @param {Array} - Api response (Array of object)
 */
const productsBrowse = (products) => {

    document.querySelector("#items").insertAdjacentHTML("afterbegin", products.map(product => {
        return `<a href="./product.html?id=${product._id}">
            <article>
                <img src="${product.imageUrl}" alt="${product.altTxt}">
                <h3 class="productName">${product.name}</h3>
                <p class="productDescription">${product.description}</p>
            </article>
        </a>`
    }).join(""))
}


// Wait for DOM release
window.addEventListener('load', start())