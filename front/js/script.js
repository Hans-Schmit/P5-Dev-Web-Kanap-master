const productsBrowse = (products) => {
    let htmlContent = "";
    //browse each product in the array and add the html code with correct product infos in a variable htmlContent
    for (let product of products) {
        htmlContent += `<a href="./product.html?id=${product._id}">
                <article>
                    <img src="${product.imageUrl}" alt="${product.altTxt}">
                    <h3 class="productName">${product.name}</h3>
                    <p class="productDescription">${product.description}</p>
                </article>
            </a>`;
    }
    //add the code for all products in the DOM
    document.getElementById("items").innerHTML = htmlContent;
}


fetch("http://localhost:3000/api/products/") // getting all products from api
    .then(function (res) {
        if (res.ok) {
            return res.json();
        }
    })
    .then(function (value) {
        productsBrowse(value);
    })
    .catch(function (err) {
        document.getElementById("items").innerText = `An error has occured : ${err}`;
    });