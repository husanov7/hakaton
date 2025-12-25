// src/pages/PaymentHistory/PaymentHistory.jsx
import { useState, useEffect } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../../firebase/firebase";

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, online, cash

  const urlParams = new URLSearchParams(window.location.search);
  const tableNumber = urlParams.get("table") || "1";

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        // To'langan buyurtmalarni olish
        const ordersQuery = query(
          collection(db, "orders"),
          where("table", "==", String(tableNumber)),
          where("paymentStatus", "==", "paid"),
          orderBy("paidAt", "desc")
        );

        const snapshot = await getDocs(ordersQuery);
        
        const paymentsData = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            paidAt: data.paidAt?.toDate() || data.createdAt?.toDate() || new Date(),
            createdAt: data.createdAt?.toDate() || new Date()
          };
        });

        setPayments(paymentsData);
      } catch (error) {
        console.error("❌ To'lovlarni olishda xato:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [tableNumber]);

  const formatDate = (date) => {
    if (!date) return "Noma'lum";
    
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('uz-UZ', options);
  };

  const getPaymentMethodBadge = (method) => {
    const badges = {
      online: { text: "💳 Online", bg: "bg-blue-500" },
      cash: { text: "💵 Naqd", bg: "bg-green-500" }
    };
    
    const badge = badges[method] || { text: "❓ Noma'lum", bg: "bg-gray-500" };
    
    return (
      <span className={`${badge.bg} text-white px-3 py-1 rounded-full text-xs font-bold`}>
        {badge.text}
      </span>
    );
  };

  const calculateTotal = (items) => {
    if (!items || !Array.isArray(items)) return 0;
    return items.reduce((sum, item) => 
      sum + (item.price * item.count), 0
    );
  };

  const filteredPayments = filter === "all" 
    ? payments 
    : payments.filter(p => p.paymentMethod === filter);

  const totalPaid = filteredPayments.reduce((sum, payment) => 
    sum + (payment.paymentAmount || calculateTotal(payment.items)), 0
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#004332] to-[#00664a] text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <button 
            onClick={() => window.location.href = `/order-history?table=${tableNumber}`}
            className="text-white font-semibold flex items-center gap-2 hover:gap-3 transition-all mb-4"
          >
            <i className="fa-solid fa-arrow-left"></i> Orqaga
          </button>
          
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">📜 To'lovlar Tarixi</h1>
              <p className="text-sm opacity-90 mt-1">Stol #{tableNumber}</p>
            </div>
            <div className="text-right bg-white bg-opacity-20 rounded-lg p-3">
              <p className="text-xs opacity-90">Jami to'langan</p>
              <p className="text-2xl font-bold">{totalPaid.toLocaleString()} so'm</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex gap-2 overflow-x-auto">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition ${
              filter === "all"
                ? "bg-[#004332] text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            📋 Hammasi ({payments.length})
          </button>
          <button
            onClick={() => setFilter("online")}
            className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition ${
              filter === "online"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            💳 Online ({payments.filter(p => p.paymentMethod === "online").length})
          </button>
          <button
            onClick={() => setFilter("cash")}
            className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition ${
              filter === "cash"
                ? "bg-green-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            💵 Naqd ({payments.filter(p => p.paymentMethod === "cash").length})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-[#004332] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500">Yuklanmoqda...</p>
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow">
            <div className="text-6xl mb-4">💸</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              To'lovlar yo'q
            </h3>
            <p className="text-gray-500">
              {filter === "all" 
                ? "Hali birorta to'lov amalga oshirilmagan"
                : `${filter === "online" ? "Online" : "Naqd"} to'lovlar yo'q`
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPayments.map((payment) => {
              const amount = payment.paymentAmount || calculateTotal(payment.items);
              
              return (
                <div key={payment.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-4">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-3 pb-3 border-b">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        {formatDate(payment.paidAt)}
                      </p>
                      <p className="font-semibold text-gray-700">
                        Buyurtma #{payment.id.slice(-6)}
                      </p>
                      {payment.paymentId && (
                        <p className="text-xs text-gray-400 font-mono mt-1">
                          ID: {payment.paymentId.slice(-12)}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {getPaymentMethodBadge(payment.paymentMethod)}
                      <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        ✅ To'langan
                      </span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-2 mb-3">
                    {payment.items && payment.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-sm">
                        {item.imageUrl && (
                          <img 
                            src={item.imageUrl} 
                            alt={item.title}
                            className="w-10 h-10 rounded object-cover flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-800 truncate">
                            {item.title}
                            {item.variant && (
                              <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                {item.variant}
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.count} x {item.price.toLocaleString()} so'm
                          </p>
                        </div>
                        <p className="font-semibold text-gray-700 whitespace-nowrap">
                          {(item.count * item.price).toLocaleString()} so'm
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-center pt-3 border-t">
                    <span className="font-bold text-gray-800">Jami to'langan:</span>
                    <span className="text-xl font-bold text-emerald-600">
                      {amount.toLocaleString()} so'm
                    </span>
                  </div>

                  {/* Extra Info */}
                  {payment.confirmedBy && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-xs text-gray-500">
                        <i className="fa-solid fa-user-check mr-1"></i>
                        Tasdiqlagan: {payment.confirmedBy}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Summary */}
        {filteredPayments.length > 0 && (
          <div className="mt-6 bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              📊 Statistika
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-xs text-gray-500 mb-1">Jami to'lovlar</p>
                <p className="text-2xl font-bold text-gray-800">
                  {filteredPayments.length}
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-xs text-gray-500 mb-1">Jami summa</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {totalPaid.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">so'm</p>
              </div>
              
              {filter === "all" && (
                <>
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <p className="text-xs text-blue-600 mb-1 font-semibold">💳 Online</p>
                    <p className="text-lg font-bold text-blue-700">
                      {payments.filter(p => p.paymentMethod === "online").length} ta
                    </p>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <p className="text-xs text-green-600 mb-1 font-semibold">💵 Naqd</p>
                    <p className="text-lg font-bold text-green-700">
                      {payments.filter(p => p.paymentMethod === "cash").length} ta
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;