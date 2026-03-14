// configuración firebase

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"

import {
getAuth,
signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"


const firebaseConfig = {

apiKey: "TU_API_KEY",
authDomain: "TU_PROYECTO.firebaseapp.com",
projectId: "TU_PROYECTO",
appId: "TU_APP_ID"

}


const app = initializeApp(firebaseConfig)

const auth = getAuth(app)


window.login = function () {

let email = document.getElementById("email").value
let password = document.getElementById("password").value


signInWithEmailAndPassword(auth, email, password)

.then(() => {

window.location.href = "index.html"

})

.catch(() => {

document.getElementById("error").textContent = "Login incorrecto"

})

}
