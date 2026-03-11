let preguntas = []
let test = []

let actual = 0
let aciertos = 0

async function cargar() {

    const respuesta = await fetch("preguntas.json")
    preguntas = await respuesta.json()

    generarTest()

    mostrar()

}

function generarTest() {

    // copiamos el array
    test = [...preguntas]

    // mezclamos preguntas
    test.sort(() => Math.random() - 0.5)

    // elegimos 20 preguntas
    test = test.slice(0, 20)

}

function mostrar() {

    const p = test[actual]

    document.getElementById("pregunta").innerText =
        "Pregunta " + (actual + 1) + ":\n\n" + p.pregunta

    const contenedor = document.getElementById("opciones")
    contenedor.innerHTML = ""

    for (let i = 0; i < p.opciones.length; i++) {

        const boton = document.createElement("button")

        boton.innerText = p.opciones[i]

        boton.onclick = function() {

            if (i === p.correcta) {

                aciertos++

                alert("Correcta")

            } else {

                alert("Incorrecta")

            }

            siguiente()

        }

        contenedor.appendChild(boton)

    }

}

function siguiente() {

    actual++

    if (actual >= test.length) {

        alert("Test terminado. Aciertos: " + aciertos + " de " + test.length)

        actual = 0
        aciertos = 0

        generarTest()

    }

    mostrar()

}

cargar()
