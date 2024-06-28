document.addEventListener('DOMContentLoaded', function() {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    let total = parseInt(localStorage.getItem('total')) || 0;

    function agregarAlCarrito(productoNombre) {
        const productos = [
            { nombre: "Peppa", precio: 3500 },
            { nombre: "Sirenita", precio: 5000 },
            { nombre: "Stitch", precio: 6000 },
            { nombre: "Bob esponja", precio: 8000 },
            { nombre: "Chavo", precio: 5000 },
            { nombre: "Leon", precio: 4000 }
        ];

        const productoEncontrado = productos.find(producto => producto.nombre.toLowerCase() === productoNombre.toLowerCase());

        if (productoEncontrado) {
            carrito.push(productoEncontrado);
            total += productoEncontrado.precio;
            localStorage.setItem('carrito', JSON.stringify(carrito));
            localStorage.setItem('total', total);

            mostrarTotal();
            if (window.location.pathname.includes('compras.html')) {
                mostrarCarrito();
            }
        } else {
            console.error(`El producto "${productoNombre}" no se encontró en la lista.`);
        }
    }

    function mostrarTotal() {
        document.getElementById('total').textContent = `TOTAL: $${total}`;
    }

    function mostrarCarrito() {
        const conteoProductos = {};
        carrito.forEach(producto => {
            if (conteoProductos[producto.nombre]) {
                conteoProductos[producto.nombre]++;
            } else {
                conteoProductos[producto.nombre] = 1;
            }
        });

        let productosHTML = '';
        for (const [nombre, cantidad] of Object.entries(conteoProductos)) {
            productosHTML += `
                <div class="producto-item">
                    <h3 class="producto-nombre">${nombre} <span class="producto-cantidad">(x${cantidad})</span></h3>
                </div>
            `;
        }

        const productosContainer = document.querySelector('.productos');
        productosContainer.innerHTML = `<div class="items">${productosHTML}</div>`;

        mostrarTotal();
    }

    function mostrarMensajeTarjeta() {
        Swal.fire({
            title: 'Elegí una tarjeta',
            html: `
                <p class="tarjetas">La tarjeta Naranja cuenta con hasta 6 cuotas sin intereses.
            <br>
            A partir de 9 cuotas se le agrega un interes del 2% 
            </p>
            <p class="tarjetas">La tarjeta Visa cuenta con hasta 3 cuotas sin intereses.
            <br>
            A partir de 6 cuotas se le agrega un interes del 1% 
            </p>
            `,
            input: 'text',
            inputPlaceholder: 'Naranja o Visa',
            confirmButtonText: 'Elegir',
            showCancelButton: true,
            allowOutsideClick: false,
            inputValidator: (value) => {
                if (!value.trim().toLowerCase() || (value.trim().toLowerCase() !== 'naranja' && value.trim().toLowerCase() !== 'visa')) {
                    return 'Debes elegir una tarjeta válida';
                }
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const elegirTarjeta = result.value.toLowerCase();
                elegirCuotas(elegirTarjeta);
            }
        });
    }
    
    function elegirCuotas(tarjetaElegida) {
        Swal.fire({
            title: 'Elegí la cantidad de cuotas',
            input: 'select',
            inputOptions: {
                '1': '1 cuota',
                '3': '3 cuotas',
                '6': '6 cuotas',
                '9': '9 cuotas',
                '12': '12 cuotas'
            },
            inputPlaceholder: 'Selecciona',
            confirmButtonText: 'Elegir',
            showCancelButton: false,
            allowOutsideClick: false,
            inputValidator: (value) => {
                return new Promise((alerta) => {
                    if (value !== '') {
                        alerta();
                    } else {
                        alerta('Debes elegir una cantidad de cuotas para continuar.');
                    }
                });
            }
        }).then((resultado) => {
            if (resultado.isConfirmed) {
                const cuotas = parseInt(resultado.value);
                if (!isNaN(cuotas)) { // Verificar si cuotas es un número válido
                    tarjetaCuotas(tarjetaElegida, cuotas);
                }
            }
        });
    }

    
    function tarjetaCuotas(tarjeta, cuotas) {
        let interesCalculado = 0;
        let tarjetaSeleccionada;
    
        if (tarjeta === "naranja") {
            tarjetaSeleccionada = { nombre: 'Naranja', cuotasSinInteres: 6, interes: 0.02 };
        } else if (tarjeta === "visa") {
            tarjetaSeleccionada = { nombre: 'Visa', cuotasSinInteres: 3, interes: 0.01 };
        }
    
        if (tarjetaSeleccionada) {
            interesCalculado = calcularInteres(total, cuotas, tarjetaSeleccionada);
            const totalConInteres = total + interesCalculado;
    
            const mensaje = `
                <div class="alert alert-success">
                    El MONTO TOTAL A PAGAR ES $${totalConInteres} PESOS EN ${cuotas} CUOTA/S
                </div>
            `;
    
            Swal.fire({
                title: 'Resumen de la compra',
                html: mensaje,
                confirmButtonText: 'Aceptar',
                allowOutsideClick: false
            }).then(() => {
                reiniciarCarrito();
            });
        }
    }
    
    function calcularInteres(total, cuotas, tarjeta) {
        let interes = 0;
        if (cuotas <= tarjeta.cuotasSinInteres) {
            interes = 0;
        } else {
            interes = total * tarjeta.interes;
        }
        return interes;
    }

    function reiniciarCarrito() {
        localStorage.removeItem('carrito');
        localStorage.removeItem('total');

        carrito = [];
        total = 0;

        mostrarTotal();
        mostrarCarrito();
    }
    
    const finalizarCompraBtn = document.getElementById('finalizar-compra');
    if (finalizarCompraBtn) {
        finalizarCompraBtn.addEventListener('click', function() {
            mostrarMensajeTarjeta();
        });
    }

    if (window.location.pathname.includes('compras.html')) {
        mostrarCarrito();
    }

    document.querySelectorAll('.agregar').forEach(function(boton) {
        boton.addEventListener('click', function() {
            const productoNombre = this.getAttribute('data-producto');
            agregarAlCarrito(productoNombre);
        });
    });
});


document.addEventListener('DOMContentLoaded', function() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const logoPao = document.querySelector('.logopao');
    const navbarContent = document.querySelector('.navbar-collapse'); 
  
    navbarToggler.addEventListener('click', function() {
      if (navbarContent.classList.contains('ver')) {
        logoPao.style.visibility = 'visible'; 
      } else {
        logoPao.style.visibility = 'hidden'; // Ocultar el logo cuando se abre el navbar
      }
    });
  
    // Evento para mostrar el logo cuando se oculta el navbar
    navbarContent.addEventListener('hidden.bs.collapse', function() {
      logoPao.style.visibility = 'visible';
    });
  });