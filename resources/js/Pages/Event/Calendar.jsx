import React, { useState, useEffect } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, router } from '@inertiajs/react'
import { usePrevious } from 'react-use'
import SearchInput from '@/Components/SearchInput'

export default function Calendar({ events, filters, auth, errors, flash }) {
    const [location, setLocation] = useState(filters.location || '')
    const [status, setStatus] = useState(filters.status || '')
    const prev = usePrevious(`${location}-${status}`)

    useEffect(() => {
        if (prev !== undefined) {
            router.get(route(route().current()), { location, status }, { preserveState: true, replace: true })
        }
    }, [location, status])

    return (
        <AuthenticatedLayout auth={auth} errors={errors} flash={flash} page={'Kalender'} action={'Event'}>
            <Head title="Kalender Event" />
            <div className="mx-auto sm:px-6 lg:px-8">
                <div className="p-4 bg-white dark:bg-gray-800 rounded shadow space-y-4">
                    <div className="flex space-x-2">
                        <SearchInput placeholder="Filter lokasi" value={location} onChange={(e) => setLocation(e.target.value)} />
                        <select
                            className="rounded-md border-gray-300 dark:bg-gray-700 dark:text-white"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="">Status Registrasi</option>
                            <option value="open">Open</option>
                            <option value="closed">Closed</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {events.map((event) => (
                            <div key={event.id} className="border rounded p-3 bg-gray-50 dark:bg-gray-700">
                                <div className="font-semibold">{event.name}</div>
                                <div className="text-sm text-gray-600">{event.location}</div>
                                <div className="text-sm text-gray-600">{event.start_at || event.date}</div>
                                <div className="text-sm text-gray-700">
                                    Registrasi: {event.confirmed_count}/{event.capacity || 'Unlimited'} (total {event.participants_count})
                                </div>
                                {event.slug ? (
                                    <div className="mt-2 text-sm text-blue-600 underline">
                                        <a href={route('events.public.show', event.slug)} target="_blank" rel="noreferrer">
                                            Lihat Halaman Event
                                        </a>
                                    </div>
                                ) : (
                                    <div className="mt-2 text-xs text-gray-500">Slug belum diset</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}
