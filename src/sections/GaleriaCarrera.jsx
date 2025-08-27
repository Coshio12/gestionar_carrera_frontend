import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import img1 from "../assets/carreras/carrera1.jpg"
import img2 from "../assets/carreras/carrera2.jpg"
import img3 from "../assets/carreras/carrera3.jpg"
import img4 from "../assets/carreras/carrera4.jpg"

export default function GaleriaCarrera() {
  const imagenes = [img1, img2, img3, img4];

  return (
    <section className="bg-white py-8 sm:py-10 md:py-12 px-4" id="galeria">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-700 mb-6 sm:mb-8">
          Carreras Anteriores 🚴‍♀️
        </h2>

        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 3000 }}
          pagination={{ clickable: true }}
          className="rounded-2xl shadow-xl overflow-hidden"
        >
          {imagenes.map((src, index) => (
            <SwiperSlide key={index}>
              <img
                src={src}
                alt={`Carrera ${index + 1}`}
                className="w-full h-[250px] sm:h-[350px] md:h-[400px] lg:h-[450px] object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}