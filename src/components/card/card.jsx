import { useState } from "react";
import { useOrderStore } from "../../utils/zustand";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import "./style.scss";

export default function Card({ dish }) {
  const addItem = useOrderStore((state) => state.addItem);
  const incrementItem = useOrderStore((state) => state.incrementItem);
  const decrementItem = useOrderStore((state) => state.decrementItem);
  const order = useOrderStore((state) => state.order);
  
  const { t } = useTranslation("menu");
  const [imageError, setImageError] = useState(false);
  
  const [showModal, setShowModal] = useState(false);
  const [selectedAdditions, setSelectedAdditions] = useState({});
  const [quantity, setQuantity] = useState(1);
  
  const isOutOfStock = dish.outOfStock === true;
  const safeOrder = Array.isArray(order) ? order : [];

  // ✅ NaN GUARD - Price tekshirish
  const basePrice = Number(dish?.price);
  const basePriceValid = Number.isFinite(basePrice) ? basePrice : 0;
  const basePriceText = basePriceValid.toLocaleString();

  // ✅ FUNKSIYALAR
  
  const calculateAdditionsPrice = () => {
    let additions = 0;
    if (dish.variants) {
      dish.variants.forEach(v => {
        if (selectedAdditions[v.id]) {
          additions += Number(v.price || 0);
        }
      });
    }
    return additions;
  };

  const calculateTotalPrice = () => {
    const additionsPrice = calculateAdditionsPrice();
    return basePriceValid + additionsPrice;
  };

  const getAdditionsText = () => {
    if (!dish.variants) return "";
    
    const selected = dish.variants
      .filter(v => selectedAdditions[v.id])
      .map(v => v.name);
    
    return selected.length > 0 ? selected.join(", ") : "";
  };

  const getItemCount = () => {
    if (!dish.variants || dish.variants.length === 0) {
      const existingItem = safeOrder.find(item => item.id === dish.id);
      return existingItem?.count || 0;
    } else {
      const variantItems = safeOrder.filter(item => 
        item.dishId === dish.id || item.id === dish.id
      );
      return variantItems.reduce((sum, item) => sum + (item.count || 0), 0);
    }
  };

  const currentCount = getItemCount();

  const handleSimpleIncrement = () => {
    if (isOutOfStock) return;
    if (currentCount === 0) {
      addItem(dish);
    } else {
      incrementItem(dish.id);
    }
  };

  const handleSimpleDecrement = () => {
    if (currentCount > 0) {
      decrementItem(dish.id);
    }
  };

  const handleVariantClick = () => {
    if (isOutOfStock) return;
    setShowModal(true);
    setSelectedAdditions({});
    setQuantity(1);
  };

  const toggleAddition = (additionId) => {
    setSelectedAdditions(prev => {
      const newState = { ...prev };
      if (newState[additionId]) {
        delete newState[additionId];
      } else {
        newState[additionId] = true;
      }
      return newState;
    });
  };

  const handleAddBasic = () => {
    if (isOutOfStock) return;
    
    if (currentCount === 0) {
      addItem(dish);
    } else {
      incrementItem(dish.id);
    }
    
    setShowModal(false);
  };

  // ✅ FIXED: Price handling - unit total (base + additions)
  const handleAddWithAdditions = () => {
    const hasSelectedAdditions = Object.keys(selectedAdditions).length > 0;

    if (!hasSelectedAdditions) {
      alert(t("select_additions", "Qo'shimchalarni tanlang yoki asosiy narxda qo'shing!"));
      return;
    }

    const additionsText = getAdditionsText();
    const additionsPrice = calculateAdditionsPrice();
    
    // ✅ UNIT TOTAL (base + additions) - Cart/Admin to'g'ri hisoblashi uchun
    const unitTotal = basePriceValid + additionsPrice;

    const additionsIds = Object.keys(selectedAdditions).sort().join('_');
    const uniqueId = `${dish.id}_${additionsIds}`;

    const itemWithAdditions = {
      id: uniqueId,
      dishId: dish.id,
      title: dish.title,
      variant: additionsText,
      
      // ✅ ENG MUHIM: price = unit total (barcha page'lar uchun)
      price: unitTotal,
      
      // ✅ Ixtiyoriy - ko'rsatish uchun
      basePrice: basePriceValid,
      addonsTotal: additionsPrice,
      
      imageUrl: dish.imageUrl,
      category: dish.category,
      selectedAdditions: { ...selectedAdditions },
      count: quantity
    };

    // ✅ SODDA: har doim addItem (zustand o'zi count bilan manage qiladi)
    addItem(itemWithAdditions);

    setShowModal(false);
    setSelectedAdditions({});
    setQuantity(1);
  };

  const handleVariantDecrement = () => {
    const variantItems = safeOrder.filter(item => 
      item.dishId === dish.id || item.id === dish.id
    );
    if (variantItems.length > 0) {
      const lastItem = variantItems[variantItems.length - 1];
      decrementItem(lastItem.id);
    }
  };

  const hasVariants = dish.variants && dish.variants.length > 0;
  const hasSelectedAdditions = Object.keys(selectedAdditions).length > 0;
  const totalPrice = calculateTotalPrice();
  const totalForQuantity = totalPrice * quantity;

  return (
    <>
      <motion.div
        className="flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={!isOutOfStock ? { y: -3 } : {}}
      >
        <div className={`bg-white w-full shadow-md rounded-xl overflow-hidden border border-gray-100 transition-all duration-300 relative ${
          isOutOfStock ? 'opacity-70' : 'hover:shadow-xl'
        }`}>
          {/* RASM */}
          <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
            <img
              className={`w-full h-full object-cover transition-all duration-300 ${
                isOutOfStock ? 'filter grayscale' : 'hover:scale-105'
              }`}
              src={imageError ? "/fallback.jpg" : dish.imageUrl}
              alt={dish.title}
              onError={() => setImageError(true)}
              loading="lazy"
            />
            
            {hasVariants && !isOutOfStock && (
              <div className="absolute top-2 right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                🎨 +{dish.variants.length}
              </div>
            )}
            
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black bg-opacity-60 z-20 flex flex-col items-center justify-center p-4 rounded-xl">
                <div className="bg-red-500 text-white px-6 py-3 rounded-full font-bold text-lg mb-3 shadow-lg animate-pulse">
                  ❌ TUGAB QOLDI
                </div>
                <p className="text-white text-xs mt-2 opacity-80">
                  ⏰ Tez orada qayta tayyorlanadi
                </p>
              </div>
            )}
          </div>

          <div className="p-3 sm:p-4">
            <h2 className="text-sm sm:text-base font-bold text-gray-800 mb-1 line-clamp-2 min-h-[2.5rem]">
              {dish.title}
            </h2>

            {/* ✅ NaN FIXED: basePriceText ishlatish */}
            <p className="text-base sm:text-lg font-bold text-[#004332] mb-3">
              {hasVariants 
                ? `dan ${basePriceText} so'm`
                : `${basePriceText} so'm`
              }
            </p>

            {hasVariants ? (
              <div className="space-y-2">
                <button
                  onClick={handleVariantClick}
                  disabled={isOutOfStock}
                  className={`w-full py-2 rounded-lg font-semibold transition text-xs sm:text-sm ${
                    isOutOfStock
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-[#004332] text-white hover:bg-[#00664a]'
                  }`}
                >
                  {isOutOfStock ? '❌ Tugab qoldi' : '🎨 Tanlash'}
                </button>

                {currentCount > 0 && (
                  <button
                    onClick={handleVariantDecrement}
                    className="w-full py-1.5 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition text-xs"
                  >
                    − Olib tashlash
                  </button>
                )}
              </div>
            ) : (
              <div className="flex justify-between items-center gap-2">
                <button
                  className="w-8 h-8 sm:w-9 sm:h-9 bg-red-500 text-white rounded-lg text-lg font-bold hover:bg-red-600 active:scale-95 transition disabled:opacity-40 disabled:cursor-not-allowed"
                  onClick={handleSimpleDecrement}
                  disabled={currentCount === 0 || isOutOfStock}
                >
                  −
                </button>
                
                <span className="text-lg sm:text-xl font-bold min-w-[2rem] text-center text-gray-800">
                  {currentCount}
                </span>
                
                <button
                  className="w-8 h-8 sm:w-9 sm:h-9 bg-[#004332] text-white rounded-lg text-lg font-bold hover:bg-[#00664a] active:scale-95 transition disabled:opacity-40 disabled:cursor-not-allowed"
                  onClick={handleSimpleIncrement}
                  disabled={isOutOfStock}
                >
                  +
                </button>
              </div>
            )}

            {!hasVariants && currentCount > 0 && (
              <div className="mt-2 bg-green-50 border border-green-500 rounded-lg p-2 text-center">
                <p className="text-xs font-bold text-green-700">
                  ✅ {(currentCount * basePriceValid).toLocaleString()} so'm
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* ✅ RESPONSIVE MODAL */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-end sm:items-center justify-center z-[9999] p-0 sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="bg-white rounded-t-2xl sm:rounded-2xl max-w-lg w-full max-h-[85vh] sm:max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* HEADER - STICKY */}
              <div className="sticky top-0 bg-white border-b p-3 sm:p-4 flex justify-between items-center rounded-t-2xl z-10 shadow-sm">
                <h2 className="text-base sm:text-xl font-bold text-gray-800 pr-4 line-clamp-1">{dish.title}</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-xl sm:text-2xl text-gray-600 transition flex-shrink-0"
                >
                  ×
                </button>
              </div>

              {/* SCROLLABLE CONTENT */}
              <div className="overflow-y-auto flex-1 p-3 sm:p-5 pb-24">
                {/* RASM */}
                <img
                  src={dish.imageUrl}
                  alt={dish.title}
                  className="w-full h-40 sm:h-48 object-cover rounded-xl mb-3 sm:mb-4"
                />

                {/* TAVSIF */}
                {dish.description && (
                  <p className="text-gray-600 mb-3 sm:mb-4 text-xs sm:text-sm leading-relaxed">
                    {dish.description}
                  </p>
                )}

                {/* ASOSIY NARXDA QO'SHISH */}
                <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600 mb-1">🍽️ {t("basic_price", "Asosiy narx")}</p>
                      <p className="text-lg sm:text-xl font-bold text-green-600">
                        {basePriceText} so'm
                      </p>
                    </div>
                    <button
                      onClick={handleAddBasic}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg font-semibold transition shadow-md text-xs sm:text-sm"
                    >
                      + {t("add", "Qo'shish")}
                    </button>
                  </div>
                </div>

                {/* QO'SHIMCHALAR */}
                {dish.variants && dish.variants.length > 0 && (
                  <div className="mb-4 sm:mb-5">
                    <h3 className="font-bold text-gray-800 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                      🎨 {t("additions", "Qo'shimchalar")}:
                    </h3>
                    <div className="space-y-2">
                      {dish.variants.map((addition) => (
                        <div
                          key={addition.id}
                          onClick={() => toggleAddition(addition.id)}
                          className={`flex justify-between items-center p-2.5 sm:p-3 border-2 rounded-xl cursor-pointer transition-all ${
                            selectedAdditions[addition.id]
                              ? "border-blue-500 bg-blue-50 shadow-md"
                              : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition ${
                              selectedAdditions[addition.id]
                                ? "border-blue-500 bg-blue-500"
                                : "border-gray-300 bg-white"
                            }`}>
                              {selectedAdditions[addition.id] && (
                                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            <span className="font-semibold text-gray-800 text-xs sm:text-base">
                              {addition.name}
                            </span>
                          </div>
                          <span className="font-bold text-blue-600 text-xs sm:text-base">
                            +{Number(addition.price).toLocaleString()} so'm
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TANLANGAN QO'SHIMCHALAR */}
                {hasSelectedAdditions && (
                  <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs text-blue-800 font-semibold mb-1">
                      ✨ {t("selected_additions", "Tanlangan qo'shimchalar")}:
                    </p>
                    <p className="text-xs sm:text-sm text-blue-900">{getAdditionsText()}</p>
                  </div>
                )}

                {/* MIQDOR */}
                {hasSelectedAdditions && (
                  <div className="mb-4 sm:mb-5">
                    <h3 className="font-bold text-gray-800 mb-2 sm:mb-3 text-sm sm:text-base">
                      🔢 {t("quantity", "Miqdor")}:
                    </h3>
                    <div className="flex items-center justify-center gap-3 sm:gap-4">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 sm:w-12 sm:h-12 bg-red-500 text-white rounded-xl text-lg sm:text-xl font-bold hover:bg-red-600 active:scale-95 transition shadow-md"
                      >
                        −
                      </button>
                      <span className="text-xl sm:text-3xl font-bold text-gray-800 min-w-[2.5rem] sm:min-w-[3rem] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 sm:w-12 sm:h-12 bg-[#004332] text-white rounded-xl text-lg sm:text-xl font-bold hover:bg-[#00664a] active:scale-95 transition shadow-md"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                {/* JAMI NARX */}
                {hasSelectedAdditions && (
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-3 sm:p-4 rounded-xl mb-3 sm:mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm sm:text-base text-gray-700 font-semibold">
                        {t("total", "Jami")}:
                      </span>
                      <span className="text-lg sm:text-2xl font-bold text-[#004332]">
                        {totalForQuantity.toLocaleString()} so'm
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* ✅ STICKY FOOTER - SAVATCHAGA QO'SHISH */}
              {hasSelectedAdditions && (
                <div className="sticky bottom-0 bg-white border-t p-3 sm:p-4">
                  <button
                    onClick={handleAddWithAdditions}
                    className="w-full py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-lg transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-[#004332] to-[#00664a] text-white hover:shadow-xl active:scale-[0.98]"
                  >
                    🛒 {t("add_to_cart", "Savatchaga qo'shish")}
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}