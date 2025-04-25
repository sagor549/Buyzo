import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import cloth from "/assets/cloth.jpg"
import food from "/assets/food.jpg"
import makeup from "/assets/makeup.png"
import pc from "/assets/pc.jpg"
import shampoo from "/assets/shampoo.png"
import uber from "/assets/uber.jpg"

const ImageAuto = () => {
  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 3000 }}
      loop={true}
      className="w-full h-64"
    >
      <SwiperSlide>
        <img src={cloth} alt="Fashion" />
      </SwiperSlide>
      <SwiperSlide>
        <img src={food} alt="Fashion" />
      </SwiperSlide>
      <SwiperSlide>
        <img src={makeup} alt="Fashion" />
      </SwiperSlide>
      <SwiperSlide>
        <img src={pc} alt="Fashion" />
      </SwiperSlide>
      <SwiperSlide>
        <img src={shampoo} alt="Fashion" />
      </SwiperSlide>
      <SwiperSlide>
        <img src={uber} alt="Fashion" />
      </SwiperSlide>
      
    </Swiper>
  );
};

export default ImageAuto;
