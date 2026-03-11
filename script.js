const PASSWORD = "tren2026"

let preguntas = []
let test = []
let falladas = []

let actual = 0
let aciertos = 0

let respondida = false
let modo = "entrenamiento"

let tiempoRestante = 0
let temporizador = null


function login() {

    const clave = document.getElementById("clave").value

    if (clave === PASSWORD) {

        localStorage.setItem("acceso","ok")

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

    document.getElementById("configExamen").style.display = "none"

    iniciarTest(20)

}


function mostrarConfigExamen() {

    document.getElementById("configExamen").style.display = "block"

}


function iniciarExamen() {

    const minutos = parseInt(document.getElementById("tiempoExamen").value)

    if (!minutos || minutos <= 0) {

        alert("Tiempo no válido")

        return

    }

    modo = "examen"

    tiempoRestante = minutos * 60

    iniciarTest(50)

    iniciarTemporizador()

}


function modoFalladas() {

    modo = "falladas"

    document.getElementById("configExamen").style.display = "none"

    if (falladas.length === 0) {

        alert("No hay preguntas falladas")

        return

    }

    test = [...falladas]

    actual = 0
    aciertos = 0

    mostrar()

}


function iniciarTest(numero) {

    if (preguntas.length === 0) {

        alert("Las preguntas todavía no se han cargado")

        return

    }

    actual = 0
    aciertos = 0

    test = [...preguntas]

    test.sort(() => Math.random() - 0.5)

    test = test.slice(0, numero)

    mostrar()

}


function iniciarTemporizador() {

    clearInterval(temporizador)

    temporizador = setInterval(function(){

        tiempoRestante--

        const m = Math.floor(tiempoRestante/60)
        const s = tiempoRestante%60

        document.getElementById("timer").innerText =
            "Tiempo: " + m + ":" + s.toString().padStart(2,"0")

        if (tiempoRestante <= 0) {

            clearInterval(temporizador)

            terminarExamen()

        }

    },1000)

}


function terminarExamen() {

    clearInterval(temporizador)

    alert(
        "Resultado\n\nAciertos: " +
        aciertos +
        " de " +
        test.length
    )

}


function mostrar() {

    respondida = false

    const p = test[actual]

    document.getElementById("info").innerText =
        "Pregunta " + (actual+1) + " / " + test.length

    document.getElementById("pregunta").innerText = p.pregunta

    const contenedor = document.getElementById("opciones")

    contenedor.innerHTML = ""

    for (let i=0;i<p.opciones.length;i++) {

        const boton = document.createElement("button")

        boton.className = "opcion"

        boton.innerText = p.opciones[i]

        boton.onclick = function(){

            if (respondida) return

            respondida = true

            const botones = contenedor.children

            if (modo !== "examen") {

                for (let j=0;j<botones.length;j++) {

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

        alert("Primero debes responder")

        return

    }

    actual++

    if (actual >= test.length) {

        terminarExamen()

        return

    }

    mostrar()

}


document.addEventListener("keydown", function(e){

    if (e.key === "Enter") {

        siguiente()

    }

})


window.addEventListener("DOMContentLoaded", function(){

    if (localStorage.getItem("acceso") === "ok") {

        iniciarApp()

    }

})
