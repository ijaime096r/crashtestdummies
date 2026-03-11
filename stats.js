let estadisticas={
    respondidas:0,
    aciertos:0,
    fallos:0
}

let fallosPorPregunta={}

function cargarEstadisticas(){

    const datos=localStorage.getItem("estadisticas")

    if(datos) estadisticas=JSON.parse(datos)

}

function guardarEstadisticas(){

    localStorage.setItem("estadisticas",JSON.stringify(estadisticas))

}

function cargarFallos(){

    const datos=localStorage.getItem("fallosPreguntas")

    if(datos) fallosPorPregunta=JSON.parse(datos)

}

function mostrarEstadisticas(){

    const porcentaje=estadisticas.respondidas>0
        ?Math.round(estadisticas.aciertos/estadisticas.respondidas*100)
        :0

    document.getElementById("estadisticas").innerText=
        "Respondidas: "+estadisticas.respondidas+
        " | Aciertos: "+estadisticas.aciertos+
        " | Fallos: "+estadisticas.fallos+
        " | % acierto: "+porcentaje+"%"

}

function resetEstadisticas(){

    if(!confirm("¿Seguro que quieres borrar todas las estadísticas?")) return

    estadisticas={respondidas:0,aciertos:0,fallos:0}
    fallosPorPregunta={}

    localStorage.removeItem("estadisticas")
    localStorage.removeItem("fallosPreguntas")

    mostrarEstadisticas()

}

function resetRepaso(){

    if(!confirm("¿Borrar historial de repaso inteligente?")) return

    fallosPorPregunta={}

    localStorage.removeItem("fallosPreguntas")

}
