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

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const userName = document.getElementById("userName");

const loginSection = document.getElementById("login-section");
const userSection = document.getElementById("user-section");
const postSection = document.getElementById("post-section");

const postBtn = document.getElementById("postBtn");
const postsDiv = document.getElementById("posts");

// Login
loginBtn.onclick = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider);
};

// Logout
logoutBtn.onclick = () => {
  auth.signOut();
};

// Auth State
auth.onAuthStateChanged(user => {
  if (user) {
    userName.innerText = "👤 " + user.displayName;

    loginSection.classList.add("hidden");
    userSection.classList.remove("hidden");
    postSection.classList.remove("hidden");

    loadPosts();
  } else {
    loginSection.classList.remove("hidden");
    userSection.classList.add("hidden");
    postSection.classList.add("hidden");
  }
});

// Add Post
postBtn.onclick = async () => {
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const type = document.getElementById("type").value;

  await db.collection("posts").add({
    title,
    description,
    type,
    createdAt: new Date()
  });

  loadPosts();
};

// Load Posts
async function loadPosts() {
  postsDiv.innerHTML = "";

  const snapshot = await db.collection("posts")
    .orderBy("createdAt", "desc")
    .get();

  snapshot.forEach(doc => {
    const data = doc.data();

    const div = document.createElement("div");
    div.className = `post ${data.type}`;

    div.innerHTML = `
      <h3>${data.title}</h3>
      <p>${data.description}</p>
      <small>${data.type === "lost" ? "❌ ของหาย" : "✅ ของที่พบ"}</small>
    `;

    postsDiv.appendChild(div);
  });
}
