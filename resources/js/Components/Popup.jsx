import React from 'react';
import { motion } from 'framer-motion';

import '../../css/Popup.css';
import defaultAvatar from '../../../public/p-avatar.jpg';


const Popup = ({ isOpen, onClose, onSave, winnerDetails }) => {
  const variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1.8 },
  };

  return (
    <>
      {isOpen && (
        <div className="popup-overlay">
          <motion.div
            className="popup-content"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={variants}
            // Mencegah klik di dalam popup menutupnya
          >
            <div className="bg-white font-semibold text-center rounded-3xl border shadow-lg p-14 max-w-md">
              <h1 className="text-xl text-gray-600 mb-4"> Selamat Kepada Pemenang! </h1>
              <img className="mb-3 w-40 h-40 object-cover rounded-lg shadow-lg mx-auto" src={winnerDetails.image_url ? winnerDetails.image_url : defaultAvatar} alt="product designer" />
              <h1 className="text-xl text-gray-700"> {winnerDetails.name} </h1>
              <h3 className="text-lg text-gray-500 "> {winnerDetails.unit} </h3>
              <div className="flex justify-center gap-4 mt-4">
                <button onClick={onSave} className="bg-indigo-600 px-6 py-2 rounded-3xl text-gray-100 font-semibold uppercase tracking-wide">Save</button>
                <button onClick={onClose} className="bg-orange-600 px-6 py-2 rounded-3xl text-gray-100 font-semibold uppercase tracking-wide">Cancel</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      
    </>
  );
};

export default Popup;
