// src/components/RateWaiterModal.jsx
import React, { useState } from "react";
import { rateWaiter } from "../services/ratingSevice";

export default function RateWaiterModal({ 
  isOpen, 
  onClose, 
  waiter, 
  tableNumber 
}) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !waiter) return null;

  const handleSubmit = async () => {
    if (rating === 0) {
      alert("❌ Iltimos, baho tanlang!");
      return;
    }

    setSubmitting(true);

    try {
      await rateWaiter({
        waiterId: waiter.id,
        waiterName: waiter.name || waiter.waiterName,
        tableNumber,
        rating,
        comment: comment.trim(),
        customerName: customerName.trim() || "Anonim"
      });

      // ✅ Muvaffaqiyatli
      alert("✅ Rahmat! Sizning bahoyingiz qabul qilindi.\n\nAdmin tomonidan ko'rib chiqilgandan keyin e'lon qilinadi.");
      
      // Reset
      setRating(0);
      setComment("");
      setCustomerName("");
      setHoveredRating(0);
      
      // ✅ Modal yopiladi VA tugma yo'qoladi
      onClose(true); // true = baho yuborildi

    } catch (error) {
      alert(`❌ Xato: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Bekor qilish - tugma qoladi
  const handleCancel = () => {
    setRating(0);
    setComment("");
    setCustomerName("");
    setHoveredRating(0);
    onClose(false); // false = bekor qilindi
  };

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        onClick={() => setRating(star)}
        onMouseEnter={() => setHoveredRating(star)}
        onMouseLeave={() => setHoveredRating(0)}
        className="transition-transform hover:scale-110"
        type="button"
      >
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill={(hoveredRating || rating) >= star ? "#FFD700" : "#E5E7EB"}
          stroke="#FFD700"
          strokeWidth="1"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      </button>
    ));
  };

  const ratingLabels = {
    1: "😞 Juda yomon",
    2: "😕 Yomon",
    3: "😐 O'rtacha",
    4: "😊 Yaxshi",
    5: "🤩 A'lo!"
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#004332] to-[#00664a] text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-2xl font-bold">Ofitsiantni baholash</h2>
            <button
              onClick={handleCancel}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition"
              type="button"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-white text-opacity-90">
            👨‍🍳 {waiter.name || waiter.waiterName}
          </p>
          {tableNumber && (
            <p className="text-white text-opacity-75 text-sm mt-1">
              🪑 Stol: {tableNumber}
            </p>
          )}
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          
          {/* Stars */}
          <div className="text-center">
            <p className="text-gray-700 font-semibold mb-3">Xizmat sifatini baholang</p>
            <div className="flex justify-center gap-2 mb-3">
              {renderStars()}
            </div>
            {rating > 0 && (
              <p className="text-xl font-bold text-[#004332] animate-pulse">
                {ratingLabels[rating]}
              </p>
            )}
          </div>

          {/* Customer Name (Optional) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Ismingiz (ixtiyoriy)
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Ismingizni kiriting"
              maxLength={50}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#004332] outline-none"
            />
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Sharh (ixtiyoriy)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Xizmat haqida fikringizni yozing..."
              maxLength={500}
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#004332] outline-none resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              {comment.length}/500 belgi
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={submitting || rating === 0}
              type="button"
              className={`flex-1 py-3 rounded-xl font-bold transition ${
                submitting || rating === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#004332] text-white hover:bg-[#003326]"
              }`}
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Yuborilmoqda...
                </span>
              ) : (
                "✅ Yuborish"
              )}
            </button>
            <button
              onClick={handleCancel}
              disabled={submitting}
              type="button"
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-300 transition disabled:opacity-50"
            >
              ❌ Bekor qilish
            </button>
          </div>

          {/* Privacy Notice */}
          <p className="text-xs text-gray-500 text-center">
            💡 Sizning bahoyingiz admin tomonidan ko'rib chiqilgandan keyin e'lon qilinadi.
          </p>
        </div>
      </div>
    </div>
  );
}