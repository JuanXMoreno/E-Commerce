const productos = [
    {
        id: 1,
        titulo: "Remera Hombre",
        precio: 22.99,
        img: "assets/remera.jpg",
        categoria: "ropa"
    },
    {
        id: 2,
        titulo: "Zapatillas Deportivas",
        precio: 49.99,
        img: "assets/zapatillas.jpg",
        categoria: "calzado"
    },
    {
        id: 3,
        titulo: "Mochila Escolar",
        precio: 35.99,
        img: "assets/mochila.jpg",
        categoria: "accesorio"
    },
    {
        id: 4,
        titulo: "Gorra Unisex",
        precio: 15.99,
        img: "assets/gorra.jpg",
        categoria: "accesorio"
    }
]


const container = document.getElementById("productos-container");

function renderProducts(prodArray) {
    
    container.innerHTML = "";
    prodArray.forEach(producto => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
      <img src="${producto.img}" alt="${producto.titulo}" loading="lazy">
      <h3>${producto.titulo}</h3>
      <p>Precio: $${producto.precio}</p>
      <button class="add-to-cart" data-id="${producto.id}">Agregar al carrito</button>
    `;

    container.appendChild(card);

    });
}

renderProducts(productos);

