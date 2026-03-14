import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"

const firebaseConfig = {
  apiKey: "AIzaSyCHIlXfqIKXq0-SqABA-NSuiiBFQ6rOjnU",
  authDomain: "test-ferroviario-157ee.firebaseapp.com",
  projectId: "test-ferroviario-157ee",
  storageBucket: "test-ferroviario-157ee.firebasestorage.app",
  messagingSenderId: "93046466366",
  appId: "1:93046466366:web:4aefd781fe37968c4fae6f"
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
