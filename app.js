import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { getFirestore, collection, addDoc, getDocs } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 🔥 Firebase Config (ของคุณ)
const firebaseConfig = {
  apiKey: "AIzaSyDvVw8GBvSRczBFzuTtikUZJU6W17WtB3w",
  authDomain: "lostfoundbuddy.firebaseapp.com",
  projectId: "lostfoundbuddy",
  storageBucket: "lostfoundbuddy.firebasestorage.app",
  messagingSenderId: "561772215230",
  appId: "1:561772215230:web:dea84f8ad5f0366ab117ef",
  measurementId: "G-E8SN2LMRC0"
};

// init
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// =====================
// AUTH
// =====================
window.register = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("สมัครสมาชิกสำเร็จ");
  } catch (err) {
    alert(err.message);
  }
};

window.login = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("เข้าสู่ระบบสำเร็จ");
  } catch (err) {
    alert(err.message);
  }
};

window.logout = async function () {
  await signOut(auth);
};

// =====================
// ตรวจสอบสถานะ login
// =====================
onAuthStateChanged(auth, (user) => {
  if (user) {
    document.getElementById("auth").style.display = "none";
    document.getElementById("app").style.display = "block";
    loadItems();
  } else {
    document.getElementById("auth").style.display = "block";
    document.getElementById("app").style.display = "none";
  }
});

// =====================
// Firestore
// =====================
window.addItem = async function () {
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const type = document.getElementById("type").value;

  await addDoc(collection(db, "items"), {
    title,
    description,
    type,
    createdAt: new Date()
  });

  alert("บันทึกเรียบร้อย");
  loadItems();
};

async function loadItems() {
  const querySnapshot = await getDocs(collection(db, "items"));
  const list = document.getElementById("list");
  list.innerHTML = "";

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const li = document.createElement("li");
    li.textContent = `${data.title} - ${data.type}`;
    list.appendChild(li);
  });
}
