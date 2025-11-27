import React, { useEffect, useState, useRef } from 'react';
import { Link, usePage } from '@inertiajs/react';


export default function GiftItem() {

    return (
        <>
            <div
                className="gift-container"
            >
                <img
                    src="https://astraotoshop.com/asset/2023/10/11/f986a245-8773-46dd-884f-66ed0c861673+10w40+4w.webp"
                    className="mb-1 max-h-32 w-full object-contain"
                    alt="preview"
                />
                <div className="flex justify-center text-2xl font-bold outlined-text">
                    HADIAH 1
                </div>
            </div>
        </>
    )
}