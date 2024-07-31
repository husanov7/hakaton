import {
  Button,
  Rating,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import Heart from "@react-sandbox/heart";
import "./style.scss";
import { api } from "../../axios";
import { setOrder } from "../../utils/zustand";

export default function Home() {
  const [active, setActive] = useState(false);
  const [menu, setMenu] = useState([]);
  useEffect(() => {
    api.get("/dish").then((r) => setMenu(r.data));
  }, []);
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(!open);

  console.log(menu);
  const [quantity, setQuantity] = useState(1);
  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const {addOrder} = setOrder()


  function sendOrder(dish){
    addOrder(dish)
    alert('yeees')
    console.log(dish);
  }


  return (
    <>
      <div className="home">
        <div className="title">
          <h1>Menu</h1>
        </div>
        <div className="cards">
          {menu.map((dish) => {
            return (
              <div key={dish._id}>
                <div  className="card">
                  <div className="img">
                    <img src={dish.imageUrl} alt={dish.title} />
                  </div>
                  <div className="info">
                    <Rating value={4} />
                    <h1>{dish.title}</h1>
                    <p className="w-[200px]">{dish.introduction}</p>
                    <div className="btns">
                      <h2>{dish.price}uzs</h2>
                      <Heart
                        className="heart"
                        width={24}
                        height={24}
                        active={active}
                        onClick={() => setActive(!active)}
                      />
                      <Button onClick={handleOpen}>
                        <i class="fa-solid fa-share"></i>
                      </Button>
                    </div>
                  </div>
                </div>
                <Dialog open={open} handler={handleOpen}>
                  <DialogHeader>{dish.title}</DialogHeader>
                  <DialogBody>{dish.introduction}</DialogBody>
                  <img
                    className="w-[95%] m-auto rounded-[10px]"
                    src={dish.imageUrl}
                    alt=""
                  />
                  <DialogFooter>
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
                    <Button
                      variant="text"
                      color="red"
                      onClick={handleOpen}
                      className="mr-1"
                    >
                      <span>Cancel</span>
                    </Button>
                    <Button
                      variant="gradient"
                      color="green"
                      onClick={(dish) => {
                        sendOrder(dish)
                         
                      }}
                    >
                      <span>ORder</span>
                    </Button>
                  </DialogFooter>
                </Dialog>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
