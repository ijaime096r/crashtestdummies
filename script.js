const PASSWORD = "canarias"

let preguntas = []
let test = []
let falladas = []

let actual = 0
let aciertos = 0

let respondida = false
let modo = "entrenamiento"


function login() {

    const clave = document.getElementById("clave").value

    if (clave === PASSWORD) {

        localStorage.setItem("acceso", "ok")

        iniciarApp()

    } else {

        alert("Contraseña incorrecta")

    }

}


function iniciarApp() {

    document.getElementById("login").style.display = "none"

    document.getElementById("app").style.display = "block"

    cargar()

}


async function cargar() {

    const respuesta = await fetch("preguntas.json")

    preguntas = await respuesta.json()

}


function modoEntrenamiento() {

    modo = "entrenamiento"

    iniciarTest(20)

}


function modoExamen() {

    modo = "examen"

    iniciarTest(50)

}


function modoFalladas() {

    modo = "falladas"

    if (falladas.length === 0) {

        alert("No hay preguntas falladas todavía")

        return

    }

    test = [...falladas]

    actual = 0
    aciertos = 0

    mostrar()

}


function iniciarTest(numero) {

    actual = 0
    aciertos = 0

    test = [...preguntas]

    test.sort(() => Math.random() - 0.5)

    test = test.slice(0, numero)

    mostrar()

}


function mostrar() {

    respondida = false

    const p = test[actual]

    document.getElementById("info").innerText =
        "Pregunta " + (actual + 1) + " / " + test.length

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

            if (modo === "entrenamiento" || modo === "falladas") {

                const botones = contenedor.children

                for (let j = 0; j < botones.length; j++) {

                    if (j === p.correcta) {

                        botones[j].classList.add("correcta")

                    }

                }

                if (i !== p.correcta) {

                    botones[i].classList.add("incorrecta")

                }

            }

            if (i === p.correcta) {

                aciertos++

            } else {

                falladas.push(p)

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
            "Resultado\n\nAciertos: " +
            aciertos +
            " de " +
            test.length
        )

        return

    }

    mostrar()

}


document.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {

        siguiente()

    }

})


window.addEventListener("DOMContentLoaded", function() {

    if (localStorage.getItem("acceso") === "ok") {

        iniciarApp()

    }

})
