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
let carrito =[];

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

    const botonesAgregar = document.querySelectorAll(".add-to-cart");

    botonesAgregar.forEach(btn => {
        btn.addEventListener("click", (e) => {
            const idProducto = parseInt(e.target.dataset.id);
            agregarAlCarrito(idProducto);
        });
    });

}

renderProducts(productos);

// filtro

const buscador = document.getElementById("search-input");
const categoriaSeleccionada = document.getElementById("categoria-select");
const btnLimpiar = document.getElementById("clear-filtro");

function filtrarProductos() {
    const buscarTexto = buscador.value.toLowerCase();
    const categoria = categoriaSeleccionada.value

    const filtered = productos.filter(producto => {
        const matchCategory = categoria === "all" || producto.categoria === categoria;
        const matchSearch = producto.titulo.toLowerCase().includes(buscarTexto);
        return matchCategory && matchSearch;
    });

    renderProducts(filtered);

}


buscador.addEventListener("input", filtrarProductos);
categoriaSeleccionada.addEventListener("change", filtrarProductos);
btnLimpiar.addEventListener("click", () => {
    buscador.value = "";
    categoriaSeleccionada.value = "all";
    renderProducts(productos);
});

