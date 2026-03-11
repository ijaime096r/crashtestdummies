let preguntas = []
let actual = 0

async function cargar() {

    const respuesta = await fetch("preguntas.json")
    preguntas = await respuesta.json()

    mostrar()

}

function mostrar() {

    const p = preguntas[actual]

    document.getElementById("pregunta").innerText = p.pregunta

    const contenedor = document.getElementById("opciones")
    contenedor.innerHTML = ""

    for (let i = 0; i < p.opciones.length; i++) {

        const boton = document.createElement("button")
        boton.innerText = p.opciones[i]

        boton.onclick = function() {

            if (i === p.correcta) {

                alert("Correcta")

            } else {

                alert("Incorrecta")

            }

        }

        contenedor.appendChild(boton)

    }

}

function siguiente() {

    actual++

    if (actual >= preguntas.length) {

        actual = 0

    }

    mostrar()

}

cargar()
