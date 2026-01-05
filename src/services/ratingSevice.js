// src/services/ratingService.js
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where,
  orderBy,
  limit,
  serverTimestamp,
  updateDoc,
  doc,
  getDoc,
  deleteDoc
} from "firebase/firestore";
import { db } from "../firebase/firebase"; // ✅ Sizning firebase config faylingiz

// ========================
// BAHOLASH (RATINGS)
// ========================

// Ofitsiantni baholash
export const rateWaiter = async (ratingData) => {
  try {
    const { waiterId, waiterName, tableNumber, rating, comment, customerName } = ratingData;

    // Validatsiya
    if (!waiterId || !rating) {
      throw new Error("Ofitsiant ID va baho majburiy");
    }

    if (rating < 1 || rating > 5) {
      throw new Error("Baho 1 dan 5 gacha bo'lishi kerak");
    }

    // 1. Rating qo'shish
    const ratingRef = await addDoc(collection(db, "waiterRatings"), {
      waiterId,
      waiterName,
      tableNumber: tableNumber || null,
      rating: Number(rating),
      comment: comment || "",
      customerName: customerName || "Anonim",
      createdAt: serverTimestamp(),
      isApproved: false, // Admin tasdiqlashi uchun
      isPublished: false
    });

    console.log("✅ Baho qo'shildi:", ratingRef.id);

    // 2. Ofitsiantning umumiy bahosini yangilash
    await updateWaiterStats(waiterId);

    return { id: ratingRef.id, ...ratingData };

  } catch (error) {
    console.error("❌ Baholashda xato:", error);
    throw error;
  }
};

// Ofitsiantning statistikasini yangilash
const updateWaiterStats = async (waiterId) => {
  try {
    // Barcha baholarni olish
    const ratingsQuery = query(
      collection(db, "waiterRatings"),
      where("waiterId", "==", waiterId),
      where("isApproved", "==", true)
    );
    
    const ratingsSnapshot = await getDocs(ratingsQuery);
    
    let totalRating = 0;
    let count = 0;
    const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    ratingsSnapshot.forEach((doc) => {
      const data = doc.data();
      totalRating += data.rating;
      count++;
      ratingCounts[data.rating]++;
    });

    const averageRating = count > 0 ? (totalRating / count).toFixed(2) : 0;

    // Ofitsiant ma'lumotlarini yangilash
    const waiterRef = doc(db, "waiters", waiterId);
    await updateDoc(waiterRef, {
      averageRating: Number(averageRating),
      totalRatings: count,
      ratingCounts,
      lastRatedAt: serverTimestamp()
    });

    console.log("✅ Statistika yangilandi:", { averageRating, totalRatings: count });

  } catch (error) {
    console.error("❌ Statistika yangilashda xato:", error);
  }
};

// ========================
// BAHOLARNI OLISH
// ========================

// Bitta ofitsiantning barcha baholarini olish
export const getWaiterRatings = async (waiterId, onlyApproved = true) => {
  try {
    let q = query(
      collection(db, "waiterRatings"),
      where("waiterId", "==", waiterId),
      orderBy("createdAt", "desc")
    );

    if (onlyApproved) {
      q = query(
        collection(db, "waiterRatings"),
        where("waiterId", "==", waiterId),
        where("isApproved", "==", true),
        orderBy("createdAt", "desc")
      );
    }

    const querySnapshot = await getDocs(q);
    const ratings = [];

    querySnapshot.forEach((doc) => {
      ratings.push({ id: doc.id, ...doc.data() });
    });

    return ratings;

  } catch (error) {
    console.error("❌ Baholarni olishda xato:", error);
    throw error;
  }
};

// Barcha baholarni olish (Admin uchun)
export const getAllRatings = async (filterStatus = "all") => {
  try {
    let q = query(
      collection(db, "waiterRatings"),
      orderBy("createdAt", "desc")
    );

    if (filterStatus === "pending") {
      q = query(
        collection(db, "waiterRatings"),
        where("isApproved", "==", false),
        orderBy("createdAt", "desc")
      );
    } else if (filterStatus === "approved") {
      q = query(
        collection(db, "waiterRatings"),
        where("isApproved", "==", true),
        orderBy("createdAt", "desc")
      );
    }

    const querySnapshot = await getDocs(q);
    const ratings = [];

    querySnapshot.forEach((doc) => {
      ratings.push({ id: doc.id, ...doc.data() });
    });

    return ratings;

  } catch (error) {
    console.error("❌ Barcha baholarni olishda xato:", error);
    throw error;
  }
};

// So'nggi baholarni olish
export const getRecentRatings = async (limitCount = 10) => {
  try {
    const q = query(
      collection(db, "waiterRatings"),
      where("isApproved", "==", true),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    const ratings = [];

    querySnapshot.forEach((doc) => {
      ratings.push({ id: doc.id, ...doc.data() });
    });

    return ratings;

  } catch (error) {
    console.error("❌ So'nggi baholarni olishda xato:", error);
    throw error;
  }
};

// ========================
// ADMIN FUNKSIYALARI
// ========================

// Bahoni tasdiqlash/rad etish
export const approveRating = async (ratingId, isApproved) => {
  try {
    const ratingRef = doc(db, "waiterRatings", ratingId);
    await updateDoc(ratingRef, {
      isApproved,
      isPublished: isApproved,
      approvedAt: isApproved ? serverTimestamp() : null
    });

    // Agar tasdiqlansa, ofitsiant statistikasini yangilash
    if (isApproved) {
      const ratingDoc = await getDoc(ratingRef);
      const ratingData = ratingDoc.data();
      await updateWaiterStats(ratingData.waiterId);
    }

    console.log(isApproved ? "✅ Baho tasdiqlandi" : "❌ Baho rad etildi");

  } catch (error) {
    console.error("❌ Bahoni tasdiqlashda xato:", error);
    throw error;
  }
};

// Bahoni o'chirish
export const deleteRating = async (ratingId, waiterId) => {
  try {
    const ratingRef = doc(db, "waiterRatings", ratingId);
    await deleteDoc(ratingRef);
    
    // Statistikani yangilash
    await updateWaiterStats(waiterId);
    
    console.log("✅ Baho o'chirildi");

  } catch (error) {
    console.error("❌ Bahoni o'chirishda xato:", error);
    throw error;
  }
};

// ========================
// TOP OFITSIANTLAR
// ========================

// Eng yaxshi ofitsiantlarni olish
export const getTopWaiters = async (limitCount = 5) => {
  try {
    const waitersSnapshot = await getDocs(collection(db, "waiters"));
    const waiters = [];

    waitersSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.averageRating && data.totalRatings >= 5) { // Kamida 5 ta baho bo'lishi kerak
        waiters.push({
          id: doc.id,
          ...data
        });
      }
    });

    // Bahoga qarab saralash
    waiters.sort((a, b) => b.averageRating - a.averageRating);

    return waiters.slice(0, limitCount);

  } catch (error) {
    console.error("❌ Top ofitsiantlarni olishda xato:", error);
    throw error;
  }
};

// ========================
// STATISTIKA
// ========================

// Ofitsiantning batafsil statistikasini olish
export const getWaiterDetailedStats = async (waiterId) => {
  try {
    const waiterDoc = await getDoc(doc(db, "waiters", waiterId));
    
    if (!waiterDoc.exists()) {
      throw new Error("Ofitsiant topilmadi");
    }

    const waiterData = waiterDoc.data();
    const ratings = await getWaiterRatings(waiterId, true);

    // Oxirgi 30 kunlik statistika
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentRatings = ratings.filter(r => 
      r.createdAt?.toDate() > thirtyDaysAgo
    );

    return {
      waiter: waiterData,
      totalRatings: waiterData.totalRatings || 0,
      averageRating: waiterData.averageRating || 0,
      ratingCounts: waiterData.ratingCounts || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      recentRatingsCount: recentRatings.length,
      allRatings: ratings
    };

  } catch (error) {
    console.error("❌ Statistika olishda xato:", error);
    throw error;
  }
};