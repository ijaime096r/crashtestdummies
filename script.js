const PASSWORD = "canarias"

let preguntas = []
let test = []
let falladas = []

let actual = 0
let aciertos = 0

let respondida = false
let modo = "entrenamiento"

let tiempoRestante = 0
let temporizador = null

let respuestasUsuario = []

let estadisticas = {
    respondidas: 0,
    aciertos: 0,
    fallos: 0
}


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

    clearInterval(temporizador)

    document.getElementById("login").style.display = "none"
    document.getElementById("app").style.display = "block"

    cargarEstadisticas()
    mostrarEstadisticas()
    cargar()

}

function cargarEstadisticas() {

    const datos = localStorage.getItem("estadisticas")

    if (datos) {

        estadisticas = JSON.parse(datos)

    }

}


function guardarEstadisticas() {

    localStorage.setItem(
        "estadisticas",
        JSON.stringify(estadisticas)
    )

}

function mostrarEstadisticas() {

    const porcentaje = estadisticas.respondidas > 0
        ? Math.round(
            estadisticas.aciertos /
            estadisticas.respondidas *
            100
        )
        : 0

    document.getElementById("estadisticas").innerText =
        "Respondidas: " + estadisticas.respondidas +
        " | Aciertos: " + estadisticas.aciertos +
        " | Fallos: " + estadisticas.fallos +
        " | % acierto: " + porcentaje + "%"
}

async function cargar() {

    const respuesta = await fetch("preguntas.json")

    preguntas = await respuesta.json()

}


function mezclarArray(array) {

    for (let i = array.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1))

        const temp = array[i]

        array[i] = array[j]

        array[j] = temp

    }

}


function mezclarRespuestas(pregunta) {

    const correcta = pregunta.correcta

    const opciones = pregunta.opciones.map((texto, index) => {

        return {
            texto: texto,
            correcta: index === correcta
        }

    })

    mezclarArray(opciones)

    pregunta.opciones = opciones.map(o => o.texto)

    pregunta.correcta = opciones.findIndex(o => o.correcta)

}


function iniciarTest(numero) {

    actual = 0
    aciertos = 0
    respuestasUsuario = []

    test = JSON.parse(JSON.stringify(preguntas))

    mezclarArray(test)

    test = test.slice(0, numero)

    for (let p of test) {

        mezclarRespuestas(p)

    }

    crearNavegacion()

    mostrar()

}


function modoEntrenamiento() {

    modo = "entrenamiento"

    iniciarTest(20)

}


function mostrarConfigExamen() {

    document.getElementById("configExamen").style.display = "block"

}


function iniciarExamen() {

    const minutos = parseInt(
        document.getElementById("tiempoExamen").value
    )

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

    if (falladas.length === 0) {

        alert("No hay preguntas falladas")

        return

    }

    test = JSON.parse(JSON.stringify(falladas))

    for (let p of test) {

        mezclarRespuestas(p)

    }

    actual = 0
    aciertos = 0
    respuestasUsuario = []

    crearNavegacion()

    mostrar()

}


function crearNavegacion() {

    const nav = document.getElementById("navegacion")

    nav.innerHTML = ""

    for (let i=0;i<test.length;i++) {

        const b = document.createElement("button")

        b.className = "botonPregunta"

        b.innerText = i+1

        b.onclick = function(){

            actual = i

            mostrar()

        }

        nav.appendChild(b)

    }

}


function actualizarNavegacion() {

    const botones = document
        .getElementById("navegacion")
        .children

    for (let i=0;i<botones.length;i++) {

        botones[i].classList.remove("respondida")

        if (respuestasUsuario[i] !== undefined) {

            botones[i].classList.add("respondida")

        }

    }

}


function iniciarTemporizador() {

    clearInterval(temporizador)

    temporizador = setInterval(function(){

        tiempoRestante--

        const m = Math.floor(tiempoRestante/60)
        const s = tiempoRestante%60

        document.getElementById("timer").innerText =
            "Tiempo: " +
            m + ":" +
            s.toString().padStart(2,"0")

        if (tiempoRestante <= 0) {

            clearInterval(temporizador)

            terminarExamen()

        }

    },1000)

}


function mostrar() {

    respondida = false

    const p = test[actual]

    document.getElementById("info").innerText =
        "Pregunta " +
        (actual+1) +
        " / " +
        test.length

    document.getElementById("pregunta").innerText =
        p.pregunta

    const contenedor =
        document.getElementById("opciones")

    contenedor.innerHTML = ""

    for (let i=0;i<p.opciones.length;i++) {

        const boton = document.createElement("button")

        boton.className = "opcion"

        boton.innerText = p.opciones[i]

        boton.onclick = function(){

            respuestasUsuario[actual] = i

            const botones = contenedor.children

            for (let b of botones) {

                b.classList.remove("seleccionada")

            }

            botones[i].classList.add("seleccionada")

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

            estadisticas.respondidas++

            if (i === p.correcta) {

                aciertos++
                estadisticas.aciertos++

            } else {

                estadisticas.fallos++
                falladas.push(p)

            }

            guardarEstadisticas()

            actualizarNavegacion()

        }

        contenedor.appendChild(boton)

    }

}


function siguiente() {

    actual++

    if (actual >= test.length) {

        terminarExamen()

        return

    }

    mostrar()

}


function terminarExamen() {

    clearInterval(temporizador)

    mostrarRevision()

}


function mostrarRevision() {

    const contenedor =
        document.getElementById("opciones")

    document.getElementById("pregunta").innerText =
        "Revisión del examen"

    document.getElementById("info").innerText =
        "Aciertos: " +
        aciertos +
        " de " +
        test.length

    contenedor.innerHTML = ""

    for (let i=0;i<test.length;i++) {

        const p = test[i]

        const bloque = document.createElement("div")

        bloque.style.marginBottom = "20px"

        const titulo = document.createElement("div")

        titulo.innerText =
            (i+1) + ". " + p.pregunta

        bloque.appendChild(titulo)

        for (let j=0;j<p.opciones.length;j++) {

            const linea = document.createElement("div")

            linea.innerText = p.opciones[j]

            if (j === p.correcta) {

                linea.style.backgroundColor = "#8fd694"

            }

            if (
                respuestasUsuario[i] === j &&
                j !== p.correcta
            ) {

                linea.style.backgroundColor = "#f28b82"

            }

            bloque.appendChild(linea)

        }

        contenedor.appendChild(bloque)

    }

}


window.addEventListener("DOMContentLoaded", function(){

    if (localStorage.getItem("acceso") === "ok") {

        iniciarApp()

    }

})
