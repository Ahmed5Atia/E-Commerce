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

      console.log(filterCategories);
    }
  };
  xhr.send();
}
getData();
