import { useState } from "react";

const Cart = () => {
  const [quantity, setQuantity] = useState(1);
  const price = 45000;
  const serviceFee = 0.1;

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const totalPrice = price * quantity;
  const serviceCharge = totalPrice * serviceFee;
  const finalPrice = totalPrice + serviceCharge;

  return (
    <>
      <div className="p-[10px]">
        <h2 className="text-xl text-center font-bold mb-4">Корзина</h2>
      </div>
      <div className="p-4 max-w-md m-auto bg-white rounded-lg border-solid border-[1px] border-[] shadow-lg shadow-[#ccc]">
        <div className="flex items-center mb-4">
          <img
            src="https://avatars.mds.yandex.net/i?id=b93ecc6734ad42feec9730a3a42ca448884bd1283ab973b0-12643411-images-thumbs&n=13"
            alt="Product Image"
            className="w-[150px] h-[120px] rounded-[20px] mr-4"
          />
          <div className="flex-1">
            <h3 className="text-lg">Burger</h3>
            <p className="text-gray-500">{price.toLocaleString()} UZS</p>
          </div>
          <div className="flex items-center">
            <button
              className="bg-gray-300 text-gray-700 p-[13px] py-1 rounded"
              onClick={decrementQuantity}
            >
              -
            </button>
            <span className="mx-2">{quantity}</span>
            <button
              className="bg-gray-300 text-gray-700 p-[13px] py-1 rounded"
              onClick={incrementQuantity}
            >
              +
            </button>
          </div>
        </div>
        <div>
          <p className="mb-1 p-[5px]">
            Сумма заказа: {totalPrice.toLocaleString()} UZS
          </p>
          <p className="mb-1 p-[5px]">
            Обслуживание 10%: {serviceCharge.toLocaleString()} UZS
          </p>
          <p className="font-bold p-[5px]">
            Итоговая сумма заказа: {finalPrice.toLocaleString()} UZS
          </p>
        </div>
      </div>
    </>
  );
};

export default Cart;
