let preguntas = []
let test = []

let actual = 0
let aciertos = 0

let respondida = false

async function cargar() {

    const respuesta = await fetch("preguntas.json")

    preguntas = await respuesta.json()

    generarTest()

    mostrar()

}

function generarTest() {

    test = [...preguntas]

    test.sort(() => Math.random() - 0.5)

    test = test.slice(0, 20)

}

function mostrar() {

    respondida = false

    const p = test[actual]

    document.getElementById("info").innerText =
        "Pregunta " + (actual + 1) + " / " + test.length +
        " | Aciertos: " + aciertos

    document.getElementById("pregunta").innerText =
        p.pregunta

    const contenedor = document.getElementById("opciones")

    contenedor.innerHTML = ""

    for (let i = 0; i < p.opciones.length; i++) {

        const boton = document.createElement("button")

        boton.innerText = p.opciones[i]

        boton.onclick = function() {

            if (respondida) return

            respondida = true

            const botones = contenedor.children

            for (let j = 0; j < botones.length; j++) {

                if (j === p.correcta) {

                    botones[j].classList.add("correcta")

                }

            }

            if (i !== p.correcta) {

                botones[i].classList.add("incorrecta")

            } else {

                aciertos++

            }

        }

        contenedor.appendChild(boton)

    }

}

function siguiente() {

    if (!respondida) {

        alert("Primero debes responder la pregunta")

        return

    }

    actual++

    if (actual >= test.length) {

        alert(
            "Test terminado\n\nAciertos: " +
            aciertos +
            " de " +
            test.length
        )

        actual = 0
        aciertos = 0

        generarTest()

    }

    mostrar()

}

cargar()
