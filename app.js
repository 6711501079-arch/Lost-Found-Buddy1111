// นำเข้า Firebase modules ผ่าน CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// ตั้งค่า Firebase ตามที่คุณให้มา
const firebaseConfig = {
    apiKey: "AIzaSyB-cO6DfqpDbKrr7ZEYfT2VOvxUWzyZYKg",
    authDomain: "lost-b7c3c.firebaseapp.com",
    projectId: "lost-b7c3c",
    storageBucket: "lost-b7c3c.firebasestorage.app",
    messagingSenderId: "1093239801094",
    appId: "1:1093239801094:web:d5477c661ed439bd294a87",
    measurementId: "G-PLZ4BTQ7PQ"
};

// เริ่มต้นใช้งาน Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ผูกตัวแปรกับ HTML Elements
const authSection = document.getElementById('auth-section');
const appSection = document.getElementById('app-section');
const userMenu = document.getElementById('user-menu');
const userEmailDisplay = document.getElementById('user-email');
const authError = document.getElementById('auth-error');

// ระบบ Authentication
document.getElementById('login-btn').addEventListener('click', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    signInWithEmailAndPassword(auth, email, password)
        .catch(error => showAuthError("ล็อกอินล้มเหลว: ตรวจสอบอีเมลหรือรหัสผ่าน"));
});

document.getElementById('register-btn').addEventListener('click', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    createUserWithEmailAndPassword(auth, email, password)
        .catch(error => showAuthError("สมัครสมาชิกล้มเหลว: " + error.message));
});

document.getElementById('logout-btn').addEventListener('click', () => {
    signOut(auth);
});

function showAuthError(msg) {
    authError.textContent = msg;
    authError.classList.remove('hidden');
}

// ตรวจสอบสถานะการล็อกอิน
onAuthStateChanged(auth, (user) => {
    if (user) {
        // ล็อกอินสำเร็จ
        authSection.classList.add('hidden');
        appSection.classList.remove('hidden');
        userMenu.classList.remove('hidden');
        userEmailDisplay.textContent = user.email;
        loadItems(); // โหลดข้อมูลเมื่อล็อกอิน
    } else {
        // ยังไม่ได้ล็อกอิน
        authSection.classList.remove('hidden');
        appSection.classList.add('hidden');
        userMenu.classList.add('hidden');
        document.getElementById('auth-form').reset();
        authError.classList.add('hidden');
    }
});

// ระบบ Modal แจ้งรายการใหม่
const modal = document.getElementById('add-modal');
document.getElementById('show-add-modal-btn').addEventListener('click', () => modal.classList.remove('hidden'));
document.getElementById('close-modal').addEventListener('click', () => modal.classList.add('hidden'));

// บันทึกข้อมูลลง Firestore Database
document.getElementById('add-item-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const type = document.getElementById('item-type').value;
    const title = document.getElementById('item-title').value;
    const desc = document.getElementById('item-desc').value;
    const contact = document.getElementById('item-contact').value;

    try {
        await addDoc(collection(db, "items"), {
            type: type,
            title: title,
            description: desc,
            contact: contact,
            reporterEmail: auth.currentUser.email,
            createdAt: serverTimestamp()
        });
        
        modal.classList.add('hidden');
        document.getElementById('add-item-form').reset();
    } catch (error) {
        console.error("Error adding document: ", error);
        alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
});

// โหลดข้อมูลจาก Firestore มาแสดงผลแบบ Real-time
function loadItems() {
    const q = query(collection(db, "items"), orderBy("createdAt", "desc"));
    
    onSnapshot(q, (snapshot) => {
        const grid = document.getElementById('items-grid');
        grid.innerHTML = ''; // เคลียร์ของเก่าก่อนแสดงใหม่
        
        snapshot.forEach((doc) => {
            const data = doc.data();
            const itemElement = document.createElement('div');
            itemElement.className = `item-card ${data.type}`;
            
            const badgeText = data.type === 'lost' ? 'ตามหาของ (Lost)' : 'พบเจอของ (Found)';
            
            itemElement.innerHTML = `
                <span class="badge ${data.type}">${badgeText}</span>
                <h3 class="item-title">${data.title}</h3>
                <p class="item-desc">${data.description}</p>
                <div class="item-contact">
                    <i class="fas fa-phone-alt"></i> ติดต่อ: ${data.contact}
                </div>
            `;
            grid.appendChild(itemElement);
        });
    });
}
