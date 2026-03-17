// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDvVw8GBvSRczBFzuTtikUZJU6W17WtB3w",
  authDomain: "lostfoundbuddy.firebaseapp.com",
  projectId: "lostfoundbuddy",
  storageBucket: "lostfoundbuddy.firebasestorage.app",
  messagingSenderId: "561772215230",
  appId: "1:561772215230:web:dea84f8ad5f0366ab117ef",
  measurementId: "G-E8SN2LMRC0"
};

// Init Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Register
function register() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then(() => alert("สมัครสมาชิกสำเร็จ"))
    .catch(err => alert(err.message));
}

// Login
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => alert("เข้าสู่ระบบสำเร็จ"))
    .catch(err => alert(err.message));
}

// Logout
function logout() {
  auth.signOut();
}

// Auth State
auth.onAuthStateChanged(user => {
  if (user) {
    document.getElementById("auth-section").classList.add("hidden");
    document.getElementById("app-section").classList.remove("hidden");
    loadPosts();
  } else {
    document.getElementById("auth-section").classList.remove("hidden");
    document.getElementById("app-section").classList.add("hidden");
  }
});

// Add Post
function addPost() {
  const title = document.getElementById("title").value;
  const detail = document.getElementById("detail").value;
  const type = document.getElementById("type").value;

  db.collection("posts").add({
    title,
    detail,
    type,
    createdAt: new Date()
  })
  .then(() => {
    alert("เพิ่มโพสต์สำเร็จ");
    loadPosts();
  });
}

// Load Posts
function loadPosts() {
  const postList = document.getElementById("post-list");
  postList.innerHTML = "";

  db.collection("posts")
    .orderBy("createdAt", "desc")
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        const data = doc.data();

        const div = document.createElement("div");
        div.classList.add("post");
        div.classList.add(data.type);

        div.innerHTML = `
          <strong>${data.title}</strong><br>
          ${data.detail}<br>
          <small>${data.type === "lost" ? "🔴 ของหาย" : "🟢 ของที่พบ"}</small>
        `;

        postList.appendChild(div);
      });
    });
}
