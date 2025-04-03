const paramsString = window.location.search;
const searchParams = new URLSearchParams(paramsString);
let id = searchParams.get("id");
let product;
let quantity = document.getElementById('quantity') // quantity input
let addToCart = document.querySelector('.add-to-cart')




function increase() { // increase quantity button
    let currentQuantity = Number(quantity.value);
    quantity.value = currentQuantity + 1;
    price.innerText = `$${product.price * quantity.value}`;

}

function decrease() { // decrease quantity button
    if (quantity.value >= 1) {
        let currentQuantity = Number(quantity.value);
        quantity.value = currentQuantity - 1;
        price.innerText = `$${product.price * quantity.value}`;

    }

}


function fillRating(rating) { // stars filling
    const maxWidth = 120;
    const fillWidth = (rating / 5) * maxWidth;
    document.querySelector("#clip rect").setAttribute("width", fillWidth);
    document.getElementById('rating').innerText = rating;
}


let xhr = new XMLHttpRequest(); // getting product data from API
xhr.open("GET", "https://fakestoreapi.com/products", true);
xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
        let res = xhr.response;
        let data = JSON.parse(res);
        function getProduct() { // function to get the product object for the wanted id
            const product = data.find((product) => product.id == id);
            return product;
        }
        product = getProduct()
        fillRating(product.rating.rate);
        let title = document.getElementById('title');
        let pageTitle = document.getElementById('page-title');
        pageTitle.innerText = product.title;
        title.innerText = product.title;
        let description = document.getElementById('description');
        description.innerText = product.description;
        let price = document.getElementById('price');
        price.innerText = `$${product.price * quantity.value}`;
        let mainImage = document.getElementById('main-image');
        mainImage.src = product.image;


    }
}
xhr.send();


addToCart.onclick = function () {
    console.log('hello');
    // functionality for the add to cart button
}