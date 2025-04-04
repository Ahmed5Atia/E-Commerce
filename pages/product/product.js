const paramsString = window.location.search;
const searchParams = new URLSearchParams(paramsString);
let id = searchParams.get("id");
let product;
let quantity = document.getElementById('quantity') // quantity input
let addToCart = document.querySelector('.add-to-cart')
let sideImages = document.querySelector('.side-images')


quantity.onchange = function () {
    price.innerText = `$${product.price * quantity.value}`;

}

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

function getProductData() {
    let xhr = new XMLHttpRequest(); // getting product data from API
    xhr.open("GET", `https://dummyjson.com/products/${id}`, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            let res = xhr.response;
            // getting the product and turning it into a normal object
            product = JSON.parse(res);
            // filling the stars with product rating
            fillRating(product.rating);
            let title = document.getElementById('title');
            title.innerText = product.title;
            let pageTitle = document.getElementById('page-title');
            pageTitle.innerText = product.title;
            let description = document.getElementById('description');
            description.innerText = product.description;
            let price = document.getElementById('price');
            price.innerText = `$${product.price * quantity.value}`;
            let mainImage = document.getElementById('main-image');
            mainImage.src = product.images[0];
            let isFirstImage = true;
            for (let img of product.images) {
                let image = document.createElement('img')
                image.src = img;
                image.height = 100
                // Add 'active' class to the first image thumbnail
                if (isFirstImage){
                    image.setAttribute('class', 'side-images-image active');
                    isFirstImage = false;
                }
                else{
                    image.setAttribute('class', 'side-images-image');
                }
                sideImages.appendChild(image);
                image.addEventListener('click', function () {
                    mainImage.src = image.src
                    document.querySelectorAll(".side-images-image").forEach(img => img.classList.remove("active"));

                    // Add 'active' class to the clicked thumbnail
                    image.classList.add("active");
                }
                )
            // console.log(image);
        }


    }
}
xhr.send();
}
getProductData()


addToCart.onclick = function () {

    console.log('hello');
    // functionality for the add to cart button
}