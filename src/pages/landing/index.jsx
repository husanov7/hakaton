import { Button, Rating } from "@material-tailwind/react";
import React, { useState } from "react";
import Heart from "@react-sandbox/heart";
import './style.scss'

export default function Home() {
  const [active, setActive] = useState(false);

  return (
    <>
      <div className="home">
        <div className="title">
          <h1>Menu</h1>
        </div>
        <div className="cards">
          <div className="card">
            <div className="img">
              <img
                src="https://avatars.mds.yandex.net/i?id=3fe7c3024a5359e5ec7e2157907d7d629dc37814-10244527-images-thumbs&n=13"
                alt=""
              />
            </div>
            <div className="info">
              <Rating value={4} />
              <h1>Cheese-Burger</h1>
              <p className="w-[200px]">
               Lorem ipsum dolor sit amet  consectetur adipisicing <br /> elit. Rerum, possimus.
              </p>
              <div className="btns">
                <h2>15$</h2>
                <Heart
                className="heart"
                  width={24}
                  height={24}
                  active={active}
                  onClick={() => setActive(!active)}
                />
                <Button><i class="fa-solid fa-share"></i></Button>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="img">
              <img
                src="https://avatars.mds.yandex.net/i?id=3fe7c3024a5359e5ec7e2157907d7d629dc37814-10244527-images-thumbs&n=13"
                alt=""
              />
            </div>
            <div className="info">
              <Rating value={4} />
              <h1>Cheese-Burger</h1>
              <p className="w-[200px]">
               Lorem ipsum dolor sit amet  consectetur adipisicing <br /> elit. Rerum, possimus.
              </p>
              <div className="btns">
                <h2>15$</h2>
                <Heart
                className="heart"
                  width={24}
                  height={24}
                  active={active}
                  onClick={() => setActive(!active)}
                />
                <Button><i class="fa-solid fa-share"></i></Button>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="img">
              <img
                src="https://avatars.mds.yandex.net/i?id=3fe7c3024a5359e5ec7e2157907d7d629dc37814-10244527-images-thumbs&n=13"
                alt=""
              />
            </div>
            <div className="info">
              <Rating value={4} />
              <h1>Cheese-Burger</h1>
              <p className="w-[200px]">
               Lorem ipsum dolor sit amet  consectetur adipisicing <br /> elit. Rerum, possimus.
              </p>
              <div className="btns">
                <h2>15$</h2>
                <Heart
                className="heart"
                  width={24}
                  height={24}
                  active={active}
                  onClick={() => setActive(!active)}
                />
                <Button><i class="fa-solid fa-share"></i></Button>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="img">
              <img
                src="https://avatars.mds.yandex.net/i?id=3fe7c3024a5359e5ec7e2157907d7d629dc37814-10244527-images-thumbs&n=13"
                alt=""
              />
            </div>
            <div className="info">
              <Rating value={4} />
              <h1>Cheese-Burger</h1>
              <p className="w-[200px]">
               Lorem ipsum dolor sit amet  consectetur adipisicing <br /> elit. Rerum, possimus.
              </p>
              <div className="btns">
                <h2>15$</h2>
                <Heart
                className="heart"
                  width={24}
                  height={24}
                  active={active}
                  onClick={() => setActive(!active)}
                />
                <Button><i class="fa-solid fa-share"></i></Button>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="img">
              <img
                src="https://avatars.mds.yandex.net/i?id=3fe7c3024a5359e5ec7e2157907d7d629dc37814-10244527-images-thumbs&n=13"
                alt=""
              />
            </div>
            <div className="info">
              <Rating value={4} />
              <h1>Cheese-Burger</h1>
              <p className="w-[200px]">
               Lorem ipsum dolor sit amet  consectetur adipisicing <br /> elit. Rerum, possimus.
              </p>
              <div className="btns">
                <h2>15$</h2>
                <Heart
                className="heart"
                  width={24}
                  height={24}
                  active={active}
                  onClick={() => setActive(!active)}
                />
                <Button><i class="fa-solid fa-share"></i></Button>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="img">
              <img
                src="https://avatars.mds.yandex.net/i?id=3fe7c3024a5359e5ec7e2157907d7d629dc37814-10244527-images-thumbs&n=13"
                alt=""
              />
            </div>
            <div className="info">
              <Rating value={4} />
              <h1>Cheese-Burger</h1>
              <p className="w-[200px]">
               Lorem ipsum dolor sit amet  consectetur adipisicing <br /> elit. Rerum, possimus.
              </p>
              <div className="btns">
                <h2>15$</h2>
                <Heart
                className="heart"
                  width={24}
                  height={24}
                  active={active}
                  onClick={() => setActive(!active)}
                />
                <Button><i class="fa-solid fa-share"></i></Button>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="img">
              <img
                src="https://avatars.mds.yandex.net/i?id=3fe7c3024a5359e5ec7e2157907d7d629dc37814-10244527-images-thumbs&n=13"
                alt=""
              />
            </div>
            <div className="info">
              <Rating value={4} />
              <h1>Cheese-Burger</h1>
              <p className="w-[200px]">
               Lorem ipsum dolor sit amet  consectetur adipisicing <br /> elit. Rerum, possimus.
              </p>
              <div className="btns">
                <h2>15$</h2>
                <Heart
                className="heart"
                  width={24}
                  height={24}
                  active={active}
                  onClick={() => setActive(!active)}
                />
                <Button><i class="fa-solid fa-share"></i></Button>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="img">
              <img
                src="https://avatars.mds.yandex.net/i?id=3fe7c3024a5359e5ec7e2157907d7d629dc37814-10244527-images-thumbs&n=13"
                alt=""
              />
            </div>
            <div className="info">
              <Rating value={4} />
              <h1>Cheese-Burger</h1>
              <p className="w-[200px]">
               Lorem ipsum dolor sit amet  consectetur adipisicing <br /> elit. Rerum, possimus.
              </p>
              <div className="btns">
                <h2>15$</h2>
                <Heart
                className="heart"
                  width={24}
                  height={24}
                  active={active}
                  onClick={() => setActive(!active)}
                />
                <Button><i class="fa-solid fa-share"></i></Button>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="img">
              <img
                src="https://avatars.mds.yandex.net/i?id=3fe7c3024a5359e5ec7e2157907d7d629dc37814-10244527-images-thumbs&n=13"
                alt=""
              />
            </div>
            <div className="info">
              <Rating value={4} />
              <h1>Cheese-Burger</h1>
              <p className="w-[200px]">
               Lorem ipsum dolor sit amet  consectetur adipisicing <br /> elit. Rerum, possimus.
              </p>
              <div className="btns">
                <h2>15$</h2>
                <Heart
                className="heart"
                  width={24}
                  height={24}
                  active={active}
                  onClick={() => setActive(!active)}
                />
                <Button><i class="fa-solid fa-share"></i></Button>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="img">
              <img
                src="https://avatars.mds.yandex.net/i?id=3fe7c3024a5359e5ec7e2157907d7d629dc37814-10244527-images-thumbs&n=13"
                alt=""
              />
            </div>
            <div className="info">
              <Rating value={4} />
              <h1>Cheese-Burger</h1>
              <p className="w-[200px]">
               Lorem ipsum dolor sit amet  consectetur adipisicing <br /> elit. Rerum, possimus.
              </p>
              <div className="btns">
                <h2>15$</h2>
                <Heart
                className="heart"
                  width={24}
                  height={24}
                  active={active}
                  onClick={() => setActive(!active)}
                />
                <Button><i class="fa-solid fa-share"></i></Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
