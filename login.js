import { auth } from "./firebase.js"

import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"


window.login = function () {

let email = document.getElementById("email").value
let password = document.getElementById("password").value


signInWithEmailAndPassword(auth, email, password)

.then(() => {

window.location.href = "index.html"

})

.catch((error) => {

console.log(error.code)
console.log(error.message)

document.getElementById("error").textContent = error.code

})

}
