import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc,
  serverTimestamp,
  query,
  orderBy 
} from "firebase/firestore";

// ✅ Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyA8zXN1KjslZYtX5tJ-zD8sLr7A0UzTJ8Q",
  authDomain: "qrmenu-a61b8.firebaseapp.com",
  projectId: "qrmenu-a61b8",
  storageBucket: "qrmenu-a61b8.firebasestorage.app",
  messagingSenderId: "966328361114",
  appId: "1:966328361114:web:bcd935d3c7ca2e0a8f0c6a"
};

const app = initializeApp(firebaseConfig);
console.log("🔥 Firebase project:", app.options.projectId);

export const auth = getAuth(app);
export const db = getFirestore(app);

// ===================================
// ✅ FETCH MENU - VARIANTS BILAN
// ===================================
export const fetchMenu = async () => {
  try {
    const dishesSnapshot = await getDocs(collection(db, "dishes"));
    
    const dishes = dishesSnapshot.docs.map((doc) => {
      const data = doc.data();
      
      return {
        id: doc.id,
        ...data,  // 👈 variants ham avtomatik keladi
        // Agar variants Array bo'lmasa, bo'sh array qilish:
        variants: Array.isArray(data.variants) ? data.variants : []
      };
    });

    console.log("🍽️ Menyu yuklandi:", dishes.length, "ta ovqat");
    
    // Debug uchun - variants bor ovqatlarni ko'rsatish
    const withVariants = dishes.filter(d => d.variants && d.variants.length > 0);
    console.log("✅ Variantli ovqatlar:", withVariants.length);
    console.log("📋 Variantli ovqatlar:", withVariants.map(d => ({ 
      title: d.title, 
      variants: d.variants 
    })));
    
    return dishes;
  } catch (error) {
    console.error("❌ Menyu olishda xato:", error);
    throw error;
  }
};

// ===================================
// ✅ SEND ORDER - TO'LOV USULI BILAN
// ===================================
export const sendOrder = async (
  tableNumber, 
  items, 
  paymentStatus = "unpaid", 
  totalAmount = 0,
  orderId = null,
  paymentMethod = "cash"  // 👈 default: cash
) => {
  try {
    console.log("📤 Buyurtma yuborilmoqda:", {
      table: tableNumber,
      items: items.length + " ta ovqat",
      paymentStatus,
      paymentMethod,
      totalAmount
    });

    const orderData = {
      table: String(tableNumber),
      items: items,
      status: "pending",
      paymentStatus: paymentStatus,
      paymentMethod: paymentMethod,  // 👈 to'lov usuli
      totalAmount: totalAmount,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    if (orderId) {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, {
        ...orderData,
        updatedAt: serverTimestamp(),
      });
      console.log("✅ Buyurtma yangilandi! ID:", orderId);
      return orderId;
    } else {
      const docRef = await addDoc(collection(db, "orders"), orderData);
      console.log("✅ Buyurtma yuborildi! ID:", docRef.id);
      return docRef.id;
    }
  } catch (error) {
    console.error("❌ Buyurtma yuborishda xato:", error);
    throw error;
  }
};

// ===================================
// ✅ FETCH ORDERS
// ===================================
export const fetchOrders = async () => {
  try {
    const ordersQuery = query(
      collection(db, "orders"),
      orderBy("createdAt", "desc")
    );
    
    const ordersSnapshot = await getDocs(ordersQuery);
    
    const orders = ordersSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
      };
    });

    return orders;
  } catch (error) {
    console.error("❌ Buyurtmalarni olishda xato:", error);
    throw error;
  }
};

// ===================================
// ✅ DELETE ORDER
// ===================================
export const deleteOrder = async (orderId) => {
  try {
    await deleteDoc(doc(db, "orders", orderId));
    console.log("✅ Buyurtma o'chirildi:", orderId);
  } catch (error) {
    console.error("❌ Buyurtmani o'chirishda xato:", error);
    throw error;
  }
};

// ===================================
// ✅ UPDATE ORDER STATUS
// ===================================
export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, {
      status: newStatus,
      updatedAt: serverTimestamp(),
    });
    console.log(`✅ Buyurtma ${orderId} statusi o'zgartirildi:`, newStatus);
  } catch (error) {
    console.error("❌ Status o'zgartirishda xato:", error);
    throw error;
  }
};

export default app;