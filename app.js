const PASSWORD = "canarias"

function login(){

    const clave=document.getElementById("clave").value

    if(clave===PASSWORD){

        localStorage.setItem("acceso","ok")
        iniciarApp()

    }else{

        alert("Contraseña incorrecta")

    }

}

function iniciarApp(){

    document.getElementById("login").style.display="none"
    document.getElementById("app").style.display="block"

    cargarEstadisticas()
    cargarFallos()
    mostrarEstadisticas()

    cargarPreguntas()

}

window.addEventListener("DOMContentLoaded",function(){

    if(localStorage.getItem("acceso")==="ok") iniciarApp()

})
