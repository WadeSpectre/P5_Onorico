/*       
========>|==================================|<========
========>|---FONCTIONS DE LA PAGE PRODUIT---|<========
========>|==================================|<========
*/

//========> Compte des articles dans le panier sur le header
const cartCount = document.getElementById("cart-count");
const cartCountMin = document.getElementById("cart-count-min");

function saveCount() {
  localStorage.setItem("count", cartCount.textContent);
}
function checkCartCount() {
  if (localStorage.getItem("count")) {
    cartCount.textContent = localStorage.getItem("count");
    cartCountMin.textContent = localStorage.getItem("count");
  }
}
checkCartCount();

//========> Fetch l'article dans l'api
const item = localStorage.getItem("id");

async function askCamItem() {
  const promise = await fetch(
    "http://localhost:3000/api/cameras/" + JSON.parse(item)
  );
  const response = await promise.json();
  console.log(response);
  return response;
}
function convertCentSimple(num) {
  let result = num / 100;
  return result;
}

//========> Sauvegarde le panier dans localStorage
function saveCart() {
  localStorage.setItem("cartContent", JSON.stringify(cart));
}

//========> Récup le panier dans localStorage
function loadCart() {
  cart = JSON.parse(localStorage.getItem("cartContent"));
}

//========> Renvoi l'option choisie du select
function lensChoose(elt) {
  let result = elt.options[elt.selectedIndex].value;
  return result;
}

//========> Crée les élements html du produit
const createHtmlForItem = (product) => {
  let container = document.createElement("div");
  container.classList.add("col");

  let card = document.createElement("div");
  card.classList.add("card", "shadow");

  let cardBody = document.createElement("div");
  cardBody.classList.add("card-body");

  let title = document.createElement("h2");
  title.classList.add("h1");
  title.textContent = product.name;
  localStorage.setItem("name", product.name);
  cardBody.appendChild(title);

  let des = document.createElement("p");
  des.classList.add("card-text");
  des.textContent = product.description;
  cardBody.appendChild(des);

  let lensesText = document.createElement("h3");
  lensesText.classList.add("card-text", "h6");
  lensesText.textContent = "Choisissez votre lentille : ";
  cardBody.appendChild(lensesText);

  let selector = document.createElement("select");
  selector.id = "choices";
  selector.classList.add("selectpicker");
  cardBody.appendChild(selector);

  //========> boucle pour lentilles
  product.lenses.forEach((elt, i) => {
    let lenseChoice = document.createElement("option");
    (lenseChoice.textContent = elt), i;
    selector.appendChild(lenseChoice);
  });

  //========> Récup la lentille selectionnée dans localStorage
  localStorage.setItem("lens", lensChoose(selector));
  selector.addEventListener("change", function () {
    localStorage.setItem("lens", lensChoose(selector));
  });

  let euroPrice = document.createElement("button");
  euroPrice.classList.add(
    "btn",
    "btn-primary",
    "m-1",
    "float-right",
    "col-6",
    "col-lg-3"
  );
  euroPrice.textContent = convertCentSimple(product.price) + " €";
  localStorage.setItem("price", convertCentSimple(product.price));
  euroPrice.disabled = true;
  cardBody.appendChild(euroPrice);

  let addToCart = document.createElement("button");
  addToCart.classList.add(
    "btn",
    "btn-success",
    "m-1",
    "float-right",
    "col-6",
    "col-lg-3"
  );
  addToCart.role = "button";
  addToCart.textContent = "Ajouter au panier";
  cardBody.appendChild(addToCart);

  let img = document.createElement("img");
  img.classList.add("card-img-top");
  img.alt = product.name;
  img.src = product.imageUrl;
  localStorage.setItem("img", product.imageUrl);
  cardBody.appendChild(img);
  //========> Click Listener pour le bouton d'ajout au panier
  addToCart.addEventListener("click", function () {
    cart = [];
    let obj = {};
    obj.id = JSON.parse(item);
    obj.name = localStorage.getItem("name");
    obj.lens = localStorage.getItem("lens");
    obj.price = localStorage.getItem("price");
    obj.quantity = 1;
    cartCount.textContent++;
    cartCountMin.textContent++;
    saveCount();
    if (localStorage.getItem("cartContent") != null) {
      loadCart();
      let found = false;
      for (elt of cart) {
        if (elt.id === obj.id && elt.lens === obj.lens) {
          elt.quantity++;
          found = true;
          break;
        }
      }
      if (!found) {
        cart.push(obj);
      }
      saveCart();
    } else {
      cart.push(obj);
      saveCart();
    }
  });
  card.appendChild(cardBody);
  container.appendChild(card);
  document.getElementById("prod").appendChild(container);
};

//========> fetch l'article dans l'api
function askAndCreateItem() {
  askCamItem().then(function (response) {
    createHtmlForItem(response);
  });
}
askAndCreateItem();
