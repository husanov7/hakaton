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
  const setDishModalOpen = useOrderStore((state) => state.setDishModalOpen); // ✅ Modal holati
  
  const { t } = useTranslation("menu");
  const [imageError, setImageError] = useState(false);
  
  const [showModal, setShowModal] = useState(false);
  
  // ✅ YANGI: har qo'shimchaga son (quantity)
  const [selectedAdditions, setSelectedAdditions] = useState({});
  const [quantity, setQuantity] = useState(1);
  
  const isOutOfStock = dish.outOfStock === true;
  const safeOrder = Array.isArray(order) ? order : [];

  // ✅ QO'SHIMCHALAR NARXI (quantity bilan)
  const calculateAdditionsPrice = () => {
    let sum = 0;
    if (dish.variants) {
      dish.variants.forEach(v => {
        const qty = Number(selectedAdditions[v.id] || 0);
        sum += Number(v.price || 0) * qty;
      });
    }
    return sum;
  };

  // ✅ Jami narx (asosiy + qo'shimchalar)
  const calculateTotalPrice = () => {
    const basePrice = Number(dish.price || 0);
    const additionsPrice = calculateAdditionsPrice();
    return basePrice + additionsPrice;
  };

  // ✅ TANLANGAN QO'SHIMCHALAR MATNI (qty bilan)
  const getAdditionsText = () => {
    if (!dish.variants) return "";
    
    const selected = dish.variants
      .filter(v => (selectedAdditions[v.id] || 0) > 0)
      .map(v => {
        const qty = selectedAdditions[v.id];
        return qty > 1 ? `${v.name} x${qty}` : v.name;
      });
    
    return selected.length > 0 ? selected.join(", ") : "";
  };

  // ✅ Korzinkada nechta bor?
  const getItemCount = () => {
    if (!dish.variants || dish.variants.length === 0) {
      // Oddiy ovqat
      const existingItem = safeOrder.find(item => item.id === dish.id);
      return existingItem?.count || 0;
    } else {
      // Variantli ovqat - barcha variantlarning yig'indisi
      const variantItems = safeOrder.filter(item => 
        item.baseDishId === dish.id || item.id === dish.id
      );
      return variantItems.reduce((sum, item) => sum + (item.count || 0), 0);
    }
  };

  const currentCount = getItemCount();

  // ✅ Oddiy ovqat uchun +
  const handleSimpleIncrement = () => {
    if (isOutOfStock) return;
    if (currentCount === 0) {
      addItem(dish);
    } else {
      incrementItem(dish.id);
    }
  };

  // ✅ Oddiy ovqat uchun -
  const handleSimpleDecrement = () => {
    if (currentCount > 0) {
      decrementItem(dish.id);
    }
  };

  // ✅ Variantli ovqat modalini ochish
  const handleVariantClick = () => {
    if (isOutOfStock) return;
    setShowModal(true);
    setDishModalOpen(true); // ✅ Zustand'ga yozish
    setSelectedAdditions({});
    setQuantity(1);
  };

  // ✅ Modalni yopish
  const closeModal = () => {
    setShowModal(false);
    setDishModalOpen(false); // ✅ Zustand'ga yozish
    setSelectedAdditions({});
    setQuantity(1);
  };

  // ✅ Qo'shimchani tanlash/bekor qilish
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

  // ✅ QO'SHIMCHA QUANTITY O'ZGARTIRISH
  const incrementAddition = (additionId) => {
    setSelectedAdditions(prev => ({
      ...prev,
      [additionId]: (prev[additionId] || 0) + 1
    }));
  };

  const decrementAddition = (additionId) => {
    setSelectedAdditions(prev => {
      const newQty = Math.max(0, (prev[additionId] || 0) - 1);
      if (newQty === 0) {
        const { [additionId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [additionId]: newQty };
    });
  };

  // ✅ Asosiy narxda qo'shish (qo'shimchasiz)
  const handleAddBasic = () => {
    if (isOutOfStock) return;
    
    if (currentCount === 0) {
      addItem(dish);
    } else {
      incrementItem(dish.id);
    }
    
    closeModal(); // ✅ closeModal ishlatish
  };

  // ✅ Qo'shimchalar bilan qo'shish
  const handleAddWithAdditions = () => {
    const hasSelectedAdditions = Object.keys(selectedAdditions).length > 0;

    if (!hasSelectedAdditions) {
      alert(t("select_additions", "Qo'shimchalarni tanlang yoki asosiy narxda qo'shing!"));
      return;
    }

    const additionsText = getAdditionsText();
    const finalPrice = calculateTotalPrice(); // ✅ base + additions

    // ✅ Unique ID yaratish
    const additionsIds = Object.keys(selectedAdditions).sort().join('_');
    const uniqueId = `${dish.id}_${additionsIds}`;

    const itemWithAdditions = {
      id: uniqueId,                    // ✅ unique
      baseDishId: dish.id,             // ✅ guruhlash uchun
      title: dish.title,
      variant: additionsText,
      price: finalPrice,               // ✅ FINAL NARX (base + addons)
      imageUrl: dish.imageUrl,
      category: dish.category,
      selectedAdditions: { ...selectedAdditions },
      count: quantity
    };

    // ✅ Zustand'ga qo'shish
    addItem(itemWithAdditions);

    closeModal(); // ✅ closeModal ishlatish
  };

  // ✅ Variantli ovqatdan - qilish (oxirgi variantni kamaytirish)
  const handleVariantDecrement = () => {
    const variantItems = safeOrder.filter(item => 
      item.baseDishId === dish.id || item.id === dish.id
    );
    if (variantItems.length > 0) {
      const lastItem = variantItems[variantItems.length - 1];
      decrementItem(lastItem.id);
    }
  };

  const hasVariants = dish.variants && dish.variants.length > 0;
  
  // ✅ YANGI: kamida 1 ta qo'shimcha tanlangan bo'lsa
  const hasSelectedAdditions = Object.values(selectedAdditions).some(qty => qty > 0);
  
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

            <p className="text-base sm:text-lg font-bold text-[#004332] mb-3">
              {hasVariants 
                ? `dan ${Number(dish.price).toLocaleString()} so'm`
                : `${Number(dish.price).toLocaleString()} so'm`
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
                  ✅ {(currentCount * Number(dish.price)).toLocaleString()} so'm
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* ✅ MODAL - 3 QISMLI: HEADER + BODY + FOOTER */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-end sm:items-center justify-center z-[10000] p-0 sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[85vh] sm:max-h-[90vh] shadow-2xl flex flex-col"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* HEADER */}
              <div className="flex-shrink-0 bg-white border-b px-4 py-3 flex justify-between items-center rounded-t-2xl">
                <h2 className="text-base sm:text-lg font-bold text-gray-800 pr-4 line-clamp-1">
                  {dish.title}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-xl text-gray-600 transition flex-shrink-0"
                >
                  ×
                </button>
              </div>

              {/* BODY - SCROLLABLE */}
              <div className="flex-1 overflow-y-auto p-4 pb-6">
                <img
                  src={dish.imageUrl}
                  alt={dish.title}
                  className="w-full h-36 sm:h-40 object-cover rounded-lg mb-3"
                />

                {dish.description && (
                  <p className="text-gray-600 mb-3 text-xs sm:text-sm leading-relaxed">
                    {dish.description}
                  </p>
                )}

                {/* ASOSIY NARXDA QO'SHISH */}
                <div className="mb-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg">
                  <div className="flex justify-between items-center gap-2">
                    <div className="flex-1">
                      <p className="text-xs text-gray-600 mb-0.5">🍽️ {t("basic_price", "Asosiy narx")}</p>
                      <p className="text-base sm:text-lg font-bold text-green-600">
                        {Number(dish.price).toLocaleString()} so'm
                      </p>
                    </div>
                    <button
                      onClick={handleAddBasic}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg font-semibold transition shadow-md text-xs flex-shrink-0"
                    >
                      + {t("add", "Qo'shish")}
                    </button>
                  </div>
                </div>

                {/* QO'SHIMCHALAR */}
                {dish.variants && dish.variants.length > 0 && (
                  <div className="mb-3">
                    <h3 className="font-bold text-gray-800 mb-2 text-sm">
                      🎨 {t("additions", "Qo'shimchalar")}:
                    </h3>
                    <div className="space-y-2">
                      {dish.variants.map((addition) => {
                        const qty = selectedAdditions[addition.id] || 0;
                        const isSelected = qty > 0;
                        
                        return (
                          <div
                            key={addition.id}
                            className={`flex justify-between items-center gap-2 p-2.5 border-2 rounded-lg transition-all ${
                              isSelected
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-blue-300"
                            }`}
                          >
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-800 text-xs sm:text-sm truncate">
                                {addition.name}
                              </p>
                              <p className="text-xs text-blue-600 font-bold">
                                +{Number(addition.price).toLocaleString()} so'm
                              </p>
                            </div>
                            
                            {/* ✅ QUANTITY CONTROLS */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => decrementAddition(addition.id)}
                                disabled={qty === 0}
                                className="w-7 h-7 bg-red-500 text-white rounded-lg text-lg font-bold hover:bg-red-600 active:scale-95 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
                              >
                                −
                              </button>
                              
                              <span className="text-base font-bold text-gray-800 min-w-[1.5rem] text-center">
                                {qty}
                              </span>
                              
                              <button
                                onClick={() => incrementAddition(addition.id)}
                                className="w-7 h-7 bg-[#004332] text-white rounded-lg text-lg font-bold hover:bg-[#00664a] active:scale-95 transition flex items-center justify-center"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* TANLANGAN QO'SHIMCHALAR */}
                {hasSelectedAdditions && (
                  <div className="mb-3 p-2.5 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs text-blue-800 font-semibold mb-0.5">
                      ✨ {t("selected_additions", "Tanlangan")}:
                    </p>
                    <p className="text-xs text-blue-900 line-clamp-2">{getAdditionsText()}</p>
                    <p className="text-xs text-blue-700 mt-1">
                      Qo'shimchalar: +{calculateAdditionsPrice().toLocaleString()} so'm
                    </p>
                  </div>
                )}

                {hasSelectedAdditions && (
                  <div className="mb-3">
                    <h3 className="font-bold text-gray-800 mb-2 text-sm">
                      🔢 {t("quantity", "Miqdor")}:
                    </h3>
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 bg-red-500 text-white rounded-lg text-lg font-bold hover:bg-red-600 active:scale-95 transition"
                      >
                        −
                      </button>
                      <span className="text-2xl font-bold text-gray-800 min-w-[2.5rem] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 bg-[#004332] text-white rounded-lg text-lg font-bold hover:bg-[#00664a] active:scale-95 transition"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* FOOTER - STICKY */}
              {hasSelectedAdditions && (
                <div className="flex-shrink-0 bg-white border-t px-4 py-3 space-y-2">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm font-semibold text-gray-700">
                      {t("total", "Jami")}:
                    </span>
                    <span className="text-xl font-bold text-[#004332]">
                      {totalForQuantity.toLocaleString()} so'm
                    </span>
                  </div>

                  <button
                    onClick={handleAddWithAdditions}
                    className="w-full py-3 rounded-lg font-bold text-sm transition-all bg-gradient-to-r from-[#004332] to-[#00664a] text-white hover:opacity-90 active:scale-[0.98]"
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