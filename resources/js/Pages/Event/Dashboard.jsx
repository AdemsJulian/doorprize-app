import React from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, router } from '@inertiajs/react'

export default function EventDashboard({ events, topEvents, summary, auth, flash, errors }) {
    const handleReminder = (eventId) => {
        router.post(route('events.reminder', eventId))
    }

    const renderCapacity = (capacity) => (capacity && capacity > 0 ? capacity : 'Unlimited')

    return (
        <AuthenticatedLayout auth={auth} errors={errors} flash={flash} page={'Event'} action={'Dashboard'}>
            <Head title="Event Dashboard" />
            <div className="mx-auto sm:px-6 lg:px-8 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <StatCard label="Total Event" value={summary.total_events} />
                    <StatCard label="Registrasi" value={summary.total_registrations} />
                    <StatCard label="Hadir" value={summary.total_present} />
                    <StatCard label="Absen" value={summary.total_absent} />
                </div>

                <div className="bg-white dark:bg-gray-800 rounded shadow p-4">
                    <h2 className="text-lg font-semibold mb-2">Top Event</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {topEvents.map((event) => (
                            <div key={event.id} className="border rounded p-3 bg-gray-50 dark:bg-gray-700">
                                <div className="font-semibold">{event.name}</div>
                                <div className="text-sm text-gray-600">{event.location}</div>
                                <div className="text-sm text-gray-700">
                                    Confirmed: {event.confirmed_count}/{renderCapacity(event.capacity)}
                                </div>
                                <div className="text-sm text-gray-700">Hadir: {event.present_count}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded shadow p-4 overflow-auto">
                    <h2 className="text-lg font-semibold mb-2">Semua Event</h2>
                    <table className="min-w-full text-sm text-left">
                        <thead>
                            <tr className="border-b">
                                <th className="py-2 px-3">Nama</th>
                                <th className="py-2 px-3">Tanggal</th>
                                <th className="py-2 px-3">Lokasi</th>
                                <th className="py-2 px-3">Reg/Kuota</th>
                                <th className="py-2 px-3">Hadir</th>
                                <th className="py-2 px-3">Budget</th>
                                <th className="py-2 px-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map((event) => (
                                <tr key={event.id} className="border-b">
                                    <td className="py-2 px-3">{event.name}</td>
                                    <td className="py-2 px-3">{event.start_at || event.date}</td>
                                    <td className="py-2 px-3">{event.location}</td>
                                    <td className="py-2 px-3">
                                        {event.confirmed_count}/{renderCapacity(event.capacity)}
                                    </td>
                                    <td className="py-2 px-3">{event.present_count}</td>
                                    <td className="py-2 px-3">{event.budget_total}</td>
                                    <td className="py-2 px-3 text-right">
                                        <button
                                            className="text-blue-600 underline text-sm"
                                            onClick={() => handleReminder(event.id)}
                                        >
                                            Kirim Reminder
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}

function StatCard({ label, value }) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded shadow p-4">
            <div className="text-sm text-gray-600">{label}</div>
            <div className="text-2xl font-bold">{value}</div>
        </div>
    )
}
