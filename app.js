import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { getFirestore, collection, addDoc, getDocs } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyDvVw8GBvSRczBFzuTtikUZJU6W17WtB3w",
  authDomain: "lostfoundbuddy.firebaseapp.com",
  projectId: "lostfoundbuddy",
  storageBucket: "lostfoundbuddy.firebasestorage.app",
  messagingSenderId: "561772215230",
  appId: "1:561772215230:web:dea84f8ad5f0366ab117ef",
  measurementId: "G-E8SN2LMRC0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// AUTH
window.register = async () => {
  const email = emailInput.value;
  const password = passwordInput.value;
  await createUserWithEmailAndPassword(auth, email, password);
};

window.login = async () => {
  await signInWithEmailAndPassword(auth, email.value, password.value);
};

window.logout = () => signOut(auth);

// STATE
onAuthStateChanged(auth, (user) => {
  document.getElementById("auth").style.display = user ? "none" : "block";
  document.getElementById("dashboard").style.display = user ? "block" : "none";
  if (user) loadItems();
});

// ADD
window.addItem = async () => {
  await addDoc(collection(db, "items"), {
    title: title.value,
    desc: desc.value,
    type: type.value
  });
  loadItems();
};

// LOAD
async function loadItems() {
  const list = document.getElementById("list");
  list.innerHTML = "";

  const snap = await getDocs(collection(db, "items"));
  snap.forEach(doc => {
    const d = doc.data();
    list.innerHTML += `
      <div class="card">
        <h3>${d.title}</h3>
        <p>${d.desc}</p>
        <span>${d.type}</span>
      </div>
    `;
  });
}
