import React, { useEffect, useState, useRef } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';

import '../../css/stylesSlider.css';
import { EffectCoverflow, Autoplay, Pagination, FreeMode } from 'swiper/modules';


export default function Sliderdraw() {

    const { items } = usePage().props; // Ambil data item dari props Inertia
    const [isRunning, setIsRunning] = useState(false);
    const [winnerId, setWinnerId] = useState(null);
    const [popupVisible, setPopupVisible] = useState(false);
    const [swiperRef, setSwiperRef] = useState(null);

    useEffect(() => {
        if (swiperRef) {
            if (isRunning) {
                // swiperRef.autoplay.start();
                moveToWinSlide(swiperRef, 4);
            }else{
                // swiperRef.autoplay.stop();
            }
        }
    }, [isRunning]);

    const handleStart = () => {
        setIsRunning(prev => !prev);
        // if (!isRunning) {
        //     // Jika isRunning menjadi true, beri delay 5 detik sebelum memanggil fetchWinner
        //     setTimeout(() => {
        //         fetchWinner();
        //     }, 4000); 
        // }
    };

    // const handleStop = () => {
    //     setIsRunning(false);
    //     // fetchWinner(); // Ambil pemenang dari backend
    // };

    const moveToWinSlide = (swiper, targetIndex) => {
        const currentIndex = swiper.realIndex; // Mendapatkan slide yang sedang aktif
        const totalSlides = swiper.slides.length;
        console.log(currentIndex);
        console.log(totalSlides);

        
        
        if (targetIndex > currentIndex) {
            // Jika target index ada di depan current index
            swiper.slideToLoop(targetIndex, 5000);
        } else {
            // Jika target index ada di belakang, loop ke depan
            swiper.slideToLoop(totalSlides, 5000);
        }
    };


    const fetchWinner = async () => {
        const response = await fetch('/winner');
        const winner = await response.json();
        setWinnerId(winner.id); // Set indeks pemenang
        
        // setPopupVisible(true);
    };

    useEffect(() => {
        if (winnerId !== null && swiperRef) {
            const winnerIndex = items.findIndex(item => item.id === winnerId);
            console.log(winnerIndex);
            if (winnerIndex !== -1) {
                swiperRef.slideToLoop(winnerIndex, 5000); // Pindahkan slider ke slide pemenang
                setIsRunning(false);
                setPopupVisible(true);
            }else{
                setIsRunning(false);
                console.log("data pemenang tidak ditemukan");
            }
        }
    }, [winnerId, swiperRef]);

    return (
        <div className="max-w-6xl mx-auto py-16 text-center">
            <div className="flex justify-center space-x-4 mb-8">
                <button onClick={handleStart} className="px-4 py-2 bg-blue-500 text-white rounded-lg" >
                {isRunning ? 'Drawing...' : 'Draw'}
                </button>
            </div>
            <h1 className="text-3xl font-semibold text-gray-800">Tailus blocks leadership</h1>
            <p className="mt-4 text-gray-600">Tailus prides itself not only on award-winning technology, but also on the talent of its people of some of the brightest minds and most experienced executives in business.</p>
            <div className="mt-10">     
                <Swiper
                    effect={'coverflow'}
                    grabCursor={true}
                    centeredSlides={true}
                    coverflowEffect={{
                      rotate: 50,
                      stretch: 0,
                      depth: 100,
                      modifier: 1,
                      slideShadows: false,
                    }}
                    speed = {150}
                    onSwiper={setSwiperRef}
                    slidesPerView={3}
                    spaceBetween={20}
                    // freeMode={true}
                    loop={true}
                    // autoplay={isRunning ? {delay : 0} : false}
                    modules={[EffectCoverflow, Autoplay, FreeMode]}
                    className="mySwiper"
                >
                    {items.map((item, index) => (
                        <SwiperSlide key={item.id}>
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <img className="w-32 h-32 mx-auto rounded-full" src="https://placehold.co/128x128" alt="Portrait of Hentoni Doe, CEO-Founder" />
                                <h2 className="mt-4 text-xl font-semibold text-gray-800">{item.name}</h2>
                                <p className="mt-2 text-gray-600">{item.unit}</p>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* {popupVisible && winnerIndex !== null && items[winnerIndex] && (
                    <div className="popup">
                        <h2>Winner Details</h2>
                        <p>{items[winnerIndex].details}</p>
                        <button onClick={() => {
                            setPopupVisible(false);
                            window.location.reload();
                        }}>Close</button>
                    </div>
                )} */}
            </div>
        </div>
    )
}