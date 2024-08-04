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
import Card from "../../components/card/card";

export default function Home() {
  // const [active, setActive] = useState(false);
  const [menu, setMenu] = useState([]);
  useEffect(() => {
    api.get("/dish").then((r) => setMenu(r.data));
  }, []);
  // const [open, setOpen] = React.useState(false);

  // const handleOpen = () => setOpen(!open);

  // console.log(menu);
  // const [quantity, setQuantity] = useState(1);
  // const incrementQuantity = () => {
  //   setQuantity(quantity + 1);
  // };

  // const decrementQuantity = () => {
  //   if (quantity > 1) {
  //     setQuantity(quantity - 1);
  //   }
  // };

  // const {addOrder} = setOrder()


  // function sendOrder(dish){
  //   addOrder(dish)
  //   alert('yeees')
  //   console.log(dish);
  // }


  return (
    <>
      <div className="home">
        <div className="title">
          <h1>Menu</h1>
        </div>
        <div className="cards">
          {menu.map((dish) => {
            return (
              <Card key={dish._id} dish={dish} />
            );
          })}
        </div>
      </div>
    </>
  );
}
