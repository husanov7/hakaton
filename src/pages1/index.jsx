

import React, { useState } from "react";
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader } from "@material-tailwind/react";
import api from "../axios"; // Correct the path if axios.js is in a different directory
import { useTranslation } from "react-i18next";

const days = [
  { day: "Пн", time: "8:00 - 23:00" },
  { day: "Вт", time: "10:00 - 22:00" },
  { day: "Ср", time: "11:00 - 21:00" },
  { day: "Чт", time: "11:00 - 23:00" },
  { day: "Пт", time: "10:00 - 23:00" },
  { day: "Сб", time: "9:00 - 20:00" },
  { day: "Вс", time: "12:00 - 00:00" },
];

export default function Onas() {
  const [open, setOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(days[0]);
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [message, setMessage] = useState("");

  const newMessage = (e) => {
    e.preventDefault();
    api.post("/message", { nomi: name, nomer: number, message:message })
      .then(res => alert("bajarildi!"))
      .catch(err => alert("Error: " + err.message));
  }

  const handleOpen = () => setOpen(!open);

  return (
    <div className="container w-[500px] m-[auto] md:[300px] "> 
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex flex-row justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Qamish Xorazm</h2>
            <p className="text-2xl font-bold mb-2">Taomlari</p>
            <p className="text-gray-700 mb-4">
              Обслуживание: <span className="text-[black]">1%</span>
            </p>
            <p className="text-gray-700 mb-4">
              Пароль от Wi-Fi: <span className="text-[black]">null</span>
            </p>
          </div>
          <div>
            <img className="w-[200px]" src="http://giotto.uz/wp-content/uploads/2018/09/logo.png" alt="logo" />
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex flex-row gap-[195px] justify-between mb-4">
            <h1>Режим работы:</h1>
            <span>{selectedDay.time}</span>
          </div>
          <div className="flex flex-wrap justify-center mb-4 gap-2">
            {days.map((dayItem) => (
              <button
                key={dayItem.day}
                onClick={() => setSelectedDay(dayItem)}
                className={`py-2 px-4 rounded ${
                  selectedDay.day === dayItem.day
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {dayItem.day}
              </button>
            ))}
          </div>
          <div className="modal pt-[10px]">
            <button className="w-[400px] bg-blue-500 text-[white] h-[45px] rounded-[20px]" onClick={handleOpen}>собшите нам</button>
            <Dialog open={open} handler={handleOpen}>
              <DialogHeader>Massage</DialogHeader>
              <DialogBody className="gap-[20px] flex flex-col">
                <form onSubmit={newMessage} className="flex flex-col gap-[10px]">
                  <div className="flex flex-row gap-[30px]">
                    <input
                      className="border-solid p-2 w-full border border-black rounded-xl"
                      type="text"
                      placeholder="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <input
                      className="border-solid p-2 w-full border border-black rounded-xl"
                      type="number"
                      placeholder="number"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                    />
                  </div>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="message"
                    name="textarea"
                    className="w-full p-2 border-solid border-2 border-black h-24 rounded-xl"
                  ></textarea>
                  <Button type="submit" variant="gradient" color="blue">
                    {t('send')}
                  </Button>
                </form>
              </DialogBody>
              <DialogFooter>
                <Button
                  variant="text"
                  color="red"
                  onClick={handleOpen}
                  className="mr-1"
                >
                  <span>Cancel</span>
                </Button>
                <Button variant="gradient" color="blue" onClick={handleOpen}>
                  <span>Confirm</span>
                </Button>
              </DialogFooter>
            </Dialog>
          </div>
        </div>
        <div className="pt-4">
          <p className="text-gray-700 mb-4">Адрес: </p>
          <p className="text-black font-semibold mb-4 text-[20px]">ул. Мукуми 200</p>
        </div>
        <div className="space-y-2 p-2">
          <div className="flex flex-row justify-between">
            <p className="text-gray-700">Администратор: </p>
            <p>+998 71 234 96 65</p>
          </div>
          <hr />
          <div className="flex flex-row justify-between p-2">
            <p className="text-gray-700">Наш gmail: </p>
            <p>giottoilgelato@gmail.com</p>
          </div>
          <hr />
          <a href="https://www.instagram.com/m1rkomilovv/?next=%2F" className="text-blue-500 p-[5px]">
            Instagram
          </a>
        </div>
        <hr />
      </div>
    </div>
  );
}

