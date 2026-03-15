// control de autenticación

import { auth } from "./firebase.js"
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"
import { db } from "./firebase.js"

import {
collection,
addDoc,
getDocs,
query,
where
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"

let usuarioActual = null
let modoSeleccionado = null
let fallosUsuario = []

onAuthStateChanged(auth, (user) => {

if (!user) {

window.location.href = "login.html"
return

}

usuarioActual = user.email
  
let nombreUsuario = usuarioActual.split("@")[0]

// solo meganot puede elegir modo
if (nombreUsuario === "megant") {

document.getElementById("modoTest").style.display = "block"

} else {

modoSeleccionado = "basico"

document.getElementById("modoTest").style.display = "none"
document.getElementById("test").style.display = "block"

cargarPreguntas()

}

})


// seleccionar modo

window.seleccionarModo = function(modo) {

modoSeleccionado = modo

document.getElementById("modoTest").style.display = "none"
document.getElementById("test").style.display = "block"

cargarPreguntas()

}


// variables del test

let preguntas = []
let indice = 0
let aciertos = 0


// cargar preguntas

async function cargarPreguntas() {

let nombreUsuario = usuarioActual.split("@")[0]

await cargarFallosUsuario()

let archivo = "preguntas-" + nombreUsuario + "-" + modoSeleccionado + ".json"

fetch(archivo)

.then(res => res.json())

.then(data => {

preguntas = mezclar(data)

// añadir algunos fallos al banco
preguntas = preguntas.concat(mezclar(fallosUsuario).slice(0, 5))

preguntas = mezclar(preguntas)

indice = 0
aciertos = 0

mostrarPregunta()

})

}

async function cargarFallosUsuario() {

let nombreUsuario = usuarioActual.split("@")[0]

let q = query(
collection(db, "fallos"),
where("usuario", "==", nombreUsuario)
)

let snapshot = await getDocs(q)

fallosUsuario = []

snapshot.forEach(doc => {

fallosUsuario.push(doc.data().pregunta)

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

// mezclar respuestas
opciones = mezclar(opciones)

document.getElementById("pregunta").textContent = p.pregunta

let contenedor = document.getElementById("respuestas")

contenedor.innerHTML = ""

opciones.forEach((op) => {

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
  
guardarFallo(preguntas[indice])
  
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


// pasar a la siguiente pregunta con intro

document.addEventListener("keydown", function(event) {

if (event.key === "Enter") {

document.getElementById("siguiente").click()

}

})

async function guardarFallo(pregunta) {

let nombreUsuario = usuarioActual.split("@")[0]

try {

await addDoc(collection(db, "fallos"), {

usuario: nombreUsuario,
pregunta: pregunta,
fecha: Date.now()
  
})

} catch (error) {

console.log("Error guardando fallo:", error)

}

}

window.repasarFallos = async function() {

let nombreUsuario = usuarioActual.split("@")[0]

try {

let q = query(
collection(db, "fallos"),
where("usuario", "==", nombreUsuario)
)

let snapshot = await getDocs(q)

preguntas = []

snapshot.forEach(doc => {

preguntas.push(doc.data().pregunta)

})

if (preguntas.length === 0) {

alert("No tienes fallos guardados")

return

}

preguntas = mezclar(preguntas)

indice = 0
aciertos = 0

document.getElementById("modoTest").style.display = "none"
document.getElementById("test").style.display = "block"

mostrarPregunta()

} catch (error) {

console.log("Error cargando fallos:", error)

}

}

window.volverMenu = function() {

indice = 0
aciertos = 0

let nombreUsuario = usuarioActual.split("@")[0]

if (nombreUsuario === "meganot") {

document.getElementById("test").style.display = "none"
document.getElementById("modoTest").style.display = "block"

} else {

// para otros usuarios volver directamente al básico
modoSeleccionado = "basico"

document.getElementById("modoTest").style.display = "none"
document.getElementById("test").style.display = "block"

cargarPreguntas()

}

}
