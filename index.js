//carousel ===============================
let img = [
  "./images/2412GB0033_EG_SL_Levis_DesktopHerotator_1500x400_RTB_AR._CB537014394_.jpg",
  "./images/61g7uQmB4VL._SX3000_.jpg",
  "./images/61h3NfMkDhL._SX3000_.jpg",
  "./images/61g7uQmB4VL._SX3000_.jpg",
];

let currentIndex = 0;
let myCarousel = document.getElementById("myCarousel");

function showImage(index) {
  currentIndex = (index + img.length) % img.length;

  myCarousel.style.backgroundImage = `url('${img[currentIndex]}')`;

  updateDots();
}

function next() {
  showImage(currentIndex + 1);
}

function previous() {
  showImage(currentIndex - 1);
}

setInterval(function () {
  next();
}, 9000);

function createDots() {
  let dotsContainer = document.getElementById("dots-container");
  dotsContainer.innerHTML = "";
  img.forEach((image, index) => {
    let dot = document.createElement("span");
    dot.classList.add("dot");
    dot.setAttribute("onclick", `currentSlide(${index})`);
    dotsContainer.appendChild(dot);
  });
}

function updateDots() {
  let dots = document.getElementsByClassName("dot");
  for (let i = 0; i < dots.length; i++) {
    dots[i].classList.remove("active");
  }
  dots[currentIndex].classList.add("active");
}

function currentSlide(index) {
  showImage(index);
}

createDots();
showImage(0);

///categories =========================================

//get categories and show in list item

function getData() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "https://fakestoreapi.com/products", true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var res = xhr.response;
      var data = JSON.parse(res);

      var categories = data.map((product) => product.category);
      const filterCategories = [...new Set(categories)];

      var div = document.getElementById("category");
      div.innerHTML = "";

      var line = document.createElement("div");
      line.classList.add("line");

      var ul = document.createElement("ul");
      ul.style.paddingLeft = "0px";

      filterCategories.forEach((value) => {
        let li = document.createElement("li");
        li.textContent = value;
        ul.appendChild(li);
      });

      div.appendChild(ul);
      div.appendChild(line);

      // =====================

      var carousel = document.getElementById("carousel");
      carousel.innerHTML = "";

      data.forEach((product) => {
        let card = document.createElement("div");
        card.classList.add("card");

        card.addEventListener("click", function () {
          // الانتقال إلى صفحة المنتج مع إضافة معرف المنتج في الرابط
          window.location.href = `../product/product.html?id=${product.id}`;
        });

        let cardImg = document.createElement("div");
        cardImg.classList.add("card-img");

        let img = document.createElement("img");
        img.src = product.image;
        img.alt = product.title;

        let favorite = document.createElement("span");
        favorite.classList.add("favorite");
        favorite.innerHTML = '<i class="fa-solid fa-heart"></i>';

        let offer = document.createElement("span");
        offer.classList.add("offer");
        offer.innerHTML = "20%";

        let addToCart = document.createElement("button");
        addToCart.classList.add("add-to-card");
        addToCart.textContent = "Add To Cart";

        cardImg.appendChild(favorite);
        cardImg.appendChild(offer);
        cardImg.appendChild(img);
        cardImg.appendChild(addToCart);

        let cardBody = document.createElement("div");
        cardBody.classList.add("card-body");

        let title = document.createElement("p");
        title.classList.add("card-title");
        title.textContent = product.title;

        let priceContainer = document.createElement("div");
        priceContainer.classList.add("card-price");

        let price = document.createElement("p");
        price.classList.add("price");
        price.textContent = `$${product.price.toFixed(2)}`;

        let priceOffer = document.createElement("span");
        priceOffer.classList.add("card-price-offer");
        priceOffer.textContent = `$${(product.price * 1.2).toFixed(2)}`;

        priceContainer.appendChild(price);
        priceContainer.appendChild(priceOffer);

        let rate = document.createElement("div");
        rate.classList.add("rate");

        let fullStars = Math.floor(product.rating.rate);
        let hasHalfStar = product.rating.rate % 1 !== 0;
        let emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        for (let i = 0; i < fullStars; i++) {
          rate.innerHTML += '<i class="fa-solid fa-star"></i>';
        }

        if (hasHalfStar) {
          rate.innerHTML += '<i class="fa-solid fa-star-half-alt"></i>';
        }

        for (let i = 0; i < emptyStars; i++) {
          rate.innerHTML += '<i class="fa-regular fa-star"></i>';
        }

        let numRate = document.createElement("span");
        numRate.classList.add("num-rate");
        numRate.textContent = `(${product.rating.count})`;

        rate.appendChild(numRate);

        cardBody.appendChild(title);
        cardBody.appendChild(priceContainer);
        cardBody.appendChild(rate);

        card.appendChild(cardImg);
        card.appendChild(cardBody);

        carousel.appendChild(card);
      });

      console.log(filterCategories);
    }
  };
  xhr.send();
}

getData();

//today's section ========================================================
let now = new Date();
let startCountDate = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

let countDownDate = new Date(
  startCountDate.getTime() + 1 * 24 * 60 * 60 * 1000
).getTime();

var x = setInterval(function () {
  var now = new Date().getTime();
  var distance = countDownDate - now;

  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById("days").innerHTML =
    "0" + days + `<span class="separator">:</span>`;
  document.getElementById("hours").innerHTML =
    hours + `<span class="separator">:</span>`;
  document.getElementById("minutes").innerHTML =
    minutes + `<span class="separator">:</span>`;
  document.getElementById("seconds").innerHTML = seconds;

  if (distance < 0) {
    clearInterval(x);
    document.getElementById("time-day").innerHTML = "EXPIRED";
  }
}, 1000);

/* ========================================================= */
/* second section today's sales section */
//carousel card for today's sale

const carousel = document.getElementById("carousel");
const prev = document.getElementById("prev");
const nextBtn = document.getElementById("next");
let scrollAmount = 0;
const scrollStep = 270;

nextBtn.addEventListener("click", () => {
  if (scrollAmount < carousel.scrollWidth - carousel.clientWidth) {
    scrollAmount += scrollStep;
    carousel.style.transform = `translateX(-${scrollAmount}px)`;
  }
});

prev.addEventListener("click", () => {
  if (scrollAmount > 0) {
    scrollAmount -= scrollStep;
    carousel.style.transform = `translateX(-${scrollAmount}px)`;
  }
});
