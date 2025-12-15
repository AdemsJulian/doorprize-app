import React from 'react'
import { Head, useForm, usePage } from '@inertiajs/react'
import GuestLayout from '@/Layouts/GuestLayout'
import Button from '@/Components/Button'

export default function EventShow({ event, speakers, materials, registrations, confirmed, capacity }) {
    const { flash } = usePage().props
    const { data, setData, post, processing, errors } = useForm({
        employee_code: '',
        name: '',
        email: '',
        phone: '',
        unit: '',
    })

    const onSubmit = (e) => {
        e.preventDefault()
        post(route('events.public.register', event.slug))
    }

    const googleCalendarUrl = () => {
        const start = new Date(event.start_at || event.date).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
        const end = new Date(event.end_at || event.date).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
        const text = encodeURIComponent(event.name)
        const details = encodeURIComponent(event.description || '')
        const location = encodeURIComponent(event.location || '')
        return `https://www.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${start}/${end}&details=${details}&location=${location}`
    }

    return (
        <GuestLayout>
            <Head title={event.name} />
            <div className="space-y-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{event.name}</h1>
                        <p className="text-sm text-gray-600">
                            {event.location} • {event.start_at || event.date}
                        </p>
                        <p className="text-sm text-gray-600">
                            PIC: {event.pic_name} {event.pic_contact && `(${event.pic_contact})`}
                        </p>
                        <p className="text-sm text-gray-600">
                            Registrasi: {confirmed}/{capacity || '∞'} (total {registrations})
                        </p>
                        <div className="flex space-x-3 mt-2">
                            <a href={route('events.ics', event.slug)} className="text-blue-600 underline text-sm">
                                Add .ics
                            </a>
                            <a href={googleCalendarUrl()} className="text-blue-600 underline text-sm" target="_blank" rel="noreferrer">
                                Add to Google
                            </a>
                        </div>
                    </div>
                    {event.image_url && <img src={event.image_url} className="h-24 w-24 object-contain" />}
                </div>

                <div className="bg-white shadow rounded p-4">
                    <h2 className="text-lg font-semibold mb-2">Deskripsi</h2>
                    <p className="text-sm text-gray-700 whitespace-pre-line">{event.description}</p>
                </div>

                {event.agenda && (
                    <div className="bg-white shadow rounded p-4">
                        <h2 className="text-lg font-semibold mb-2">Agenda</h2>
                        <p className="text-sm text-gray-700 whitespace-pre-line">{event.agenda}</p>
                    </div>
                )}

                {speakers.length > 0 && (
                    <div className="bg-white shadow rounded p-4">
                        <h2 className="text-lg font-semibold mb-4">Pembicara</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {speakers.map((speaker) => (
                                <div key={speaker.id} className="border rounded p-3">
                                    {speaker.avatar_url && (
                                        <img src={speaker.avatar_url} alt={speaker.name} className="h-16 w-16 rounded-full object-cover" />
                                    )}
                                    <div className="font-semibold">{speaker.name}</div>
                                    <div className="text-sm text-gray-600">{speaker.title}</div>
                                    <div className="text-sm text-gray-600">{speaker.company}</div>
                                    <p className="text-sm text-gray-700 mt-2 whitespace-pre-line">{speaker.bio}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {materials.length > 0 && (
                    <div className="bg-white shadow rounded p-4">
                        <h2 className="text-lg font-semibold mb-2">Materi</h2>
                        <ul className="space-y-2">
                            {materials.map((material) => (
                                <li key={material.id} className="flex justify-between text-sm">
                                    <div>
                                        <div className="font-medium">{material.title}</div>
                                        <div className="text-gray-600">{material.description}</div>
                                    </div>
                                    {material.file_url && (
                                        <a href={material.file_url} className="text-blue-600 underline" download>
                                            Unduh
                                        </a>
                                    )}
                                    {!material.file_url && material.link_url && (
                                        <a href={material.link_url} className="text-blue-600 underline" target="_blank" rel="noreferrer">
                                            Buka
                                        </a>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="bg-white shadow rounded p-4">
                    <h2 className="text-lg font-semibold mb-4">Daftar Sekarang</h2>
                    {flash?.message && (
                        <div className={`mb-3 text-sm ${flash.message.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
                            {flash.message.message}
                        </div>
                    )}
                    <form className="space-y-3" onSubmit={onSubmit}>
                        <div>
                            <label className="block text-sm font-medium">NP / Employee Code</label>
                            <input
                                name="employee_code"
                                value={data.employee_code}
                                onChange={(e) => setData('employee_code', e.target.value)}
                                className="w-full rounded-md border-gray-300"
                            />
                            {errors.employee_code && <p className="text-red-600 text-sm">{errors.employee_code}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Nama</label>
                            <input
                                name="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full rounded-md border-gray-300"
                            />
                            {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Email kantor</label>
                            <input
                                name="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full rounded-md border-gray-300"
                            />
                            {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium">No Telepon</label>
                            <input
                                name="phone"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                className="w-full rounded-md border-gray-300"
                            />
                            {errors.phone && <p className="text-red-600 text-sm">{errors.phone}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Unit</label>
                            <input
                                name="unit"
                                value={data.unit}
                                onChange={(e) => setData('unit', e.target.value)}
                                className="w-full rounded-md border-gray-300"
                            />
                            {errors.unit && <p className="text-red-600 text-sm">{errors.unit}</p>}
                        </div>
                        <Button nativeType="submit" processing={processing} className="w-full mr-0">
                            Daftar Sekarang
                        </Button>
                    </form>
                </div>
            </div>
        </GuestLayout>
    )
}
