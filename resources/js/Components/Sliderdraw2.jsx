import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { ToastContainer, toast } from 'react-toastify'
import { isEmpty } from 'lodash'
import 'swiper/swiper-bundle.css';
// import 'swiper/css/autoplay';

import '../../css/stylesSlider.css';
import { EffectCoverflow, Autoplay, Pagination, FreeMode } from 'swiper/modules';


export default function Sliderdraw2() {
    const { participants, event, flash } = usePage().props;

    const [isRunning, setIsRunning] = useState(false);
    const [showSwiper, setShowSwiper] = useState(false);
    const [_winner, setWinner] = useState(null);

    const swiperRef = useRef(null);

    const fetchWinner = useCallback(() => {
        axios.get(route('api.draw.main', { event }), {
            headers: {
                "Content-Type": 'application/json'
            }
        })
        .then((response) => {
            if (!response.data || response.data.length === 0) {
                toast.error('Semua peserta sudah menang');
                return;
            }
            setWinner(response.data);
        })
        .catch((err) => {
            alert(err);
        });
    }, [event]);

    const handleSlideToWin = useCallback(() => {
        if (swiperRef.current && _winner) {
            const winnerIndex = participants.findIndex(item => item.employee_code === _winner.employee_code);
            swiperRef.current.autoplay.stop();
            swiperRef.current.slideToLoop(winnerIndex, 1000, true);
            setIsRunning(false);
        }
    }, [_winner, participants]);

    useEffect(() => {
        if (swiperRef.current) {
            if (isRunning) {
                swiperRef.current.autoplay.start();
                console.log(_winner);
                setTimeout(() => {
                    handleSlideToWin();
                }, 3000);
            } else {
                swiperRef.current.autoplay.stop();
            }
        }
    }, [isRunning]);

    const handleStart = useCallback(() => {
        if (!_winner) fetchWinner();
        setShowSwiper(true);
        console.log('ini ke triger 1x');
        setIsRunning(true);
    }, [_winner, fetchWinner]);

    useEffect(() => {
        fetchWinner();
    }, []);

    return (
        <div className="max-w-6xl mx-auto text-center">
            <div className="flex justify-center space-x-4 mb-8">
                <button onClick={handleStart} className="bg-blue-500 text-white px-4 py-2 rounded" >
                {isRunning ? 'Drawing...' : 'DRAW'}
                </button>
            </div>
            <h1 className="text-3xl font-semibold text-gray-800">Find The Winner !!!</h1>
            <div className="mt-10">     
                { showSwiper && (
                    <Swiper
                        onSwiper={(swiper) => (swiperRef.current = swiper)} // Menyimpan instance Swiper
                        loop={true}
                        speed={70}
                        autoplay={{
                            delay: 0,
                            disableOnInteraction: false,
                        }}
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
                )}
                

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
            <ToastContainer />
        </div>
    )
}