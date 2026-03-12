let preguntas = []
let test = []

let actual = 0
let aciertos = 0
let modo = "entrenamiento"

let respuestasUsuario = []

let tiempoRestante = 0
let intervaloTimer = null


async function cargarPreguntas(){

    try{

        const respuesta = await fetch("preguntas.json")

        if(!respuesta.ok){

            alert("Error cargando preguntas")
            return

        }

        preguntas = await respuesta.json()

    }catch(error){

        alert("No se pudieron cargar las preguntas")

    }

}


function mezclarArray(array){

    for(let i = array.length - 1; i > 0; i--){

        const j = Math.floor(Math.random() * (i + 1))

        const temp = array[i]
        array[i] = array[j]
        array[j] = temp

    }

}


function iniciarTest(numero){

    actual = 0
    aciertos = 0
    respuestasUsuario = []

    if(intervaloTimer){

        clearInterval(intervaloTimer)
        intervaloTimer = null

    }

    document.getElementById("timer").innerText = ""

    test = JSON.parse(JSON.stringify(preguntas))

    mezclarArray(test)

    test = test.slice(0, numero)

    crearNavegacion()

    mostrar()

}


function modoEntrenamiento(){

    modo = "entrenamiento"

    iniciarTest(20)

}


function modoFalladas(){

    modo = "falladas"

    const lista = preguntas.filter(function(p){

        return fallosPorPregunta[p.pregunta]

    })

    if(lista.length === 0){

        alert("No hay preguntas falladas todavía")
        return

    }

    test = JSON.parse(JSON.stringify(lista))

    mezclarArray(test)

    test = test.slice(0, 20)

    actual = 0
    respuestasUsuario = []

    crearNavegacion()

    mostrar()

}


function modoRepasoInteligente(){

    modo = "repaso"

    const copia = [...preguntas]

    copia.sort(function(a, b){

        const fa = fallosPorPregunta[a.pregunta] || 0
        const fb = fallosPorPregunta[b.pregunta] || 0

        return fb - fa

    })

    test = copia.slice(0, 20)

    mezclarArray(test)

    actual = 0
    respuestasUsuario = []

    crearNavegacion()

    mostrar()

}


function iniciarTemporizador(minutos){

    tiempoRestante = minutos * 60

    actualizarTimer()

    intervaloTimer = setInterval(function(){

        tiempoRestante--

        actualizarTimer()

        if(tiempoRestante <= 0){

            clearInterval(intervaloTimer)

            alert("Tiempo terminado")

            finalizarExamen()

        }

    }, 1000)

}


function actualizarTimer(){

    const min = Math.floor(tiempoRestante / 60)
    const seg = tiempoRestante % 60

    document.getElementById("timer").innerText =
        "Tiempo: " + min + ":" + seg.toString().padStart(2,"0")

}


function finalizarExamen(){

    let correctas = 0

    for(let i = 0; i < test.length; i++){

        if(respuestasUsuario[i] === test[i].correcta){

            correctas++

        }

    }

    alert("Resultado: " + correctas + " / " + test.length)

}


function mostrar(){

    const p = test[actual]

    document.getElementById("info").innerText =
        "Pregunta " + (actual + 1) + " / " + test.length

    document.getElementById("pregunta").innerText = p.pregunta

    const contenedor = document.getElementById("opciones")

    contenedor.innerHTML = ""

    for(let i = 0; i < p.opciones.length; i++){

        const boton = document.createElement("button")

        boton.className = "opcion"

        boton.innerText = p.opciones[i]

        boton.onclick = function(){

            const primeraRespuesta = respuestasUsuario[actual] === undefined

            respuestasUsuario[actual] = i

            const botones = contenedor.children

            for(let b of botones){

                b.classList.remove("seleccionada")
                b.classList.remove("correcta")
                b.classList.remove("incorrecta")

            }

            botones[i].classList.add("seleccionada")

            if(modo !== "examen"){

                for(let j = 0; j < botones.length; j++){

                    if(j === p.correcta){

                        botones[j].classList.add("correcta")

                    }

                }

                if(i !== p.correcta){

                    botones[i].classList.add("incorrecta")

                }

            }

            if(primeraRespuesta){

                estadisticas.respondidas++

                if(i === p.correcta){

                    aciertos++
                    estadisticas.aciertos++

                }else{

                    estadisticas.fallos++

                    const id = p.pregunta

                    if(!fallosPorPregunta[id]){

                        fallosPorPregunta[id] = 0

                    }

                    fallosPorPregunta[id]++

                    localStorage.setItem(
                        "fallosPreguntas",
                        JSON.stringify(fallosPorPregunta)
                    )

                }

                guardarEstadisticas()

                mostrarEstadisticas()

            }

            actualizarNavegacion()

        }

        contenedor.appendChild(boton)

    }

}


function siguiente(){

    actual++

    if(actual >= test.length){

        if(modo === "examen"){

            finalizarExamen()

        }else{

            alert("Test terminado")

        }

        return

    }

    mostrar()

}


function crearNavegacion(){

    const nav = document.getElementById("navegacion")

    nav.innerHTML = ""

    for(let i = 0; i < test.length; i++){

        const b = document.createElement("button")

        b.className = "botonPregunta"

        b.innerText = i + 1

        b.onclick = function(){

            actual = i

            mostrar()

        }

        nav.appendChild(b)

    }

}


function actualizarNavegacion(){

    const botones = document.getElementById("navegacion").children

    for(let i = 0; i < botones.length; i++){

        botones[i].classList.remove("respondida")

        if(respuestasUsuario[i] !== undefined){

            botones[i].classList.add("respondida")

        }

    }

}


function mostrarConfigExamen(){

    const bloque = document.getElementById("configExamen")

    if(bloque.style.display === "none"){

        bloque.style.display = "block"

    }else{

        bloque.style.display = "none"

    }

}


function iniciarExamen(){

    const minutos = parseInt(
        document.getElementById("tiempoExamen").value
    )

    if(!minutos || minutos <= 0){

        alert("Tiempo no válido")
        return

    }

    modo = "examen"

    iniciarTest(50)

    iniciarTemporizador(minutos)

}


document.addEventListener("keydown", function(e){

    if(e.key === "Enter"){

        siguiente()

    }

})
