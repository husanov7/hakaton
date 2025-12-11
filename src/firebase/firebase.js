// src/Utils/firebase/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getFirestore, 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  deleteDoc,
  serverTimestamp
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase konfiguratsiyasi
const firebaseConfig = {
  apiKey: "AIzaSyAeirbtct_3GK0o8QhF_h3y_GrvflpO5Xo",
  authDomain: "qrmenu-a61b8.firebaseapp.com",
  projectId: "qrmenu-a61b8",
  storageBucket: "qrmenu-a61b8.firebasestorage.app",
  messagingSenderId: "931352270385",
  appId: "1:931352270385:web:ecec29a1d9a28ff058e710",
  measurementId: "G-JQC8PV9LGJ",
};

// Firebase ilovasini ishga tushirish
const app = initializeApp(firebaseConfig);

// Export
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Menyu olish
export const fetchMenu = async () => {
  try {
    const snapshot = await getDocs(collection(db, "dishes"));
    const dishes = snapshot.docs.map(doc => {
      const data = doc.data();
      console.log("📋 Ovqat:", doc.id, "Category:", data.category); // Debug
      return {
        id: doc.id,
        title: data.title || "No title",
        price: Number(data.price) || 0,
        imageUrl: data.imageUrl || "",
        description: data.description || "",
        category: data.category || "ovqatlar", // Default category
      };
    });
    console.log("✅ Jami ovqatlar:", dishes.length);
    return dishes;
  } catch (error) {
    console.error("Menu olishda xato:", error);
    return [];
  }
};

// ✅ YANGILANGAN - To'lov statusli buyurtma yuborish
export const sendOrder = async (tableNumber, items, paymentStatus = "unpaid", totalAmount = 0) => {
  try {
    if (!items || items.length === 0) {
      throw new Error("Buyurtma bo'sh!");
    }

    console.log("📤 Buyurtma yuborilmoqda:", {
      table: tableNumber,
      items: items.length + " ta ovqat",
      paymentStatus: paymentStatus,
      totalAmount: totalAmount
    });

    const orderData = {
      table: String(tableNumber), // ← String sifatida (OrderHistory'da filter uchun)
      items: items.map((i) => ({
        id: i.id || "no-id",
        title: i.title || "No title",
        price: Number(i.price) || 0,
        count: Number(i.count) || 1,
        imageUrl: i.imageUrl || "",
      })),
      status: "pending",
      paymentStatus: paymentStatus, // ← YANGI: unpaid, pending_payment, paid
      totalAmount: totalAmount,      // ← YANGI: jami summa
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "orders"), orderData);
    console.log("✅ Buyurtma yuborildi! ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("❌ Buyurtma yuborishda xato:", error);
    throw error;
  }
};

// Taomni o'chirish
export const deleteDish = async (id) => {
  try {
    await deleteDoc(doc(db, "dishes", id));
    console.log("✅ Ovqat o'chirildi");
  } catch (error) {
    console.error("❌ O'chirishda xato:", error);
    throw error;
  }
};
