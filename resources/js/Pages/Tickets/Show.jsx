import React from 'react'
import GuestLayout from '@/Layouts/GuestLayout'
import { Head } from '@inertiajs/react'

export default function TicketShow({ participant, event }) {
    return (
        <GuestLayout>
            <Head title={`Tiket ${event.name}`} />
            <div className="space-y-4">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">{event.name}</h1>
                    <p className="text-sm text-gray-600">{event.location}</p>
                    <p className="text-sm text-gray-600">{event.start_at || event.date}</p>
                </div>
                <div className="bg-white rounded shadow p-4 text-center space-y-2">
                    <p className="text-lg font-semibold">{participant.name}</p>
                    <p className="text-sm text-gray-600">{participant.email}</p>
                    <p className="text-sm text-gray-600">{participant.employee_code}</p>
                    <div className="text-sm text-gray-700">Ticket Code</div>
                    <div className="text-xl font-bold tracking-wide">{participant.ticket_code}</div>
                    {participant.ticket_qr_url && (
                        <div className="flex justify-center">
                            <img src={participant.ticket_qr_url} alt="QR" className="h-48 w-48" />
                        </div>
                    )}
                    <p className="text-sm text-gray-600">
                        Tunjukkan QR ini saat check-in. Status: {participant.registration_status}
                    </p>
                </div>
            </div>
        </GuestLayout>
    )
}
