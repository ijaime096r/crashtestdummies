import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"

import {
getAuth,
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"


const firebaseConfig = {

apiKey: "TU_API_KEY",
authDomain: "TU_PROYECTO.firebaseapp.com",
projectId: "TU_PROYECTO",
appId: "TU_APP_ID"

}


const app = initializeApp(firebaseConfig)

const auth = getAuth(app)


onAuthStateChanged(auth, (user) => {

if (!user) {

window.location.href = "login.html"

}

})
