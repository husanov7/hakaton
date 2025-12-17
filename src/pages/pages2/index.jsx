import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOrderStore } from "../../utils/zustand";
import { useTranslation } from "react-i18next";
import { sendOrder } from "../../firebase/firebase";

const Cart = () => {
  const { order, clearOrder, incrementItem, decrementItem, removeItem } = useOrderStore();
  const { t } = useTranslation("base");
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  
  const getTableNumber = () => {
    const params = new URLSearchParams(window.location.search);
    const tableFromUrl = params.get("table");
    
    if (tableFromUrl) {
      localStorage.setItem("tableNumber", String(tableFromUrl));
      return String(tableFromUrl);
    }
    
    const tableFromStorage = localStorage.getItem("tableNumber") || "1";
    return String(tableFromStorage);
  };

  const all = order.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.count),
    0
  );

  const serviceFee = 0.05;
  const serviceCharge = all * serviceFee;
  const totalAmount = all + serviceCharge;

  // ✅ ONLINE TO'LOV (Click.uz yoki Payme)
  const handleOnlinePayment = async () => {
    const tableNumber = getTableNumber();
    const orderId = `ORDER_${Date.now()}`;
    
    try {
      // 1. Buyurtmani Firebase'ga saqlash
      const formattedOrder = order.map((i) => ({
        id: i.id || "no-id",
        dishId: i.dishId || i.id,
        title: i.title || "No title",
        variant: i.variant || null,
        variantId: i.variantId || null,
        price: Number(i.price) || 0,
        count: i.count || 1,
        imageUrl: i.imageUrl || "",
      }));

      await sendOrder(
        tableNumber, 
        formattedOrder, 
        "pending_payment",
        totalAmount,
        orderId
      );

      // 2. Backend'ga to'lov so'rovini yuborish
      const response = await fetch('YOUR_BACKEND_URL/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          items: formattedOrder,
          totalAmount,
          tableNumber,
          paymentMethod: 'online'
        })
      });

      const data = await response.json();

      if (data.success) {
        // 3. Click.uz yoki Payme checkout'ga yo'naltirish
        window.location.href = data.paymentUrl;
      } else {
        throw new Error(data.message || 'Payment failed');
      }

    } catch (error) {
      console.error("❌ Online to'lovda xato:", error);
      alert("❌ To'lov tizimiga ulanishda xatolik: " + error.message);
      setIsLoading(false);
    }
  };

  const placeOrder = async () => {
    const tableNumber = getTableNumber();
    console.log("📤 Buyurtma berilmoqda...");
    console.log("📍 Stol raqami:", tableNumber);
    console.log("🛒 Ovqatlar soni:", order.length);
    
    setIsLoading(true);

    const formattedOrder = order.map((i) => ({
      id: i.id || "no-id",
      dishId: i.dishId || i.id,
      title: i.title || "No title",
      variant: i.variant || null,
      variantId: i.variantId || null,
      price: Number(i.price) || 0,
      count: i.count || 1,
      imageUrl: i.imageUrl || "",
    }));

    console.log("📦 Yuborilayotgan buyurtma:", formattedOrder);

    try {
      // ✅ ONLINE TO'LOV TANLANGAN BO'LSA
      if (paymentMethod === "online") {
        await handleOnlinePayment();
        return; // Payment gateway'ga yo'naltiriladi
      }

      // ✅ NAQD PUL (ESKI VARIANT)
      const orderId = await sendOrder(
        tableNumber, 
        formattedOrder, 
        "unpaid",
        totalAmount
      );
      
      console.log("✅ Buyurtma yuborildi! ID:", orderId);
      
      clearOrder();
      setShowModal(true);
      setIsLoading(false);
      
      setTimeout(() => {
        navigate(`/?table=${tableNumber}`);
      }, 2500);
    } catch (error) {
      console.error("❌ Buyurtma yuborishda xato:", error);
      setIsLoading(false);
      alert("❌ Buyurtma yuborishda xatolik: " + error.message);
    }
  };

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-gray-50 pb-32">
      <button 
        onClick={() => navigate(-1)}
        className="mb-4 text-[#004332] font-semibold flex items-center gap-2 hover:gap-3 transition-all"
      >
        <i className="fa-solid fa-arrow-left"></i> Orqaga
      </button>

      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          {t("korzina", "🛒 Korzina")}
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          📍 Stol #{getTableNumber()}
        </p>
      </div>

      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-4 sm:p-6">
        {order.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛒</div>
            <p className="text-gray-500 text-lg mb-4">Savatcha bo'sh</p>
            <button
              onClick={() => navigate("/")}
              className="bg-[#004332] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#003326] transition"
            >
              Menuga qaytish
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {order.map((dish) => (
                <div 
                  key={dish.id} 
                  className="flex items-start gap-3 pb-4 border-b border-gray-200 last:border-0"
                >
                  {dish.imageUrl && (
                    <img
                      src={dish.imageUrl}
                      alt={dish.title}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover flex-shrink-0"
                    />
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 break-words mb-1">
                      {dish.title}
                      
                      {dish.variant && (
                        <span className="ml-2 text-sm bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                          🎨 {dish.variant}
                        </span>
                      )}
                    </h3>
                    
                    <p className="text-sm sm:text-base text-gray-600 font-medium mb-3">
                      {Number(dish.price).toLocaleString()} so'm
                      
                      {dish.count > 1 && (
                        <span className="text-[#004332] font-bold ml-2">
                          = {(dish.count * dish.price).toLocaleString()} so'm
                        </span>
                      )}
                    </p>
                    
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                        <button
                          onClick={() => decrementItem(dish.id)}
                          className="bg-white hover:bg-gray-100 text-gray-800 w-8 h-8 rounded-md font-bold transition shadow-sm"
                        >
                          −
                        </button>
                        
                        <span className="text-base sm:text-lg font-semibold min-w-[40px] text-center">
                          {dish.count}
                        </span>
                        
                        <button
                          onClick={() => incrementItem(dish.id)}
                          className="bg-white hover:bg-gray-100 text-gray-800 w-8 h-8 rounded-md font-bold transition shadow-sm"
                        >
                          +
                        </button>
                      </div>
                      
                      <button
                        onClick={() => removeItem(dish.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg transition text-sm font-medium"
                      >
                        🗑 O'chirish
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ✅ TO'LOV USULINI TANLASH - YANGILANGAN */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-3 text-base sm:text-lg">
                💳 To'lov usuli:
              </h3>
              
              <div className="space-y-3">
                {/* Naqd pul */}
                <label 
                  className="flex items-center gap-3 p-3 bg-white rounded-lg border-2 cursor-pointer transition hover:border-[#004332]"
                  style={{ borderColor: paymentMethod === "cash" ? "#004332" : "#e5e7eb" }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cash"
                    checked={paymentMethod === "cash"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 accent-[#004332]"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">💵 Naqd pul</p>
                    <p className="text-sm text-gray-500">Ofitsiantga to'lov</p>
                  </div>
                </label>

                {/* ✅ ONLINE TO'LOV (Click.uz / Payme) */}
                <label 
                  className="flex items-center gap-3 p-3 bg-white rounded-lg border-2 cursor-pointer transition hover:border-[#004332]"
                  style={{ borderColor: paymentMethod === "online" ? "#004332" : "#e5e7eb" }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="online"
                    checked={paymentMethod === "online"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 accent-[#004332]"
                  />
                  <div className="flex-1 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-800">💳 Online to'lov</p>
                      <p className="text-sm text-gray-500">Karta orqali (Click / Payme)</p>
                    </div>
                    <div className="flex gap-2">
                      <div className="text-2xl">💳</div>
                    </div>
                  </div>
                </label>
              </div>

              {/* ✅ ONLINE TO'LOV MA'LUMOTI */}
              {paymentMethod === "online" && (
                <div className="mt-4 p-3 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800 mb-2">
                    📌 <strong>Online to'lov:</strong>
                  </p>
                  <ol className="text-xs text-blue-700 space-y-1 ml-4 list-decimal">
                    <li>Xavfsiz to'lov sahifasiga o'tasiz</li>
                    <li>Karta ma'lumotlarini kiritasiz</li>
                    <li>SMS kod orqali tasdiqlaсiz</li>
                    <li>To'lov muvaffaqiyatli amalga oshiriladi ✅</li>
                    <li>Buyurtma darhol oshxonaga yuboriladi 🍽️</li>
                  </ol>
                  
                  <div className="mt-3 flex items-center gap-2 text-xs text-gray-600">
                    <span className="text-green-600">🔒</span>
                    <span>SSL shifrlangan xavfsiz to'lov</span>
                  </div>
                  
                  {/* To'lov tizimlari logotiplari */}
                  <div className="mt-3 pt-3 border-t border-blue-200 flex items-center gap-3 flex-wrap">
                    <span className="text-xs text-gray-600">Qo'llab-quvvatlanadi:</span>
                    <div className="flex gap-2 items-center">
                      <span className="text-xs bg-white px-2 py-1 rounded border">Click</span>
                      <span className="text-xs bg-white px-2 py-1 rounded border">Payme</span>
                      <span className="text-xs bg-white px-2 py-1 rounded border">💳 Visa</span>
                      <span className="text-xs bg-white px-2 py-1 rounded border">💳 Uzcard</span>
                      <span className="text-xs bg-white px-2 py-1 rounded border">💳 Humo</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* BUYURTMA XULOSASI */}
            <div className="mb-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                📋 Buyurtma xulosasi
              </h3>
              
              <div className="space-y-2 text-sm">
                {order.map((item, index) => (
                  <div key={item.id} className="flex justify-between items-start">
                    <div className="flex-1">
                      <span className="text-gray-700">
                        {index + 1}. {item.title}
                        {item.variant && (
                          <span className="text-blue-600 font-medium ml-1">
                            ({item.variant})
                          </span>
                        )}
                      </span>
                    </div>
                    <span className="text-gray-600 ml-2 whitespace-nowrap">
                      {item.count} x {item.price.toLocaleString()} so'm
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* JAMI HISOB */}
            <div className="border-t-2 border-gray-200 pt-4 space-y-2">
              <div className="flex justify-between text-gray-700">
                <span className="text-sm sm:text-base">{t("price", "Narx")}:</span>
                <span className="font-semibold text-sm sm:text-base">
                  {all.toLocaleString()} so'm
                </span>
              </div>
              
              <div className="flex justify-between text-gray-700">
                <span className="text-sm sm:text-base">{t("service", "Xizmat haqi")} (5%):</span>
                <span className="font-semibold text-sm sm:text-base">
                  {serviceCharge.toLocaleString()} so'm
                </span>
              </div>
              
              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                <span className="text-base sm:text-lg font-bold text-gray-800">
                  {t("total", "Jami")}:
                </span>
                <span className="text-lg sm:text-xl font-bold text-[#004332]">
                  {totalAmount.toLocaleString()} so'm
                </span>
              </div>

              {/* ✅ BUYURTMA BERISH TUGMASI - YANGILANGAN */}
              <button
                onClick={placeOrder}
                disabled={isLoading}
                className="w-full bg-[#004332] hover:bg-[#003326] text-white py-3 sm:py-4 rounded-lg font-semibold transition mt-4 disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-lg"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Yuklanmoqda...
                  </span>
                ) : paymentMethod === "online" ? (
                  "💳 Online to'lash"
                ) : (
                  t("order_button", "✅ Buyurtma berish")
                )}
              </button>
            </div>
          </>
        )}
      </div>

      {/* SUCCESS MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-sm w-full text-center animate-scale-in shadow-2xl">
            <div className="mb-6">
              <div className="w-20 h-20 bg-[#004332] rounded-full flex items-center justify-center mx-auto animate-bounce">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-[#004332] mb-2">
              Buyurtma yuborildi!
            </h3>
            <p className="text-gray-600 mb-4 text-sm sm:text-base">
              Tez orada tayyorlanadi
            </p>

            <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
              <div className="bg-[#004332] h-full rounded-full animate-progress-bar"></div>
            </div>
            
            <p className="text-xs sm:text-sm text-gray-500 mt-3">
              Bosh sahifaga o'tilmoqda...
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scale-in {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes progress-bar {
          from { width: 0%; }
          to { width: 100%; }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.4s ease-out;
        }

        .animate-progress-bar {
          animation: progress-bar 2.5s linear;
        }
      `}</style>
    </div>
  );
};

export default Cart;