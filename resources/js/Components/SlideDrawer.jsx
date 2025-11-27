import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Autoplay, Pagination, FreeMode } from 'swiper/modules';
import { usePage } from '@inertiajs/react';
import React, { forwardRef, useEffect, useRef, useState, useCallback } from 'react';




import 'swiper/swiper-bundle.css';
import '../../css/stylesSlider.css';

const SlideDrawer = forwardRef(function SlideDrawer(props, ref) {
    const {participants} = usePage().props
    return (
        <>
        <h1 className="text-2xl">Konten Div Kedua</h1>
        <Swiper
            onSwiper={(swiper) => (ref.current = swiper)} // Menyimpan instance Swiper
            loop={true}
            speed={70}
            // autoplay={{
            //     delay: 0,
            //     disableOnInteraction: false,
            // }}
            effect={'coverflow'}
            coverflowEffect={{
                rotate: 30,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: false,
            }}
            centeredSlides={true}
            slidesPerView={4}
            spaceBetween={20}
            modules={[EffectCoverflow, Autoplay, FreeMode]}
            className="mySwiper"
        >
            {participants.map((participant, index) => (
                <SwiperSlide key={participant.id}>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <img className="w-32 h-32 mx-auto rounded-full" src="https://placehold.co/128x128" alt="Portrait of Hentoni Doe, CEO-Founder" />
                        <h2 className="mt-4 text-xl font-semibold text-gray-800">{participant.name}</h2>
                        <p className="mt-2 text-gray-600">{participant.unit}</p>
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
        </>
    )
})

export default SlideDrawer;
