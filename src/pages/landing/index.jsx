// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Card from "../../components/card/card";
// import { useOrderStore } from "../../utils/zustand";
// import { fetchMenu } from "../../firebase/firebase";
// import { useTranslation } from "react-i18next";
// import { getTableNumber, navigateWithTable } from "../../utils/navigation";
// import { callWaiter } from "../../services/waiterService";
// import RateWaiterModal from "../../components/RateWaiterModal";
// import "./style.scss";

// export default function Home() {
//   const [menu, setMenu] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [tableNumber, setTableNumber] = useState(null);
//   const [selectedCategory, setSelectedCategory] = useState("all");
//   const [showLangMenu, setShowLangMenu] = useState(false);
//   const [callingWaiter, setCallingWaiter] = useState(false);
//   const [lastCallTime, setLastCallTime] = useState(null);
//   const [showRatingModal, setShowRatingModal] = useState(false);
//   const [assignedWaiter, setAssignedWaiter] = useState(null);
  
//   const { order } = useOrderStore();
//   const navigate = useNavigate();
//   const { t, i18n } = useTranslation("menu");

//   const safeOrder = Array.isArray(order) ? order : [];

//   const languages = [
//     { code: "uz", name: "O'zbek", flag: "🇺🇿" },
//     { code: "ru", name: "Русский", flag: "🇷🇺" },
//     { code: "en", name: "English", flag: "🇬🇧" },
//   ];

//   const currentLang = languages.find(lang => lang.code === i18n.language) || languages[0];

//   const changeLanguage = (langCode) => {
//     i18n.changeLanguage(langCode);
//     setShowLangMenu(false);
//   };

//   const categories = [
//     { id: "all", name: t("all", "Hammasi"), icon: "🍽️" },
//     { id: "ovqatlar", name: t("ovqatlar", "Ovqatlar"), icon: "🍲" },
//     { id: "nonlar", name: t("nonlar", "Nonlar"), icon: "🍞" },
//     { id: "ichimliklar", name: t("ichimliklar", "Ichimliklar"), icon: "🥤" },
//     { id: "setlar", name: t("setlar", "Setlar"), icon: "🎁" },
//     { id: "desert", name: t("desert", "Desertlar"), icon: "🍰" },
//     { id: "salatlar", name: t("salatlar", "Salatlar"), icon: "🥗" },
//   ];

//   useEffect(() => {
//     const table = getTableNumber();
//     setTableNumber(table);
//   }, []);

//   useEffect(() => {
//     const getMenu = async () => {
//       setLoading(true);
//       try {
//         const data = await fetchMenu();
//         console.log("🍽️ Menyu yuklandi:", data.length, "ta ovqat");
//         setMenu(data);
//       } catch (err) {
//         console.error("❌ Menyu olishda xato:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     getMenu();
//   }, []);

//   const filteredMenu = selectedCategory === "all"
//     ? menu
//     : menu.filter(dish => dish.category === selectedCategory);

//   const totalPrice = safeOrder.reduce(
//     (sum, item) => sum + Number(item.price) * Number(item.count),
//     0
//   );

//   const totalItems = safeOrder.reduce((sum, item) => sum + Number(item.count), 0);

//   const goToCart = () => navigateWithTable(navigate, '/pages2');
//   const goToOrderHistory = () => navigateWithTable(navigate, '/pages1');
//   const goToHome = () => navigateWithTable(navigate, '/');

//   // ✅ OFITSIANT CHAQIRISH
//   const handleCallWaiter = async () => {
//     if (lastCallTime && Date.now() - lastCallTime < 60000) {
//       const remainingSeconds = Math.ceil((60000 - (Date.now() - lastCallTime)) / 1000);
//       alert(`⏳ Iltimos, ${remainingSeconds} soniya kuting!`);
//       return;
//     }

//     if (!tableNumber) {
//       alert("❌ Stol raqami topilmadi!");
//       return;
//     }

//     setCallingWaiter(true);
    
//     try {
//       const result = await callWaiter(tableNumber);
      
//       setLastCallTime(Date.now());
//       setAssignedWaiter({
//         id: result.waiterId,
//         name: result.waiterName,
//         phone: result.waiterPhone
//       });
      
//       alert(`✅ Ofitsiant ${result.waiterName} chaqirildi!\n\n📞 Telefon: ${result.waiterPhone || ''}\n⏰ Tez orada sizga keladi.`);
      
//       setTimeout(() => setCallingWaiter(false), 3000);
      
//     } catch (error) {
//       alert(`❌ ${error.message}`);
//       setCallingWaiter(false);
//     }
//   };

//   // ✅ BAHOLASH MODAL OCHISH
//   const handleOpenRating = () => {
//     if (!assignedWaiter) {
//       alert("❌ Avval ofitsiantni chaqiring!");
//       return;
//     }
//     setShowRatingModal(true);
//   };

//   // ✅ MODAL YOPILGANDA (Baholash tugmasi yo'qoladi)
//   const handleCloseRating = () => {
//     setShowRatingModal(false);
//     // Baholash yuborilgandan keyin tugma yo'qolsin
//     // setAssignedWaiter(null); // Bu qatorni ochish kerak bo'lsa
//   };

//   return (
//     <div className="home bg-gray-50 min-h-screen">
//       {/* HEADER + CATEGORIES */}
//       <div className="bg-white shadow-sm sticky top-0 z-20">
//         <div className="pt-4 px-4 sm:px-6 pb-3">
//           <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
//             <div 
//               className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition"
//               onClick={goToHome}
//             >
//               <div className="w-10 h-10 bg-gradient-to-br from-[#004332] to-[#00664a] rounded-lg flex items-center justify-center">
//                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
//                   <rect x="3" y="3" width="7" height="7" fill="white" rx="1"/>
//                   <rect x="14" y="3" width="7" height="7" fill="white" rx="1"/>
//                   <rect x="3" y="14" width="7" height="7" fill="white" rx="1"/>
//                   <rect x="14" y="14" width="3" height="3" fill="white" rx="0.5"/>
//                   <rect x="18" y="14" width="3" height="3" fill="white" rx="0.5"/>
//                   <rect x="14" y="18" width="3" height="3" fill="white" rx="0.5"/>
//                   <circle cx="18.5" cy="18.5" r="2.5" fill="white"/>
//                 </svg>
//               </div>
//               <span className="text-lg sm:text-xl font-bold text-[#004332]">Scannova</span>
//             </div>

//             <div className="flex items-center gap-2 sm:gap-3">
//               {/* OFITSIANT CHAQIRISH */}
//               {tableNumber && (
//                 <button
//                   onClick={handleCallWaiter}
//                   disabled={callingWaiter}
//                   className={`flex items-center gap-2 px-3 py-2 rounded-lg font-semibold transition text-sm ${
//                     callingWaiter
//                       ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                       : "bg-[#004332] text-white hover:bg-[#003326]"
//                   }`}
//                 >
//                   {callingWaiter ? (
//                     <>
//                       <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                       <span className="hidden sm:inline">{t("calling", "Chaqirilmoqda...")}</span>
//                     </>
//                   ) : (
//                     <>
//                       <span className="text-lg">👨‍🍳</span>
//                       <span className="hidden sm:inline">{t("waiter", "Ofitsiant")}</span>
//                     </>
//                   )}
//                 </button>
//               )}
              
//               <div className="relative">
//                 <button
//                   onClick={() => setShowLangMenu(!showLangMenu)}
//                   className="flex items-center gap-2 bg-white border border-gray-300 px-2 sm:px-3 py-2 rounded-lg hover:bg-gray-50 transition"
//                 >
//                   <span className="text-xl">{currentLang.flag}</span>
//                   <span className="hidden sm:inline font-semibold text-gray-700 text-sm">
//                     {currentLang.code.toUpperCase()}
//                   </span>
//                 </button>

//                 {showLangMenu && (
//                   <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border z-30">
//                     {languages.map((lang) => (
//                       <button
//                         key={lang.code}
//                         onClick={() => changeLanguage(lang.code)}
//                         className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 transition first:rounded-t-lg last:rounded-b-lg ${
//                           i18n.language === lang.code ? "bg-[#004332] text-white" : "text-gray-700"
//                         }`}
//                       >
//                         <span className="text-2xl">{lang.flag}</span>
//                         <span className="font-medium">{lang.name}</span>
//                         {i18n.language === lang.code && <span className="ml-auto">✓</span>}
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               <button
//                 onClick={goToOrderHistory}
//                 className="bg-[#004332] text-white px-3 sm:px-4 py-2 rounded-lg font-semibold hover:bg-[#003326] transition flex items-center gap-2 text-sm"
//               >
//                 📋 <span className="hidden sm:inline">{t("orders", "Buyurtmalar")}</span>
//               </button>
//             </div>
//           </div>

//           <p className="text-gray-600 text-sm sm:text-base">
//             🪑 {t("table_number", "Stol raqami")}:{" "}
//             <span className="font-semibold text-gray-800">{tableNumber}</span>
//           </p>
//         </div>

//         {/* Categories */}
//         <div className="px-4 overflow-x-auto scrollbar-hide pb-3 border-t border-gray-100">
//           <div className="flex gap-2 pt-3 min-w-max">
//             {categories.map((cat) => (
//               <button
//                 key={cat.id}
//                 onClick={() => setSelectedCategory(cat.id)}
//                 className={`px-3 sm:px-4 py-2 rounded-full font-semibold transition-all text-sm whitespace-nowrap ${
//                   selectedCategory === cat.id
//                     ? "bg-[#004332] text-white shadow-lg scale-105"
//                     : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
//                 }`}
//               >
//                 {cat.icon} {cat.name}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* MENU LIST */}
//       <div className="px-4 sm:px-6 pb-24 pt-4">
//         {loading ? (
//           <div className="flex justify-center items-center h-64">
//             <div className="text-center">
//               <div className="w-16 h-16 border-4 border-[#004332] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//               <p className="text-gray-500 text-lg">Yuklanmoqda...</p>
//             </div>
//           </div>
//         ) : filteredMenu.length > 0 ? (
//           <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
//             {filteredMenu.map((dish) => (
//               <Card key={dish.id} dish={dish} />
//             ))}
//           </div>
//         ) : (
//           <div className="text-center text-gray-500 mt-10">
//             <div className="text-6xl mb-4">🔍</div>
//             <p className="text-xl font-semibold mb-2">{t("no_dishes", "Bu kategoriyada ovqat yo'q")}</p>
//             <button
//               onClick={() => setSelectedCategory("all")}
//               className="text-[#004332] font-semibold hover:underline"
//             >
//               {t("view_all", "Barcha ovqatlarni ko'rish")}
//             </button>
//           </div>
//         )}
//       </div>

//       {/* ⭐ BAHOLASH TUGMASI - Ofitsiant chaqirilgandan keyin */}
//       {assignedWaiter && (
//         <div 
//           className="fixed left-0 right-0 px-4"
//           style={{ 
//             bottom: safeOrder.length > 0 ? "90px" : "10px", 
//             zIndex: 9998 
//           }}
//         >
//           <div className="max-w-7xl mx-auto">
//             <button
//               onClick={handleOpenRating}
//               className="w-full py-3 rounded-xl font-bold text-sm bg-white border-2 border-[#004332] text-[#004332] hover:bg-[#004332] hover:text-white transition-all shadow-lg"
//             >
//               ⭐ {t("rate_waiter", "Ofitsiantni baholash")}
//             </button>
//           </div>
//         </div>
//       )}

//       {/* ⭐ BAHOLASH MODAL */}
//       <RateWaiterModal
//         isOpen={showRatingModal}
//         onClose={handleCloseRating}
//         waiter={assignedWaiter}
//         tableNumber={tableNumber}
//       />

//       {/* CART SUMMARY */}
//       {safeOrder.length > 0 && (
//         <div
//           className="fixed left-0 right-0 bg-gradient-to-r from-[#004332] to-[#00664a] shadow-2xl px-4 py-3"
//           style={{ bottom: "80px", zIndex: 9999 }}
//         >
//           <div className="max-w-7xl mx-auto flex justify-between items-center gap-3">
//             <div className="text-white">
//               <p className="text-xs opacity-90">{totalItems} {t("items", "ta ovqat")}</p>
//               <p className="font-bold text-base sm:text-lg">{totalPrice.toLocaleString()} {t("currency", "so'm")}</p>
//             </div>
//             <button
//               onClick={goToCart}
//               className="bg-white text-[#004332] px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg text-sm whitespace-nowrap"
//             >
//               🛒 {t("cart", "Korzinka")}
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/card/card";
import { useOrderStore } from "../../utils/zustand";
import { fetchMenu } from "../../firebase/firebase";
import { useTranslation } from "react-i18next";
import { getTableNumber, navigateWithTable } from "../../utils/navigation";
import { callWaiter } from "../../services/waiterService";
import RateWaiterModal from "../../components/RateWaiterModal";
import "./style.scss";

export default function Home() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tableNumber, setTableNumber] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [callingWaiter, setCallingWaiter] = useState(false);
  const [lastCallTime, setLastCallTime] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [assignedWaiter, setAssignedWaiter] = useState(null);
  
  const { order } = useOrderStore();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("menu");

  const safeOrder = Array.isArray(order) ? order : [];

  const languages = [
    { code: "uz", name: "O'zbek", flag: "🇺🇿" },
    { code: "ru", name: "Русский", flag: "🇷🇺" },
    { code: "en", name: "English", flag: "🇬🇧" },
  ];

  const currentLang = languages.find(lang => lang.code === i18n.language) || languages[0];

  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
    setShowLangMenu(false);
  };

  const categories = [
    { id: "all", name: t("all", "Hammasi"), icon: "🍽️" },
    { id: "ovqatlar", name: t("ovqatlar", "Ovqatlar"), icon: "🍲" },
    { id: "nonlar", name: t("nonlar", "Nonlar"), icon: "🍞" },
    { id: "ichimliklar", name: t("ichimliklar", "Ichimliklar"), icon: "🥤" },
    { id: "setlar", name: t("setlar", "Setlar"), icon: "🎁" },
    { id: "desert", name: t("desert", "Desertlar"), icon: "🍰" },
    { id: "salatlar", name: t("salatlar", "Salatlar"), icon: "🥗" },
  ];

  useEffect(() => {
    const table = getTableNumber();
    setTableNumber(table);
  }, []);

  useEffect(() => {
    const getMenu = async () => {
      setLoading(true);
      try {
        const data = await fetchMenu();
        console.log("🍽️ Menyu yuklandi:", data.length, "ta ovqat");
        setMenu(data);
      } catch (err) {
        console.error("❌ Menyu olishda xato:", err);
      } finally {
        setLoading(false);
      }
    };
    getMenu();
  }, []);

  const filteredMenu = selectedCategory === "all"
    ? menu
    : menu.filter(dish => dish.category === selectedCategory);

  const totalPrice = safeOrder.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.count),
    0
  );

  const totalItems = safeOrder.reduce((sum, item) => sum + Number(item.count), 0);

  const goToCart = () => navigateWithTable(navigate, '/pages2');
  const goToOrderHistory = () => navigateWithTable(navigate, '/pages1');
  const goToHome = () => navigateWithTable(navigate, '/');

  // ✅ OFITSIANT CHAQIRISH
  const handleCallWaiter = async () => {
    if (lastCallTime && Date.now() - lastCallTime < 60000) {
      const remainingSeconds = Math.ceil((60000 - (Date.now() - lastCallTime)) / 1000);
      alert(`⏳ Iltimos, ${remainingSeconds} soniya kuting!`);
      return;
    }

    if (!tableNumber) {
      alert("❌ Stol raqami topilmadi!");
      return;
    }

    setCallingWaiter(true);
    
    try {
      const result = await callWaiter(tableNumber);
      
      setLastCallTime(Date.now());
      setAssignedWaiter({
        id: result.waiterId,
        name: result.waiterName,
        phone: result.waiterPhone
      });
      
      alert(`✅ Ofitsiant ${result.waiterName} chaqirildi!\n\n📞 Telefon: ${result.waiterPhone || ''}\n⏰ Tez orada sizga keladi.`);
      
      setTimeout(() => setCallingWaiter(false), 3000);
      
    } catch (error) {
      alert(`❌ ${error.message}`);
      setCallingWaiter(false);
    }
  };

  // ✅ MODAL YOPILGANDA (Baholash yuborilgandan keyin tugma yo'qoladi)
  const handleCloseRating = (submitted = false) => {
    setShowRatingModal(false);
    
    // Agar baho yuborilgan bo'lsa, tugmani butunlay olib tashlash
    if (submitted) {
      setAssignedWaiter(null);
    }
  };
// ⭐ BAHOLASH MODALNI OCHISH
const handleOpenRating = () => {
  if (!assignedWaiter) {
    alert("❌ Avval ofitsiantni chaqiring!");
    return;
  }
  setShowRatingModal(true);
};

  return (
    <div className="home bg-gray-50 min-h-screen">
      {/* HEADER + CATEGORIES */}
      <div className="bg-white shadow-sm sticky top-0 z-20">
        <div className="pt-4 px-4 sm:px-6 pb-3">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div 
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition"
              onClick={goToHome}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-[#004332] to-[#00664a] rounded-lg flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="7" height="7" fill="white" rx="1"/>
                  <rect x="14" y="3" width="7" height="7" fill="white" rx="1"/>
                  <rect x="3" y="14" width="7" height="7" fill="white" rx="1"/>
                  <rect x="14" y="14" width="3" height="3" fill="white" rx="0.5"/>
                  <rect x="18" y="14" width="3" height="3" fill="white" rx="0.5"/>
                  <rect x="14" y="18" width="3" height="3" fill="white" rx="0.5"/>
                  <circle cx="18.5" cy="18.5" r="2.5" fill="white"/>
                </svg>
              </div>
              <span className="text-lg sm:text-xl font-bold text-[#004332]">Scannova</span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* OFITSIANT CHAQIRISH */}
              {tableNumber && (
                <button
                  onClick={handleCallWaiter}
                  disabled={callingWaiter}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg font-semibold transition text-sm ${
                    callingWaiter
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-[#004332] text-white hover:bg-[#003326]"
                  }`}
                >
                  {callingWaiter ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="hidden sm:inline">{t("calling", "Chaqirilmoqda...")}</span>
                    </>
                  ) : (
                    <>
                      <span className="text-lg">👨‍🍳</span>
                      <span className="hidden sm:inline">{t("waiter", "Ofitsiant")}</span>
                    </>
                  )}
                </button>
              )}
              
              <div className="relative">
                <button
                  onClick={() => setShowLangMenu(!showLangMenu)}
                  className="flex items-center gap-2 bg-white border border-gray-300 px-2 sm:px-3 py-2 rounded-lg hover:bg-gray-50 transition"
                >
                  <span className="text-xl">{currentLang.flag}</span>
                  <span className="hidden sm:inline font-semibold text-gray-700 text-sm">
                    {currentLang.code.toUpperCase()}
                  </span>
                </button>

                {showLangMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border z-30">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 transition first:rounded-t-lg last:rounded-b-lg ${
                          i18n.language === lang.code ? "bg-[#004332] text-white" : "text-gray-700"
                        }`}
                      >
                        <span className="text-2xl">{lang.flag}</span>
                        <span className="font-medium">{lang.name}</span>
                        {i18n.language === lang.code && <span className="ml-auto">✓</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={goToOrderHistory}
                className="bg-[#004332] text-white px-3 sm:px-4 py-2 rounded-lg font-semibold hover:bg-[#003326] transition flex items-center gap-2 text-sm"
              >
                📋 <span className="hidden sm:inline">{t("orders", "Buyurtmalar")}</span>
              </button>
            </div>
          </div>

          <p className="text-gray-600 text-sm sm:text-base">
            🪑 {t("table_number", "Stol raqami")}:{" "}
            <span className="font-semibold text-gray-800">{tableNumber}</span>
          </p>
        </div>

        {/* Categories */}
        <div className="px-4 overflow-x-auto scrollbar-hide pb-3 border-t border-gray-100">
          <div className="flex gap-2 pt-3 min-w-max">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 sm:px-4 py-2 rounded-full font-semibold transition-all text-sm whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? "bg-[#004332] text-white shadow-lg scale-105"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MENU LIST */}
      <div className="px-4 sm:px-6 pb-24 pt-4">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-[#004332] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500 text-lg">Yuklanmoqda...</p>
            </div>
          </div>
        ) : filteredMenu.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {filteredMenu.map((dish) => (
              <Card key={dish.id} dish={dish} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-10">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-xl font-semibold mb-2">{t("no_dishes", "Bu kategoriyada ovqat yo'q")}</p>
            <button
              onClick={() => setSelectedCategory("all")}
              className="text-[#004332] font-semibold hover:underline"
            >
              {t("view_all", "Barcha ovqatlarni ko'rish")}
            </button>
          </div>
        )}
      </div>

      {/* ⭐ BAHOLASH TUGMASI - Ofitsiant chaqirilgandan keyin */}
      {assignedWaiter && (
        <div 
          className="fixed left-0 right-0 px-4"
          style={{ 
            bottom: safeOrder.length > 0 ? "90px" : "10px", 
            zIndex: 9998 
          }}
        >
          <div className="max-w-7xl mx-auto">
            <button
              onClick={handleOpenRating}
              className="w-full py-3 rounded-xl font-bold text-sm bg-white border-2 border-[#004332] text-[#004332] hover:bg-[#004332] hover:text-white transition-all shadow-lg"
            >
              ⭐ {t("rate_waiter", "Ofitsiantni baholash")}
            </button>
          </div>
        </div>
      )}

      {/* ⭐ BAHOLASH MODAL */}
      <RateWaiterModal
        isOpen={showRatingModal}
        onClose={handleCloseRating}
        waiter={assignedWaiter}
        tableNumber={tableNumber}
      />

      {/* CART SUMMARY */}
      {safeOrder.length > 0 && (
        <div
          className="fixed left-0 right-0 bg-gradient-to-r from-[#004332] to-[#00664a] shadow-2xl px-4 py-3"
          style={{ bottom: "80px", zIndex: 9999 }}
        >
          <div className="max-w-7xl mx-auto flex justify-between items-center gap-3">
            <div className="text-white">
              <p className="text-xs opacity-90">{totalItems} {t("items", "ta ovqat")}</p>
              <p className="font-bold text-base sm:text-lg">{totalPrice.toLocaleString()} {t("currency", "so'm")}</p>
            </div>
            <button
              onClick={goToCart}
              className="bg-white text-[#004332] px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg text-sm whitespace-nowrap"
            >
              🛒 {t("cart", "Korzinka")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}