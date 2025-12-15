import React, { useEffect, useState } from 'react'
import { Head, router, useForm } from '@inertiajs/react'

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import EventSelectionInput from '../Event/SelectionInput'
import FormInput from '@/Components/FormInput'
import Button from '@/Components/Button'
import { formatDateTime } from '@/utils'

export default function Attendance(props) {
    const { auth, stats, eventId, lastCheckins, checkedInParticipant } = props

    const [selectedEvent, setSelectedEvent] = useState(eventId ?? null)

    const { data, setData, post, processing, errors, reset } = useForm({
        event_id: eventId ?? null,
        identifier: '',
    })

    // Sink props eventId into state/form when navigation returns
    useEffect(() => {
        setSelectedEvent(eventId ?? null)
        setData('event_id', eventId ?? null)
    }, [eventId])

    const handleSelectEvent = (item) => {
        const id = item?.id ?? null
        setSelectedEvent(id)
        setData('event_id', id)

        router.get(
            route('attendance.index'),
            id ? { event_id: id } : {},
            {
                replace: true,
                preserveState: true,
                preserveScroll: true,
            }
        )
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        post(route('attendance.checkin'), {
            preserveScroll: true,
            onSuccess: () => reset('identifier'),
        })
    }

    return (
        <AuthenticatedLayout
            auth={auth}
            errors={props.errors}
            flash={props.flash}
            page={'Attendance'}
            action={''}
        >
            <Head title="Attendance" />

            <div>
                <div className="mx-auto sm:px-6 lg:px-8 ">
                    <div className="p-6 overflow-hidden shadow-sm sm:rounded-lg bg-gray-200 dark:bg-gray-800 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <EventSelectionInput
                                label="Event"
                                itemSelected={selectedEvent}
                                onItemSelected={handleSelectEvent}
                                error={errors.event_id}
                            />
                            <form
                                onSubmit={handleSubmit}
                                className="flex flex-col space-y-2"
                            >
                                <FormInput
                                    name="identifier"
                                    label="NP / Email / No Telp (scan atau ketik)"
                                    value={data.identifier}
                                    onChange={(e) =>
                                        setData('identifier', e.target.value)
                                    }
                                    error={errors.identifier}
                                    autoFocus
                                />
                                <div>
                                    <Button
                                        disabled={processing || !data.event_id}
                                        processing={processing}
                                        nativeType="submit"
                                    >
                                        Check-in
                                    </Button>
                                </div>
                            </form>
                        </div>

                        {checkedInParticipant && (
                            <div className="p-4 bg-white dark:bg-gray-900 rounded shadow">
                                <div className="text-sm text-gray-500 dark:text-gray-300">
                                    Terakhir check-in:
                                </div>
                                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    {checkedInParticipant.name} (
                                    {checkedInParticipant.employee_code})
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    Event: {checkedInParticipant.event ?? '-'}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    Waktu:{' '}
                                    {checkedInParticipant.checked_in_at
                                        ? formatDateTime(
                                              checkedInParticipant.checked_in_at
                                          )
                                        : '-'}
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 bg-white dark:bg-gray-900 rounded shadow">
                                <div className="text-sm text-gray-500 dark:text-gray-300">
                                    Total Peserta
                                </div>
                                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                    {stats.total}
                                </div>
                            </div>
                            <div className="p-4 bg-white dark:bg-gray-900 rounded shadow">
                                <div className="text-sm text-gray-500 dark:text-gray-300">
                                    Hadir
                                </div>
                                <div className="text-3xl font-bold text-emerald-600">
                                    {stats.present}
                                </div>
                            </div>
                            <div className="p-4 bg-white dark:bg-gray-900 rounded shadow">
                                <div className="text-sm text-gray-500 dark:text-gray-300">
                                    Belum Hadir
                                </div>
                                <div className="text-3xl font-bold text-orange-500">
                                    {stats.absent}
                                </div>
                            </div>
                        </div>

                        <div className="overflow-auto">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 mb-4">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="py-3 px-6">
                                            NP
                                        </th>
                                        <th scope="col" className="py-3 px-6">
                                            Nama
                                        </th>
                                        <th scope="col" className="py-3 px-6">
                                            Event
                                        </th>
                                        <th scope="col" className="py-3 px-6">
                                            Waktu Check-in
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lastCheckins.map((participant) => (
                                        <tr
                                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                            key={participant.id}
                                        >
                                            <td className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                {participant.employee_code}
                                            </td>
                                            <td className="py-4 px-6">
                                                {participant.name}
                                            </td>
                                            <td className="py-4 px-6">
                                                {participant.event?.name}
                                            </td>
                                            <td className="py-4 px-6">
                                                {participant.checked_in_at
                                                    ? formatDateTime(
                                                          participant.checked_in_at
                                                      )
                                                    : '-'}
                                            </td>
                                        </tr>
                                    ))}
                                    {lastCheckins.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan="4"
                                                className="py-4 px-6 text-center text-gray-500 dark:text-gray-300"
                                            >
                                                Belum ada data check-in
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}
