// src/services/waiterService.js

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  serverTimestamp,
  onSnapshot
} from "firebase/firestore";
import { db } from "../firebase/firebase";

/* ======================
   WAITERS (ADMIN)
====================== */

export const addWaiter = async (waiterData) => {
  return addDoc(collection(db, "waiters"), {
    ...waiterData,
    isActive: true,
    createdAt: serverTimestamp()
  });
};

export const fetchWaiters = async () => {
  const snap = await getDocs(collection(db, "waiters"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const updateWaiter = async (id, data) =>
  updateDoc(doc(db, "waiters", id), data);

export const deleteWaiter = async (id) =>
  deleteDoc(doc(db, "waiters", id));

/* ======================
   WAITER CALLS (CLIENT)
====================== */

export const callWaiter = async (tableNumber) => {
  const tableNum = Number(tableNumber); // <--- STRING bo‘lsa numberga o‘tkazish

  const q = query(
    collection(db, "waiters"),
    where("assignedTables", "array-contains", tableNum),
    where("isActive", "==", true)
  );

  const snap = await getDocs(q);
  if (snap.empty) throw new Error("Ofitsiant topilmadi");

  const waiterDoc = snap.docs[0];
  const waiterData = waiterDoc.data();

  await addDoc(collection(db, "waiterCalls"), {
    tableNumber: tableNum,
    waiterId: waiterDoc.id,
    status: "pending",
    createdAt: serverTimestamp()
  });

  return {
    waiterId: waiterDoc.id,
    waiterName: waiterData.name,
    waiterPhone: waiterData.phone
  };
};



export const subscribeToWaiterCalls = (tableNumber, cb) => {
  let q = query(
    collection(db, "waiterCalls"),
    where("status", "==", "pending")
  );

  if (tableNumber) {
    q = query(q, where("tableNumber", "==", tableNumber));
  }

  return onSnapshot(q, snap =>
    cb(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  );
};
