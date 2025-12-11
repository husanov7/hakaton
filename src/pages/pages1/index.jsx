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

  // ✅ XIZMAT HAQI (2%)
  const SERVICE_FEE_RATE = 0.02;

  // Buyurtmalarni olish
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

  const getStatusBadge = (status) => {
    const badges = {
      pending: { text: "⏳ Kutilmoqda", bg: "bg-yellow-500", color: "text-white" },
      preparing: { text: "👨‍🍳 Tayyorlanmoqda", bg: "bg-blue-500", color: "text-white" },
      ready: { text: "✅ Tayyor", bg: "bg-green-500", color: "text-white" },
      delivered: { text: "🍽️ Yetkazildi", bg: "bg-gray-500", color: "text-white" }
    };
    
    const badge = badges[status] || badges.pending;
    
    return (
      <span className={`${badge.bg} ${badge.color} px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse`}>
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

  // ✅ Bitta buyurtma uchun ovqatlar narxi
  const calculateItemsTotal = (items) => {
    return items.reduce((sum, item) => sum + (item.price * item.count), 0);
  };

  // ✅ Bitta buyurtma uchun xizmat haqi
  const calculateServiceFee = (itemsTotal) => {
    return itemsTotal * SERVICE_FEE_RATE;
  };

  // ✅ Bitta buyurtma uchun JAMI (ovqat + xizmat)
  const calculateOrderTotal = (items) => {
    const itemsTotal = calculateItemsTotal(items);
    const serviceFee = calculateServiceFee(itemsTotal);
    return itemsTotal + serviceFee;
  };

  // ✅ BARCHA BUYURTMALAR UCHUN UMUMIY HISOB
  const calculateGrandTotal = () => {
    return orders.reduce((total, order) => {
      return total + calculateOrderTotal(order.items);
    }, 0);
  };

  // ✅ BARCHA BUYURTMALAR UCHUN JAMI XIZMAT HAQI
  const calculateTotalServiceFee = () => {
    return orders.reduce((total, order) => {
      const itemsTotal = calculateItemsTotal(order.items);
      return total + calculateServiceFee(itemsTotal);
    }, 0);
  };

  // ✅ JAMI OVQATLAR NARXI (xizmat haqi siz)
  const calculateTotalItemsPrice = () => {
    return orders.reduce((total, order) => {
      return total + calculateItemsTotal(order.items);
    }, 0);
  };

  // ✅ JAMI OVQATLAR SONI
  const getTotalItemsCount = () => {
    return orders.reduce((total, order) => {
      const orderItems = order.items.reduce((sum, item) => sum + item.count, 0);
      return total + orderItems;
    }, 0);
  };

  const grandTotal = calculateGrandTotal();
  const totalServiceFee = calculateTotalServiceFee();
  const totalItemsPrice = calculateTotalItemsPrice();
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
            {/* ✅ UMUMIY HISOB KARTASI */}
            <div className="bg-gradient-to-br from-[#004332] to-[#00664a] text-white rounded-2xl shadow-2xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm opacity-90">💰 Umumiy hisob</p>
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
              
              <div className="flex items-center gap-2 text-sm opacity-90">
                <i className="fa-solid fa-info-circle"></i>
                <span>
                  {orders.length} ta buyurtma • Stol #{tableNumber}
                </span>
              </div>
            </div>

            {/* Buyurtmalar ro'yxati */}
            <div className="space-y-4">
              {orders.map((order) => {
                const itemsTotal = calculateItemsTotal(order.items);
                const serviceFee = calculateServiceFee(itemsTotal);
                const orderTotal = itemsTotal + serviceFee;

                return (
                  <div 
                    key={order.id} 
                    className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition"
                  >
                    {/* Order Header */}
                    <div className="flex justify-between items-start mb-3 pb-3 border-b flex-wrap gap-2">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          {formatDate(order.createdAt)}
                        </p>
                        <p className="text-sm font-semibold text-gray-700">
                          Buyurtma #{order.id.slice(-6)}
                        </p>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>

                    {/* Order Items */}
                    <div className="space-y-3 mb-3">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          {item.imageUrl && (
                            <img 
                              src={item.imageUrl} 
                              alt={item.title}
                              className="w-16 h-16 sm:w-12 sm:h-12 rounded-lg object-cover flex-shrink-0"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-800 text-sm break-words">
                              {item.title}
                              {/* ✅ Variant nomini ko'rsatish */}
                              {item.variant && (
                                <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                  🎨 {item.variant}
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {item.count} x {item.price.toLocaleString()} so'm
                            </p>
                          </div>
                          <p className="font-semibold text-gray-700 text-sm sm:text-base whitespace-nowrap">
                            {(item.count * item.price).toLocaleString()} so'm
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* ✅ Order Total WITH SERVICE FEE */}
                    <div className="pt-3 border-t space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Ovqatlar narxi:</span>
                        <span className="font-semibold text-gray-700">
                          {itemsTotal.toLocaleString()} so'm
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Xizmat haqi (2%):</span>
                        <span className="font-semibold text-gray-700">
                          {serviceFee.toLocaleString()} so'm
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center pt-2 border-t">
                        <span className="font-bold text-gray-800">Buyurtma jami:</span>
                        <span className="text-lg font-bold text-[#004332]">
                          {orderTotal.toLocaleString()} so'm
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ✅ PASTDA HAM UMUMIY HISOB */}
            <div className="mt-6 bg-white rounded-xl shadow-lg p-6 border-t-4 border-[#004332]">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-gray-600 text-sm">📊 Umumiy statistika</p>
                  <p className="text-gray-500 text-xs mt-1">
                    {orders.length} ta buyurtma • {totalItems} ta ovqat
                  </p>
                </div>
                <button
                  onClick={() => navigateWithTable(navigate, '/')}
                  className="text-[#004332] font-semibold text-sm hover:underline"
                >
                  Yangi buyurtma →
                </button>
              </div>
              
              {/* ✅ UMUMIY HISOB DETALLARI */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center text-gray-700">
                  <span>Ovqatlar narxi:</span>
                  <span className="font-semibold">
                    {totalItemsPrice.toLocaleString()} so'm
                  </span>
                </div>
                
                <div className="flex justify-between items-center text-gray-700">
                  <span>Xizmat haqi (2%):</span>
                  <span className="font-semibold">
                    {totalServiceFee.toLocaleString()} so'm
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t">
                <span className="text-xl font-bold text-gray-800">
                  💰 To'liq hisob:
                </span>
                <span className="text-2xl font-bold text-[#004332]">
                  {grandTotal.toLocaleString()} so'm
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;