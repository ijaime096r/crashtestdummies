// control de autenticación

import { auth } from "./firebase.js"

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"


onAuthStateChanged(auth, (user) => {

if (!user) {

window.location.href = "login.html"

}

})


// variables del test

let preguntas = []
let indice = 0
let aciertos = 0


// cargar preguntas

fetch("preguntas.json")

.then(res => res.json())

.then(data => {

preguntas = data

mostrarPregunta()

})


// mostrar pregunta

function mostrarPregunta() {

let p = preguntas[indice]

document.getElementById("pregunta").textContent = p.pregunta


let contenedor = document.getElementById("respuestas")

contenedor.innerHTML = ""


for (let i = 0; i < p.opciones.length; i++) {

let boton = document.createElement("button")

boton.textContent = p.opciones[i]

boton.onclick = function () {

comprobar(i)

}

contenedor.appendChild(boton)

}

actualizarInfo()

}


// comprobar respuesta

function comprobar(opcion) {

let correcta = preguntas[indice].correcta

if (opcion === correcta) {

aciertos++

alert("Correcto")

}

else {

alert("Incorrecto")

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
