// control de autenticación

import { auth } from "./firebase.js"
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"

let usuarioActual = null

onAuthStateChanged(auth, (user) => {

if (!user) {

window.location.href = "login.html"
return

}

usuarioActual = user.email

cargarPreguntas()

})


// variables del test

let preguntas = []
let indice = 0
let aciertos = 0


// cargar preguntas

function cargarPreguntas() {

let nombreUsuario = usuarioActual.split("@")[0]

let archivo = "preguntas-" + nombreUsuario + ".json"

fetch(archivo)

.then(res => res.json())

.then(data => {

preguntas = mezclar(data)

mostrarPregunta()

})

}


// mostrar pregunta

function mostrarPregunta() {

let p = preguntas[indice]

// crear copia de opciones con su índice original
let opciones = p.opciones.map((texto, i) => {

return {
texto: texto,
indiceOriginal: i
}

})

// mezclar
opciones = mezclar(opciones)

document.getElementById("pregunta").textContent = p.pregunta

let contenedor = document.getElementById("respuestas")

contenedor.innerHTML = ""

opciones.forEach((op, posicion) => {

let boton = document.createElement("button")

boton.textContent = op.texto

boton.dataset.indiceOriginal = op.indiceOriginal

boton.onclick = function () {

comprobar(boton)

}

contenedor.appendChild(boton)

})

actualizarInfo()

}


// comprobar respuesta

function comprobar(botonSeleccionado) {

let correcta = preguntas[indice].correcta

let botones = document.querySelectorAll("#respuestas button")

botones.forEach(b => b.disabled = true)

let indiceSeleccionado = parseInt(botonSeleccionado.dataset.indiceOriginal)

if (indiceSeleccionado === correcta) {

botonSeleccionado.classList.add("correcta")

aciertos++

}

else {

botonSeleccionado.classList.add("incorrecta")

botones.forEach(b => {

if (parseInt(b.dataset.indiceOriginal) === correcta) {

b.classList.add("correcta")

}

})

}

}


// siguiente pregunta

document.getElementById("siguiente").onclick = function () {

indice++

if (indice >= preguntas.length) {

alert("Test terminado")

return

}

mostrarPregunta()

}


// actualizar contador

function actualizarInfo() {

let texto = "Pregunta " + (indice + 1) + " / " + preguntas.length + " | Aciertos: " + aciertos

document.getElementById("info").textContent = texto

}

// mezclar preguntas

function mezclar(array) {

for (let i = array.length - 1; i > 0; i--) {

let j = Math.floor(Math.random() * (i + 1))

let temp = array[i]
array[i] = array[j]
array[j] = temp

}

return array

}
