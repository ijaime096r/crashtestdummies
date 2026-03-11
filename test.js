let preguntas=[]
let test=[]

let actual=0
let aciertos=0
let modo="entrenamiento"

let respuestasUsuario=[]

async function cargarPreguntas(){

    const respuesta=await fetch("preguntas.json")

    preguntas=await respuesta.json()

}

function mezclarArray(array){

    for(let i=array.length-1;i>0;i--){

        const j=Math.floor(Math.random()*(i+1))

        const temp=array[i]
        array[i]=array[j]
        array[j]=temp

    }

}

function iniciarTest(numero){

    actual=0
    aciertos=0
    respuestasUsuario=[]

    test=JSON.parse(JSON.stringify(preguntas))

    mezclarArray(test)

    test=test.slice(0,numero)

    crearNavegacion()

    mostrar()

}

function modoEntrenamiento(){

    modo="entrenamiento"
    iniciarTest(20)

}

function modoFalladas(){

    modo="falladas"
    iniciarTest(20)

}

function modoRepasoInteligente(){

    modo="repaso"

    const copia=[...preguntas]

    copia.sort(function(a,b){

        const fa=fallosPorPregunta[a.pregunta]||0
        const fb=fallosPorPregunta[b.pregunta]||0

        return fb-fa

    })

    test=copia.slice(0,20)

    crearNavegacion()

    mostrar()

}

function mostrar(){

    const p=test[actual]

    document.getElementById("pregunta").innerText=p.pregunta

    const contenedor=document.getElementById("opciones")

    contenedor.innerHTML=""

    for(let i=0;i<p.opciones.length;i++){

        const boton=document.createElement("button")

        boton.className="opcion"

        boton.innerText=p.opciones[i]

        boton.onclick=function(){

            respuestasUsuario[actual]=i

            const botones=contenedor.children

            for(let b of botones){

                b.classList.remove("seleccionada")
                b.classList.remove("correcta")
                b.classList.remove("incorrecta")

            }

            botones[i].classList.add("seleccionada")

            if(modo==="entrenamiento"||modo==="falladas"||modo==="repaso"){

                for(let j=0;j<botones.length;j++){

                    if(j===p.correcta){

                        botones[j].classList.add("correcta")

                    }

                }

                if(i!==p.correcta){

                    botones[i].classList.add("incorrecta")

                }

            }

            estadisticas.respondidas++

            if(i===p.correcta){

                aciertos++
                estadisticas.aciertos++

            }else{

                estadisticas.fallos++

            }

            guardarEstadisticas()
            mostrarEstadisticas()

        }

        contenedor.appendChild(boton)

    }

}

function siguiente(){

    actual++

    if(actual>=test.length){

        alert("Test terminado")

        return

    }

    mostrar()

}

document.addEventListener("keydown",function(e){

    if(e.key==="Enter") siguiente()

})
