import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import img1 from "../assets/carreras/carrera1.jpg"
import img2 from "../assets/carreras/carrera2.jpg"
import img3 from "../assets/carreras/carrera3.jpg"
import img4 from "../assets/carreras/carrera4.jpg"
import img5 from "../assets/patrocinios/TS360.jpg"

export default function Patrocinios() {
  const imagenes = [img1, img2, img3, img4, img5];

  return (
    <section className="bg-gradient-to-r from-green-600 via-lime-500 to-yellow-400 shadow-lg sticky top-0 z-50" id="galeria">
      <div className="text-center">
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 3000 }}
          pagination={{ clickable: true }}
          className="shadow-xl overflow-hidden h-24 sm:h-28 md:h-32 flex items-center justify-center"
        >
          {imagenes.map((src, index) => (
            <SwiperSlide key={index} className="flex items-center justify-center p-2">
              <img
                src={src}
                alt={`Patrocinio ${index + 1}`}
                className="object-contain max-h-20 sm:max-h-24 md:max-h-28 max-w-full mx-auto border-2 sm:border-4 border-white shadow-lg rounded"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}