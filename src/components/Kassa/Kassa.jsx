import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import { collection, onSnapshot, query, orderBy, deleteDoc, doc } from "firebase/firestore";

export default function Kassa() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // ✅ Real-time Firestore'dan buyurtmalarni olish
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(ordersData);
    });

    return () => unsubscribe();
  }, []);

  const deleteOrder = async (orderId) => {
    try {
      await deleteDoc(doc(db, "orders", orderId));
      alert("✅ Buyurtma o'chirildi");
    } catch (error) {
      console.error("Xato:", error);
      alert("❌ Xatolik yuz berdi");
    }
  };

  return (
    <div className="p-5 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-center mb-5 text-[#004332]">
        🧾 Kassa - Barcha Buyurtmalar
      </h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">Buyurtma yo'q</p>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white shadow-lg rounded-lg p-4 border border-gray-200"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-lg">
                  🍽 Stol #{order.table}
                </h3>
                <span className="text-sm text-gray-500">
                  {order.createdAt?.toDate().toLocaleString("uz-UZ")}
                </span>
              </div>

              {order.items?.map((item, idx) => (
                <div key={idx} className="flex justify-between py-2 border-b">
                  <span>{item.title}</span>
                  <span className="text-gray-600">
                    {item.count} × {Number(item.price).toLocaleString()} so'm
                  </span>
                </div>
              ))}

              <div className="flex justify-between items-center mt-3 font-bold text-lg">
                <span>Jami:</span>
                <span className="text-[#004332]">
                  {order.items
                    ?.reduce((sum, i) => sum + i.price * i.count, 0)
                    .toLocaleString()}{" "}
                  so'm
                </span>
              </div>

              <button
                onClick={() => deleteOrder(order.id)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg mt-3 hover:bg-red-600 transition w-full"
              >
                ❌ O'chirish
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}