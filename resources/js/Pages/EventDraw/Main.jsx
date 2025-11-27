import { ToastContainer, toast } from 'react-toastify'
import { Head, router, usePage, useForm } from '@inertiajs/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Autoplay, FreeMode } from 'swiper/modules';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import axios from 'axios'
import { motion } from 'framer-motion';

import 'react-toastify/dist/ReactToastify.css';
import 'swiper/swiper-bundle.css';
import '../../../css/stylesSlider.css';
import Popup from '@/Components/Popup';

export default function Main(props) {
  const { participants, event, flash } = props

  const swiperRef = useRef(null);

  const [showSwiper, setShowSwiper] = useState(false);
  const [_winner, setWinner] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);

  const [giftData, setGiftData] = useState(null);
  const [drawTime, setDrawTime] = useState(1000);
  const [noQuota, setNoQuota] = useState(false);
  const [currentGift, setCurrentGift] = useState(0);

  const { data, setData, post, processing, errors } = useForm({
    event_id: event.id,
    gift_id: null,
    participant_id: null,
  })

  useEffect(() => {
    if (flash.message !== null) {
      toast(flash.message.message, { type: flash.message.type })
    }
  }, [flash])


  const fetchWinner = useCallback(() => {
    axios.get(route('api.draw.main', { event }), {
      headers: {
        "Content-Type": 'application/json'
      }
    })
      .then((response) => {
        if (!response.data || response.data.length === 0) {
          console.log('Semua peserta sudah menang');
          return;
        }
        setWinner(response.data);
      })
      .catch((err) => {
        alert(err);
      });
  }, [event]);

  const fetchGift = () => {
    axios.get(
      route('api.gift.index', {
        event_id: event.id,
      }), {
      headers: {
        "Content-Type": 'application/json',
      }
    }
    )
      .then((response) => {
        setGiftData(response.data)
        setData('gift_id', response.data[currentGift].id)
        setDrawTime(response.data[currentGift].draw_time)
        setNoQuota(response.data[currentGift].result_count >= response.data[currentGift].quota ? true : false);
      })
      .catch((err) => {
        alert(err)
      });
  }

  const handleSlideToWin = useCallback(() => {
    if (swiperRef.current && _winner) {
      const winnerIndex = participants.findIndex(item => item.employee_code === _winner.employee_code);
      swiperRef.current.autoplay.stop();
      swiperRef.current.slideToLoop(winnerIndex, 1000, true);
      setIsRunning(false);
      setData('participant_id', _winner.id)
      setTimeout(() => {
        openPopup();
        playSoundWin();
      }, 1500)
    }
  }, [_winner, participants]);

  useEffect(() => {
    if (swiperRef.current) {
      if (isRunning) {
        swiperRef.current.autoplay.stop();
        setTimeout(() => {
          swiperRef.current.autoplay.start();
          setTimeout(() => {
            if (_winner) {
              handleSlideToWin(); // Panggil slideToWin jika _winner tidak null
            }
          }, drawTime);
        }, 1500);
      } else {
        swiperRef.current.autoplay.stop();
      }
    }
  }, [isRunning]);

  useEffect(() => {
    if (_winner) {
      setShowSwiper(true);
      setIsRunning(true);
    }
  }, [_winner])

  const handleStart = useCallback(() => {
    if (giftData && giftData[currentGift].result_count >= giftData[currentGift].quota) {
      console.log('Kuota Hadiah Habis')
      return
    }
    fetchWinner();
  }, [_winner, fetchWinner, data]);

  useEffect(() => {
    if (giftData) {
      setData('gift_id', giftData[currentGift]?.id)
      setDrawTime(giftData[currentGift].draw_time)
      setNoQuota(giftData[currentGift].quota_count === 0 ? true : false);
    } else {
      fetchGift();
    }
  }, [currentGift]);


  const nextHadiah = () => {
    if (currentGift < giftData.length - 1) {
      setCurrentGift(currentGift + 1);
      setShowSwiper(false);
    } else {
      // Redirect to another route when Finish is clicked
      router.get(route('draw.show', event)) // Replace '/some-other-route' with your desired route
    }
  };

  const previousHadiah = () => {
    setCurrentGift((prev) => (prev > 0 ? prev - 1 : 0));
    setShowSwiper(false);
  };


  const openPopup = () => {
    setPopupVisible(true);
  };

  const closePopup = () => {
    post(route('draw.update.main', _winner), {
      onSuccess: () => {
        setPopupVisible(false);
        setShowSwiper(false);
        setWinner(null);
      }
    })
  };


  const saveWinner = () => {
    post(route('draw.store.main', event), {
      onSuccess: () => {
        fetchGift();
        setPopupVisible(false);
        setShowSwiper(false);
        setWinner(null);
      }
    });
  };

  // Referensi untuk audio element
  const audioRef = useRef(null);
  const audioWinRef = useRef(null);

  // Fungsi untuk memutar suara saat slide berubah
  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3; // Set volume backsound
      audioRef.current.currentTime = 0; // Reset suara ke awal
      audioRef.current.play(); // Mainkan suara
    }
  };

  const playSoundWin = () => {
    if (audioWinRef.current) {
      audioRef.current.volume = 0.4; // Set volume backsound
      audioWinRef.current.currentTime = 0; // Reset suara ke awal
      audioWinRef.current.play(); // Mainkan suara
    }
  };


  return (
    <>
      <Head title="Draw" />

      <div className="flex items-center justify-center h-screen">

        {/* Kontainer utama */}
        <div className={`w-full h-full flex flex-col items-center ${showSwiper ? 'justify-center h-screen' : 'justify-center'} ${event.image_url ? 'bg-cover bg-center h-full' : ''}`} style={{ backgroundImage: `url(${event.image_url})` }}>
          {/* Div Image */}
          {giftData && (
            <>
              <motion.div
                className="box"
                animate={{
                  scale: [0.5, 1.5, 1.5, 1, 1],
                  borderRadius: ["0%", "0%", "50%", "50%", "0%"]
                }}
                transition={{
                  duration: 2,
                  ease: "easeInOut",
                  times: [0.2, 0.2, 0.5, 0.8, 1],
                }}
              >
                <div className="flex flex-col items-center max-w-xs  bg-white rounded-lg shadow-lg">
                  <div className="relative">
                    <img
                      src={giftData[currentGift]?.image_url}
                      alt="Example Image"
                      className="w-full h-56 object-cover rounded-t-lg"
                    />
                    {/* <div className="absolute inset-0 bg-black opacity-25 rounded-t-lg"></div> */}
                  </div>
                  <div className="text-center my-3">
                    <h2 className="text-lg font-semibold text-gray-700">{giftData[currentGift]?.name}</h2>
                  </div>
                </div>
              </motion.div>

              <div className="flex justify-center space-x-4 mt-4">
				{currentGift !== 0 ? <button onClick={previousHadiah} className="bg-blue-500 shadow-lg shadow-blue-500/50 text-white px-10 py-2 rounded-3xl" disabled={isRunning}>
                  PREV
                </button> : ''}
                <button onClick={handleStart} className={`px-10 py-2 font-medium ${processing || noQuota ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-500"
                  } text-white w-fit transition-all shadow-[3px_3px_0px_black] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] rounded-2xl`} disabled={isRunning || processing || noQuota}>
                  {isRunning ? 'Drawing...' : 'DRAW'}
                </button>

                <button onClick={nextHadiah} className="bg-blue-500 shadow-lg shadow-blue-500/50 text-white px-10 py-2 rounded-3xl" disabled={isRunning}>
                  {currentGift === giftData.length - 1 ? 'Finish' : 'Next'}
                </button>
              </div>
              
            </>
          )}



          {/* Div Swiper yang muncul saat `showSwiper` true */}
          {showSwiper && (
            <div className="w-full max-w-screen-xl text-center mt-5">
              {/* <h1 className="text-xl text-center">Find the Winner!!</h1> */}
              <Swiper
                onSwiper={(swiper) => (swiperRef.current = swiper)} // Menyimpan instance Swiper
                onSlideChange={playSound}
                loop={true}
                speed={100}
                autoplay={{
                  delay: 0,
                  disableOnInteraction: false,
                }}
                effect={'coverflow'}
                coverflowEffect={{
                  rotate: 35,
                  stretch: 0,
                  depth: 50,
                  modifier: 1,
                  slideShadows: false,
                }}
                breakpoints={{
                  320: {
                    slidesPerView: 2,  // 2 slide di layar kecil
                  },
                  768: {
                    slidesPerView: 3,  // 3 slide di tablet
                  },
                  1024: {
                    slidesPerView: 4,  // 4 slide di desktop
                  },
                }}
                // lazy={true} // Mengaktifkan lazy loading
                centeredSlides={true}
                slidesPerView={4}
                spaceBetween={30}
                modules={[EffectCoverflow, Autoplay, FreeMode]}
                className="mySwiper"
              >
                {participants.map((participant, index) => (
                  <SwiperSlide key={index}>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <img className="w-32 h-36 object-cover rounded-lg shadow-lg mx-auto" src={participant.image_url ? participant.image_url : "/uploads/128x128.svg"} alt="Participant Image" loading="lazy"/>
                      <h2 className="mt-4 text-xl font-semibold text-gray-800">{participant.name}</h2>
                      <p className="mt-2 text-gray-600">{participant.unit}</p>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
          <audio ref={audioRef} src="/sounds/test-sound5.wav" preload="auto"></audio>
        </div>

        <div>
          {/* Popup untuk menampilkan detail pemenang */}
          <Popup
            isOpen={popupVisible}
            onClose={closePopup}
            onSave={saveWinner}
            winnerDetails={_winner !== null ? _winner : ''}
          />
          <audio ref={audioWinRef} src="/sounds/win-sound.wav" preload="auto"></audio>
        </div>

      </div>
    </>
  )
}