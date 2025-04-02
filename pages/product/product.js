let quantity = document.getElementById('quantity') // quantity input

function increase() { // increase quantity button
    currentQuantity = Number(quantity.value);
    quantity.value = currentQuantity + 1;

}

function decrease() { // decrease quantity button
    if (quantity.value >= 1) {
        currentQuantity = Number(quantity.value);
        quantity.value = currentQuantity - 1;
    }

}


function fillRating(rating) { // stars filling
    const maxWidth = 120;
    const fillWidth = (rating / 5) * maxWidth;
    document.querySelector("#clip rect").setAttribute("width", fillWidth);
    document.getElementById('rating').innerText = rating;
}

fillRating(3.6);