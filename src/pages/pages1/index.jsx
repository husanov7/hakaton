import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { getTableNumber, navigateWithTable } from "../../utils/navigation";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const tableNumber = getTableNumber();
  const SERVICE_FEE_RATE = 0.05;

  const RESTAURANT_CARD = "5614681215681945";
  const RESTAURANT_NAME = "Fazliddin Gaipov";

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        console.log("🔍 Buyurtmalar yuklanmoqda...");
        
        const allOrdersSnapshot = await getDocs(collection(db, "orders"));
        
        const ordersData = allOrdersSnapshot.docs
          .map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              createdAt: data.createdAt?.toDate() || new Date()
            };
          })
          .filter(order => {
            const orderTable = String(order.table);
            const searchTable = String(tableNumber);
            return orderTable === searchTable;
          });
        
        ordersData.sort((a, b) => b.createdAt - a.createdAt);
        
        setOrders(ordersData);
        console.log("✅ Buyurtmalar yuklandi:", ordersData.length);
      } catch (error) {
        console.error("❌ Buyurtmalarni olishda xato:", error);
      } finally {
        setLoading(false);
      }
    };

    if (tableNumber) {
      fetchOrders();
      
      const interval = setInterval(fetchOrders, 20000);
      return () => clearInterval(interval);
    }
  }, [tableNumber, location.pathname]);

  const copyCardNumber = () => {
    const cardNumber = RESTAURANT_CARD.replace(/\s/g, '');
    navigator.clipboard.writeText(cardNumber).then(() => {
      alert("✅ Karta raqami nusxalandi!");
    }).catch(err => {
      console.error("❌ Nusxalashda xato:", err);
      alert("❌ Nusxalashda xato yuz berdi");
    });
  };

  const getStatusBadge = (status, paymentMethod) => {
    const badges = {
      pending: { 
        text: paymentMethod === "cash" ? "💵 Naqd to'lov" : "⏳ Kutilmoqda", 
        bg: "bg-yellow-500", 
        color: "text-white" 
      },
      unpaid: { 
        text: "💳 To'lov kutilmoqda", 
        bg: "bg-orange-500", 
        color: "text-white" 
      },
      pending_payment: { 
        text: "💵 Naqd to'lov", 
        bg: "bg-yellow-500", 
        color: "text-white" 
      },
      preparing: { 
        text: "👨‍🍳 Tayyorlanmoqda", 
        bg: "bg-blue-500", 
        color: "text-white" 
      },
      ready: { 
        text: "✅ Tayyor", 
        bg: "bg-green-500", 
        color: "text-white" 
      },
      delivered: { 
        text: "🍽️ Yetkazildi", 
        bg: "bg-gray-500", 
        color: "text-white" 
      },
      paid: { 
        text: "💰 To'langan", 
        bg: "bg-emerald-600", 
        color: "text-white" 
      }
    };
    
    const badge = badges[status] || badges.pending;
    
    return (
      <span className={`${badge.bg} ${badge.color} px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-md`}>
        {badge.text}
      </span>
    );
  };

  const formatDate = (date) => {
    if (!date) return "Noma'lum";
    
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Hozir";
    if (minutes < 60) return `${minutes} daqiqa oldin`;
    if (hours < 24) return `${hours} soat oldin`;
    return `${days} kun oldin`;
  };

  // ✅ TO'G'RI HISOBLASH: price + addonsTotal
  const calculateItemTotal = (item) => {
    const basePrice = Number(item.price) || 0;
    const addonsPrice = Number(item.addonsTotal) || 0;
    const count = Number(item.count) || 1;
    return (basePrice + addonsPrice) * count;
  };

  const calculateItemsTotal = (items) => {
    return items.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  };

  const calculateServiceFee = (itemsTotal) => {
    return itemsTotal * SERVICE_FEE_RATE;
  };

  const calculateOrderTotal = (items) => {
    const itemsTotal = calculateItemsTotal(items);
    const serviceFee = calculateServiceFee(itemsTotal);
    return itemsTotal + serviceFee;
  };

  const calculateGrandTotal = () => {
    return orders.reduce((total, order) => {
      return total + calculateOrderTotal(order.items);
    }, 0);
  };

  const calculateTotalServiceFee = () => {
    return orders.reduce((total, order) => {
      const itemsTotal = calculateItemsTotal(order.items);
      return total + calculateServiceFee(itemsTotal);
    }, 0);
  };

  const getTotalItemsCount = () => {
    return orders.reduce((total, order) => {
      const orderItems = order.items.reduce((sum, item) => sum + item.count, 0);
      return total + orderItems;
    }, 0);
  };

  const hasPaidOrders = orders.some(order => order.paymentStatus === "paid");
  const hasOnlinePaymentOrders = orders.some(order => 
    order.paymentMethod === "online" && order.paymentStatus !== "paid"
  );
  const hasCashOrders = orders.some(order => order.paymentMethod === "cash");

  const grandTotal = calculateGrandTotal();
  const totalServiceFee = calculateTotalServiceFee();
  const totalItems = getTotalItemsCount();

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <button 
            onClick={() => navigateWithTable(navigate, '/')}
            className="text-[#004332] font-semibold flex items-center gap-2 hover:gap-3 transition-all mb-3"
          >
            <i className="fa-solid fa-arrow-left"></i> Orqaga
          </button>
          
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#004332]">📋 Buyurtmalar</h1>
              <p className="text-gray-600 text-sm">Stol #{tableNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Jami buyurtmalar</p>
              <p className="text-xl font-bold text-[#004332]">{orders.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="w-16 h-16 border-4 border-[#004332] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500">Yuklanmoqda...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Buyurtmalar yo'q
            </h3>
            <p className="text-gray-500 mb-6">
              Stol #{tableNumber} uchun hali birorta buyurtma yo'q
            </p>
            <button
              onClick={() => navigateWithTable(navigate, '/')}
              className="bg-[#004332] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#003326] transition"
            >
              Menuga o'tish
            </button>
          </div>
        ) : (
          <>
            {/* ✅ UMUMIY HISOB */}
            <div className="bg-gradient-to-br from-[#004332] to-[#00664a] text-white rounded-2xl shadow-2xl p-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">🔥 Umumiy hisob</p>
                  <h2 className="text-3xl sm:text-4xl font-bold mt-1">
                    {grandTotal.toLocaleString()} so'm
                  </h2>
                  <p className="text-xs opacity-75 mt-1">
                    (xizmat haqi: +{totalServiceFee.toLocaleString()} so'm)
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm opacity-90">🍽️ Jami ovqatlar</p>
                  <p className="text-2xl font-bold mt-1">{totalItems} ta</p>
                </div>
              </div>
              
              <div className="mt-4 flex items-center gap-2 text-sm opacity-90">
                <i className="fa-solid fa-receipt"></i>
                <span>{orders.length} ta buyurtma • Stol {tableNumber}</span>
              </div>
            </div>

            {/* Buyurtmalar ro'yxati */}
            <div className="space-y-4 mb-6">
              {orders.map((order) => {
                const itemsTotal = calculateItemsTotal(order.items);
                const serviceFee = calculateServiceFee(itemsTotal);
                const orderTotal = itemsTotal + serviceFee;

                return (
                  <div 
                    key={order.id} 
                    className={`bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition ${
                      order.paymentStatus === 'paid' ? 'border-2 border-emerald-500' : ''
                    }`}
                  >
                    {/* Order Header */}
                    <div className="flex justify-between items-start mb-3 pb-3 border-b flex-wrap gap-2">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          {formatDate(order.createdAt)}
                        </p>
                        <p className="text-sm font-semibold text-gray-700">
                          Buyurtma
                        </p>
                      </div>
                      {getStatusBadge(order.paymentStatus || order.status, order.paymentMethod)}
                    </div>

                    {/* Order Items */}
                    <div className="space-y-3 mb-3">
                      {order.items.map((item, idx) => {
                        const basePrice = Number(item.price) || 0;
                        const addonsPrice = Number(item.addonsTotal) || 0;
                        const unitPrice = basePrice + addonsPrice;
                        const itemTotal = unitPrice * item.count;
                        
                        return (
                          <div key={idx} className="flex items-start gap-3">
                            {item.imageUrl && (
                              <img 
                                src={item.imageUrl} 
                                alt={item.title}
                                className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-800 text-sm break-words">
                                {item.title}
                              </p>
                              
                              {/* ✅ VARIANT KO'RSATISH */}
                              {item.variant && (
                                <div className="mt-1 p-1.5 bg-blue-50 border border-blue-200 rounded">
                                  <p className="text-xs text-blue-700 font-medium break-words">
                                    🎨 {item.variant}
                                  </p>
                                </div>
                              )}
                              
                              {/* ✅ NARX TAFSILOTLARI */}
                              <div className="mt-1 space-y-0.5 text-xs">
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-600">Asosiy:</span>
                                  <span className="font-semibold text-gray-700">
                                    {basePrice.toLocaleString()} so'm
                                  </span>
                                </div>
                                
                                {addonsPrice > 0 && (
                                  <div className="flex items-center gap-2">
                                    <span className="text-blue-600">Qo'shimcha:</span>
                                    <span className="font-semibold text-blue-700">
                                      +{addonsPrice.toLocaleString()} so'm
                                    </span>
                                  </div>
                                )}
                                
                                <div className="flex items-center gap-2 pt-0.5 border-t border-gray-100">
                                  <span className="text-gray-700">Miqdor:</span>
                                  <span className="font-bold text-gray-800">
                                    {item.count} x {unitPrice.toLocaleString()} = {itemTotal.toLocaleString()} so'm
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Kichik hisob */}
                    <div className="pt-3 border-t">
                      <div className="flex justify-between items-center text-xs text-gray-600 mb-1">
                        <span>Ovqatlar:</span>
                        <span>{itemsTotal.toLocaleString()} so'm</span>
                      </div>
                      
                      <div className="flex justify-between items-center text-xs text-gray-600">
                        <span>Xizmat (5%):</span>
                        <span>{serviceFee.toLocaleString()} so'm</span>
                      </div>
                      
                      <div className="flex justify-between items-center mt-2 pt-2 border-t">
                        <span className="font-semibold text-sm text-gray-800">Buyurtma jami:</span>
                        <span className="font-bold text-sm text-[#004332]">
                          {orderTotal.toLocaleString()} so'm
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ✅ TO'LOV MA'LUMOTLARI */}
            <div className="mt-6">
              {/* KARTA ORQALI TO'LOV */}
              {hasOnlinePaymentOrders && (
                <div className="bg-white rounded-xl shadow-lg p-6 mb-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                      <i className="fa-solid fa-credit-card text-white text-xl"></i>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">Karta orqali to'lash</h3>
                      <p className="text-xs text-gray-500">Quyidagi karta raqamiga o'tkazing</p>
                    </div>
                  </div>

                  {/* Karta ma'lumotlari */}
                  <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-6 mb-4 shadow-xl">
                    <div className="flex justify-between items-start mb-8">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-8 bg-yellow-400 rounded opacity-80"></div>
                        <div className="w-8 h-6 bg-yellow-300 rounded opacity-60"></div>
                      </div>
                      <p className="text-white text-xs font-semibold bg-white bg-opacity-20 px-3 py-1 rounded-full">
                        UZCARD
                      </p>
                    </div>
                    
                    <button
                      onClick={copyCardNumber}
                      className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4 w-full mb-4 hover:bg-opacity-30 transition"
                    >
                      <p className="text-white text-2xl sm:text-3xl font-bold tracking-wider mb-2 font-mono">
                        {RESTAURANT_CARD}
                      </p>
                      <div className="flex items-center justify-center gap-2 text-white text-sm">
                        <i className="fa-solid fa-copy"></i>
                        <span>Nusxalash uchun bosing</span>
                      </div>
                    </button>
                    
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-white text-xs opacity-75 mb-1">Karta egasi</p>
                        <p className="text-white font-semibold text-sm">{RESTAURANT_NAME}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white text-xs opacity-75 mb-1">To'lov summasi</p>
                        <p className="text-white font-bold text-xl">{grandTotal.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* To'lov ilovalar */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <span>📱</span>
                      <span className="break-words whitespace-normal">Quyidagi ilovalar orqali to'lashingiz mumkin:</span>
                    </p>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white rounded-lg p-3 border border-gray-200 flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-xs">ALIF</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-700">Alif Mobi</span>
                      </div>
                      
                      <div className="bg-white rounded-lg p-3 border border-gray-200 flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-xs">PAY</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-700">Payme</span>
                      </div>
                      
                      <div className="bg-white rounded-lg p-3 border border-gray-200 flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-xs">CLICK</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-700">Click</span>
                      </div>
                      
                      <div className="bg-white rounded-lg p-3 border border-gray-200 flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-xs">X</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-700">Xazna</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs text-blue-800 leading-relaxed break-words whitespace-normal">
                      <span className="font-bold">💡 Eslatma:</span> To'lovni amalga oshirgandan so'ng, 
                      chekni kassaga ko'rsatishingiz kerak. To'lov tasdiqlanishi 5-10 daqiqa vaqt olishi mumkin.
                    </p>
                  </div>
                </div>
              )}

              {/* NAQD TO'LOV */}
              {hasCashOrders && !hasOnlinePaymentOrders && !hasPaidOrders && (
                <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6 shadow-md">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center flex-shrink-0">
                      <i className="fa-solid fa-money-bill-wave text-yellow-900 text-xl"></i>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-yellow-900 mb-1">
                        Naqd to'lov buyurtmasi
                      </p>
                      <p className="text-xs text-yellow-800 break-words whitespace-normal">
                        Buyurtma tayyor bo'lgandan so'ng kassaga kelib to'lov qilasiz. 
                        To'lov summasi: <span className="font-bold">{grandTotal.toLocaleString()} so'm</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TO'LANGAN */}
              {hasPaidOrders && !hasOnlinePaymentOrders && (
                <div className="bg-green-50 border-2 border-green-300 rounded-xl p-6 shadow-md">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <i className="fa-solid fa-check text-white text-2xl"></i>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-green-900 mb-1">
                        Barcha to'lovlar amalga oshirilgan
                      </p>
                      <p className="text-xs text-green-800">
                        Buyurtmalaringiz tayyorlanmoqda. Yaxshi ishtaha! 🍽️
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;