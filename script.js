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

let carrito = [];

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

    activarBotonesAgregar();
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

// Agregar al carrito

function activarBotonesAgregar() {
    const botones = document.querySelectorAll(".add-to-cart");

    botones.forEach(boton => {
        boton.addEventListener("click", e => {
            const id = parseInt(e.target.dataset.id);
            agregarAlCarrito(id);
        });
    });
}

function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);
    const itemCarrito = carrito.find(p => p.id === id);

    if (itemCarrito) {
        itemCarrito.cantidad++;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }

    renderCarrito();
}

function renderCarrito() {
    const contenido = document.getElementById("carrito-items");
    contenido.innerHTML = "";

    carrito.forEach(item => {
        const carritoItem = document.createElement("div");
        carritoItem.classList.add("carrito-item");

        carritoItem.innerHTML = `
            <p class="carrito-titulo">${item.titulo}</p>

            <p class="carrito-precio">$${(item.precio * item.cantidad).toFixed(2)}</p>

                <div class="carrito-controles">
                    <button class="btn-restar" data-id="${item.id}">➖</button>
                    <span>x${item.cantidad}</span>
                    <button class="btn-sumar" data-id="${item.id}">➕</button>
                </div>


            <button class="btn-eliminar" data-id="${item.id}">❌</button>`
            ;

        const btnRestar = carritoItem.querySelector(".btn-restar");
        ocultarRestar(btnRestar, item.cantidad);

        contenido.appendChild(carritoItem);
    });

    actualizarTotal();
}

const carritoItems = document.getElementById("carrito-items");

carritoItems.addEventListener("click", (e) => {
    const id = Number(e.target.dataset.id);
    if (!id) return;

    switch (true) {
        case e.target.classList.contains("btn-eliminar"):
            eliminarDelCarrito(id);
            break;
        case e.target.classList.contains("btn-restar"):
            restarCantidad(id);
            break;
        case e.target.classList.contains("btn-sumar"):
            sumarCantidad(id);
            break;
    }
});



function actualizarTotal() {
    const total = carrito.reduce((acc, el) => acc + el.precio * el.cantidad, 0);
    document.getElementById("carrito-total").textContent = "Total: $" + total.toFixed(2);
}

function eliminarDelCarrito(id) {
    carrito = carrito.filter(item => item.id !== id);
    renderCarrito();
}

function restarCantidad(id) {
    const item = carrito.find(p => p.id === id);

    if (!item) return;

    if (item.cantidad > 1) {
        item.cantidad--;
    } else {
        eliminarDelCarrito(id);
    }

    renderCarrito();
}

function sumarCantidad(id) {
    const item = carrito.find(p => p.id === id);
    if (item) {
        item.cantidad++;
        renderCarrito();
    }
}

function ocultarRestar(boton, cantidad) {
    if (cantidad <= 1) {
        boton.style.visibility = "hidden";
    } else {
        boton.style.visibility = "visible";
    }
}

function agregarEventosEliminar() {
    const botonesEliminar = document.querySelectorAll(".btn-eliminar");

    botonesEliminar.forEach(btn => {
        btn.addEventListener("click", () => {
            const id = parseInt(btn.dataset.id);
            eliminarDelCarrito(id);
        });
    });
}







