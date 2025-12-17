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
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  // ✅ QUYIDAGINI QO'SHING (getItemCount dan yuqorida)
  const isOutOfStock = dish.outOfStock === true;
  const safeOrder = Array.isArray(order) ? order : [];
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
  if (isOutOfStock) return; // ✅ SHU QATORNI QO'SHING
  setShowModal(true);
  setSelectedVariant(null);
  setQuantity(1);
};

  const handleAddToCart = () => {
    if (!selectedVariant) {
      alert(t("select_variant", "Iltimos, variantni tanlang!"));
      return;
    }

    const variantItem = {
      id: `${dish.id}_${selectedVariant.id}`,
      dishId: dish.id,
      title: dish.title,
      variant: selectedVariant.name,
      variantId: selectedVariant.id,
      price: selectedVariant.price,
      imageUrl: dish.imageUrl,
      category: dish.category,
      count: quantity
    };

    const existingItem = safeOrder.find(item => 
      item.dishId === dish.id && item.variantId === selectedVariant.id
    );

    if (existingItem) {
      for (let i = 0; i < quantity; i++) {
        incrementItem(existingItem.id);
      }
    } else {
      addItem(variantItem);
    }

    setShowModal(false);
    setSelectedVariant(null);
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
          {/* ✅ RASM - FIXED HEIGHT */}
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
   {isOutOfStock && (
    <div className="absolute inset-0 bg-black bg-opacity-60 z-20 flex flex-col items-center justify-center p-4 rounded-xl">
      <div className="bg-red-500 text-white px-6 py-3 rounded-full font-bold text-lg mb-3 shadow-lg animate-pulse">
        ❌ TUGAB QOLDI
      </div>
      {/* <p className="text-white text-center text-xs  font-semibold leading-relaxed bg-black bg-opacity-50 px-4 py-2 rounded-lg">
        😋 Bu ovqatimiz juda mazali bo'lgani uchun tugab qoldi!
      </p> */}
      <p className="text-white text-xs mt-2 opacity-80">
        ⏰ Tez orada qayta tayyorlanadi
      </p>
    </div>
  )}
          </div>

          {/* ✅ CONTENT - OPTIMIZED */}
          <div className="p-3 sm:p-4">
            {/* NOM */}
            <h2 className="text-sm sm:text-base font-bold text-gray-800 mb-1 line-clamp-2 min-h-[2.5rem]">
              {dish.title}
            </h2>

            {/* NARX */}
            <p className="text-base sm:text-lg font-bold text-[#004332] mb-3">
              {hasVariants 
                ? `${Number(dish.price).toLocaleString()} so'm+`
                : `${Number(dish.price).toLocaleString()} so'm`
              }
            </p>

            {/* ✅ KICHIK COUNTER - Oddiy yoki Variantli */}
            {hasVariants ? (
              // VARIANTLI OVQAT
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
              // ✅ ODDIY OVQAT - KICHIK COUNTER
              <div className="flex justify-between items-center gap-2">
                <button
                  className="w-8 h-8 sm:w-9 sm:h-9 bg-red-500 text-white rounded-lg text-lg font-bold hover:bg-red-600 active:scale-95 transition disabled:opacity-40 disabled:cursor-not-allowed"
                  onClick={handleSimpleDecrement}
                  disabled={currentCount === 0}
                >
                  −
                </button>
                
                <span className="text-lg sm:text-xl font-bold min-w-[2rem] text-center text-gray-800">
                  {currentCount}
                </span>
                
                <button
                  className="w-8 h-8 sm:w-9 sm:h-9 bg-[#004332] text-white rounded-lg text-lg font-bold hover:bg-[#00664a] active:scale-95 transition"
                  onClick={handleSimpleIncrement}
                >
                  +
                </button>
              </div>
            )}

            {/* ✅ JAMI NARX - KOMPAKT */}
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

      {/* ✅ MODAL - Variant tanlash */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* MODAL HEADER */}
              <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center rounded-t-2xl z-10">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 pr-4">{dish.title}</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-2xl text-gray-600 transition flex-shrink-0"
                >
                  ×
                </button>
              </div>

              {/* MODAL CONTENT */}
              <div className="p-4 sm:p-5">
                {/* RASM */}
                <img
                  src={dish.imageUrl}
                  alt={dish.title}
                  className="w-full h-50 object-cover rounded-xl mb-4"
                />

                {/* TAVSIF */}
                {dish.description && (
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    {dish.description}
                  </p>
                )}

                {/* VARIANTLAR */}
                <div className="mb-5">
                  <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                    🎨 {t("select_flavor", "Ta'mini tanlang")}:
                  </h3>
                  <div className="space-y-2">
                    {dish.variants.map((variant) => (
                      <div
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        className={`flex justify-between items-center p-3 border-2 rounded-xl cursor-pointer transition-all ${
                          selectedVariant?.id === variant.id
                            ? "border-[#004332] bg-green-50 shadow-md"
                            : "border-gray-200 hover:border-[#004332] hover:bg-gray-50"
                        }`}
                      >
                        <span className="font-semibold text-gray-800 text-sm sm:text-base">
                          {variant.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#004332] text-sm sm:text-base">
                            {Number(variant.price).toLocaleString()} so'm
                          </span>
                          {selectedVariant?.id === variant.id && (
                            <span className="text-green-600 text-lg">✓</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* MIQDOR */}
                <div className="mb-5">
                  <h3 className="font-bold text-gray-800 mb-3">
                    🔢 {t("quantity", "Miqdor")}:
                  </h3>
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 sm:w-12 sm:h-12 bg-red-500 text-white rounded-xl text-xl font-bold hover:bg-red-600 active:scale-95 transition shadow-md"
                    >
                      −
                    </button>
                    <span className="text-2xl sm:text-3xl font-bold text-gray-800 min-w-[3rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 sm:w-12 sm:h-12 bg-[#004332] text-white rounded-xl text-xl font-bold hover:bg-[#00664a] active:scale-95 transition shadow-md"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* JAMI NARX */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-semibold">
                      {t("total", "Jami")}:
                    </span>
                    <span className="text-xl sm:text-2xl font-bold text-[#004332]">
                      {selectedVariant
                        ? (selectedVariant.price * quantity).toLocaleString()
                        : "0"}{" "}
                      so'm
                    </span>
                  </div>
                </div>

                {/* SAVATCHAGA QO'SHISH */}
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedVariant}
                  className={`w-full py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all flex items-center justify-center gap-2 ${
                    selectedVariant
                      ? "bg-gradient-to-r from-[#004332] to-[#00664a] text-white hover:shadow-xl hover:scale-105"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  🛒 {t("add_to_cart", "Savatchaga qo'shish")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}