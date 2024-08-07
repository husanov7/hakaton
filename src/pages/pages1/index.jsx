
import React, { useState } from "react";
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import { api } from "./../../axios";


const days = [
  { day: 'Пн', time: '8:00 - 23:00' },
  { day: 'Вт', time: '10:00 - 22:00' },
  { day: 'Ср', time: '11:00 - 21:00' },
  { day: 'Чт', time: '11:00 - 23:00' },
  { day: 'Пт', time: '10:00 - 23:00' },
  { day: 'Сб', time: '9:00 - 20:00' },
  { day: 'Вс', time: '12:00 - 00:00' },
];

export default function Onas() {
  const { t } = useTranslation("about");

  const [open, setOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(days[0]);
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");

  const newMessage = (e) => {
    e.preventDefault();
    api.post("/message", { nomi: name, nomer: number })
      .then(res => alert("bajarildi!"))
      .catch(err => alert("Error: " + err.message));
  }

  const handleOpen = () => setOpen(!open);

  return (
    <div className="container w-[500px] m-[auto]">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex flex-row justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">{t("name")}</h2>
            <p className="text-2xl font-bold mb-2"></p>
            <p className="text-gray-700 mb-4">
              {t("service")} <span className="text-[black]">1%</span>
            </p>
            <p className="text-gray-700 mb-4">
              {t("password")} <span className="text-[black]">null</span>
            </p>
          </div>
          <div>
            <img className="w-[200px]" src="https://dostavkainfo.uz/wp-content/uploads/2020/03/rayhon.jpg" alt="logo" />
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex flex-row gap-[195px] justify-between mb-4">
            <h1 >{t("mode")}</h1>
            <span >{selectedDay.time}</span>
          </div>
          <div className="flex space-x-2 mb-4">
            {days.map((dayItem) => (
              <button
                key={dayItem.day}
                onClick={() => setSelectedDay(dayItem)}
                className={`py-2 px-4 rounded ${selectedDay.day === dayItem.day ? 'bg-[#246253] text-white transition-all duration-500' : 'bg-gray-200'}`}
              >
                {dayItem.day}
              </button>
            ))}
          </div>
          <div className="modal pt-[10px]">
            <button className="w-[400px]  bg-[#246253] text-[white] h-[45px] rounded-[20px]" onClick={handleOpen}>{t("send")}</button>
            <Dialog open={open} handler={handleOpen}>
              <DialogHeader>Massage</DialogHeader>
              <DialogBody className="gap-[20px] flex flex-col">
                <form onSubmit={newMessage} className="flex flex-col gap-[10px]">
                 <div className="flex flex-row gap-[30px]">
                 <input
                    className="border-solid p-[5px] w-[100%] border-[1px] border-black rounded-[10px]"
                    type="text"
                    placeholder="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <input
                    className="border-solid p-[5px] w-[100%] border-[1px] border-black rounded-[10px]"
                    type="number"
                    placeholder="number"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                  />
                 </div>
                  <textarea
                    placeholder="message"
                    name="textarea"
                    className="w-[100%] p-[5px] border-solid border-[2px] border-black h-[100px] rounded-[10px]"
                  ></textarea>
                  <Button type="submit" variant="gradient" color="blue">
                    Send
                  </Button>
                </form>
              </DialogBody>
              <DialogFooter>
                <Button variant="text" color="red" onClick={handleOpen} className="mr-1">
                  <span>Cancel</span>
                </Button>
                <Button variant="gradient" color="blue" onClick={handleOpen}>
                  <span>Confirm</span>
                </Button>
              </DialogFooter>
            </Dialog>
          </div>
        </div>
        <div className="pt-[20px]">
          <p className="text-gray-700 mb-4">{t("location")} </p>
          <p className="text-black font-semibold mb-4 text-[20px]">{t("Aname")}</p>
        </div>
        <div className="space-y-2 p-[5px]">
          <div className="flex flex-row justify-between">
            <p className="text-gray-700">{t("admin")} </p>
            <p>+998 71 234 96 65</p>
          </div>
          <hr />
          <div className="flex flex-row justify-between p-[5px]">
            <p className="text-gray-700">{t("gmail")} </p>
            <p>rayhon@gmail.com</p>
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

