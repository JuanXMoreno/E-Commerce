let productos = [];
let carrito =[];

fetch("productos.json")
    .then(response => response.json())
    .then(data => {
        productos = data;
        renderProducts(productos);
    })
    .catch(error => {
        console.error("Error cargando productos:", error);
    });


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

// Agregar al carrito

function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);
    const itemCarrito = carrito.find(p => p.id === id);

    if (itemCarrito) {
        itemCarrito.cantidad++;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }

    guardarCarrito()
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

function cargarCarrito() {
    const carritoGuardado = localStorage.getItem("carrito");

    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);

        guardarCarrito()
        renderCarrito();
    }
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

document.getElementById("vaciar-carrito").addEventListener("click", vaciarCarrito);

function actualizarTotal() {
    const total = carrito.reduce((acc, el) => acc + el.precio * el.cantidad, 0);
    document.getElementById("carrito-total").textContent = "Total: $" + total.toFixed(2);
}

function eliminarDelCarrito(id) {
    carrito = carrito.filter(item => item.id !== id);

    guardarCarrito()
    renderCarrito();
}

function restarCantidad(id) {
    const item = carrito.find(p => p.id === id);

    if (!item) return;

    if (item.cantidad > 1) {
        item.cantidad--;
    }

    guardarCarrito()
    renderCarrito();
}

function sumarCantidad(id) {
    const item = carrito.find(p => p.id === id);
    if (item) {
        item.cantidad++;

        guardarCarrito()
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

function vaciarCarrito() {
    carrito = [];

    guardarCarrito()
    renderCarrito();
}

cargarCarrito();

// checkout final

const btnCheckout = document.getElementById("btn-checkout");
const checkoutSection = document.getElementById("checkout");

btnCheckout.addEventListener("click", () => {
    renderCheckout();
    checkoutSection.style.display = "block";
});

function renderCheckout() {
    const resumen = document.getElementById("checkout-resumen");
    const totalEl = document.getElementById("checkout-total");

    resumen.innerHTML = "";

    carrito.forEach(item => {
        const p = document.createElement("p");
        p.textContent = `${item.titulo} x${item.cantidad}`;
        resumen.appendChild(p);
    });

    const total = carrito.reduce(
        (acc, item) => acc + item.precio * item.cantidad,
        0
    );

    totalEl.textContent = "Total: $" + total.toFixed(2);
}

document.getElementById("btn-confirmar").addEventListener("click", () => {
    if (carrito.length === 0) {
        alert("El carrito está vacío");
        return;
    }

    alert("Compra realizada con éxito 🎉");

    carrito = [];
    localStorage.removeItem("carrito");

    renderCarrito();
    renderCheckout();
});

document.getElementById("btn-vaciar").addEventListener("click", () => {
    carrito = [];
    localStorage.removeItem("carrito");

    renderCarrito();
    renderCheckout();
});


