// import { useState } from "react";
// import { setOrder } from "../../utils/zustand";
// import "./style.scss";

// export default function Card({ dish }) {
//   const { addOrder } = setOrder();
//   const [count, setCount] = useState(1);

//   const incrementQuantity = () => {
//     setCount(count + 1);
//   };

//   const decrementQuantity = () => {
//     setCount(count > 1 ? count - 1 : 1); // Prevent count from going below 1
//   };

//   return (
//     <div className="menu p-4">
//       <div className="max-w-sm mx-auto bg-white shadow-lg rounded-lg overflow-hidden md:max-w-md lg:max-w-lg">
//         <img
//           className="w-full h-48 object-cover"
//           src={dish.imageUrl}
//           alt={dish.title}
//         />
//         <div className="p-4">
//           <h1 className="text-xl md:text-2xl font-bold mb-4">{dish.title}</h1>
//           <div className="flex gap-2 items-center mb-4">
//             <button
//               className="px-3 py-1 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition"
//               onClick={decrementQuantity}
//             >
//               -
//             </button>
//             <h5 className="text-lg font-medium">{count}</h5>
//             <button
//               className="px-3 py-1 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition"
//               onClick={incrementQuantity}
//             >
//               +
//             </button>
//           </div>
//           <button
//             className="w-full py-2 bg-[#004332] text-white rounded-md hover:bg-[#004332] transition"
//             onClick={() => addOrder({ ...dish, count })}
//           >
//             Add to Order
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }




import { useState } from "react";
import { setOrder } from "../../utils/zustand";
import "./style.scss";

export default function Card({ dish }) {
  const { addOrder } = setOrder();
  const [count, setCount] = useState(1);

  const incrementQuantity = () => {
    setCount(count + 1);
  };

  const decrementQuantity = () => {
    setCount(count > 1 ? count - 1 : 1); // Prevent count from going below 1
  };

  return (<>
      <div className="max-w-sm mx-auto bg-white shadow-lg rounded-lg overflow-hidden  grid grid-cols-1">
        <img
          className="w-full h-48 object-cover"
          src={dish.imageUrl}
          alt={dish.title}
        />
        <div className="content p-4">
          <h1 className="text-xl md:text-2xl font-bold mb-2">{dish.title}</h1>
          <p className="text-lg text-gray-700 mb-4">
            {dish.price?.toLocaleString()} UZS
          </p>
          <div className="quantity-controls flex gap-2 items-center mb-4">
            <button
              className="px-3 py-1 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition"
              onClick={decrementQuantity}
            >
              -
            </button>
            <h5 className="text-lg font-medium">{count}</h5>
            <button
              className="px-3 py-1 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition"
              onClick={incrementQuantity}
            >
              +
            </button>
          </div>
          <button
            className="add-to-order-button w-full py-2"
            onClick={() => addOrder({ ...dish, count })}
          >
            Add to Order
          </button>
        </div>
      </div>
      
    </>
  );
}
