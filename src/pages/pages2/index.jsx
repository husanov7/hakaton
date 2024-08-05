import { useState } from "react";
import { setOrder } from "../../utils/zustand";
import { useTranslation } from "react-i18next";
import { api } from "../../axios";

const Cart = () => {
  const { order, delOrder } = setOrder();
  const { t } = useTranslation("base");

  const getTableNumber = () => {
    return localStorage.getItem("tableNumber") || 1;
  };

  
  const all = order.reduce((sum, item) => sum + item.price * item.count, 0);
  
  
  const serviceFee = 0.1; 
  const serviceCharge = all * serviceFee;

  const totalAmount = all + serviceCharge;

  const placeOrder = () => {
    const tableNumber = getTableNumber();
    api.post("/zakaz", { menu: order, stol: tableNumber })
      .then(() => {
        delOrder();  
      })
      .catch((error) => {
        console.error("Error placing order:", error);
      });
  };

  return (
    <div className="p-4">
      <div className="text-center">
        <h2 className="text-xl font-bold mb-4">{t("korzina", "Корзина")}</h2>
      </div>
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-4">
        {order.map((dish, index) => (
          <div key={index} className="flex items-center mb-4">
            <img
              src={dish.imageUrl}
              alt={dish.title}
              className="w-24 h-20 rounded-lg mr-4"
            />
            <div className="flex-1">
              <h3 className="text-lg font-medium">{dish.title}</h3>
              <p className="text-gray-500">{dish.count}</p>
              <p className="text-gray-500">
                {dish.price.toLocaleString()} UZS
              </p>
            </div>
          </div>
        ))}
        <div className="mt-4">
          <p className="mb-2">
            {t("price", "Price")} {all.toLocaleString()} UZS
          </p>
          <p className="mb-2">
            {t("servic", "Service Fee")} {serviceCharge.toLocaleString()} UZS
          </p>
          <p className="font-bold mb-4">
            {t("order", "Total")} {totalAmount.toLocaleString()} UZS
          </p>
          <button
            onClick={placeOrder}
            className="w-full bg-[#246253] text-white py-2 rounded-md"
          >
            {t("order_button", "Place Order")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
