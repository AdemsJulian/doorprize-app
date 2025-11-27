import React, { useEffect, useState } from 'react'
import { router } from '@inertiajs/react'
import { usePrevious } from 'react-use'
import { Head } from '@inertiajs/react'
import { Button, Dropdown, Badge } from 'flowbite-react'
import { HiPencil, HiTrash } from 'react-icons/hi'
import { useModalState } from '@/hooks'

import { hasPermission } from '@/utils'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import Pagination from '@/Components/Pagination'
import ModalConfirm from '@/Components/ModalConfirm'
import FormModal from './FormModal'
import SearchInput from '@/Components/SearchInput'
import EventSelectionInput from '../Event/SelectionInput'

export default function Participan(props) {
    const {
        query: { links, data },
        auth,
    } = props

    const [event, setEvent] = useState(null)
    const [search, setSearch] = useState('')
    const preValue = usePrevious(`${search}${event}`)

    const confirmModal = useModalState()
    const formModal = useModalState()

    const toggleFormModal = (participant = null) => {
        formModal.setData(participant)
        formModal.toggle()
    }

    const handleDeleteClick = (participant) => {
        confirmModal.setData(participant)
        confirmModal.toggle()
    }

    const onDelete = () => {
        if (confirmModal.data !== null) {
            router.delete(route('participant.destroy', confirmModal.data.id))
        }
    }

    const params = { q: search, event_id: event?.id }
    useEffect(() => {
        if (preValue) {
            router.get(
                route(route().current()),
                { q: search, event_id: event?.id },
                {
                    replace: true,
                    preserveState: true,
                }
            )
        }
    }, [search, event])

    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            flash={props.flash}
            page={'Peserta'}
            action={''}
        >
            <Head title="Peserta" />

            <div>
                <div className="mx-auto sm:px-6 lg:px-8 ">
                    <div className="p-6 overflow-hidden shadow-sm sm:rounded-lg bg-gray-200 dark:bg-gray-800 space-y-4">
                        <div className="flex justify-between">
                            <div className='flex flex-col items-center"'>
                                <Button
                                    size="sm"
                                    onClick={() => toggleFormModal()}
                                >
                                    Tambah
                                </Button>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-full">
                                    <EventSelectionInput
                                        placeholder="filter event"
                                        itemSelected={event?.id}
                                        onItemSelected={(item) =>
                                            setEvent(item)
                                        }
                                    />
                                </div>
                                <div className="w-full">
                                    <SearchInput
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        value={search}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="overflow-auto">
                            <div>
                                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 mb-4">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="py-3 px-6"
                                            >
                                                NPK
                                            </th>
                                            <th
                                                scope="col"
                                                className="py-3 px-6"
                                            >
                                                Nama
                                            </th>
                                            <th
                                                scope="col"
                                                className="py-3 px-6"
                                            >
                                                No Telp
                                            </th>
                                            <th
                                                scope="col"
                                                className="py-3 px-6"
                                            >
                                                Unit Kerja
                                            </th>
                                            <th
                                                scope="col"
                                                className="py-3 px-6"
                                            >
                                                Status
                                            </th>
                                            <th
                                                scope="col"
                                                className="py-3 px-6"
                                            >
                                                Event
                                            </th>
                                            <th
                                                scope="col"
                                                className="py-3 px-6"
                                            >
                                                Photo
                                            </th>
                                            <th
                                                scope="col"
                                                className="py-3 px-6"
                                            />
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map((participant,index) => (
                                            <tr
                                                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                                key={participant.id}
                                            >
                                                <td
                                                    scope="row"
                                                    className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                                >
                                                    {participant.employee_code}
                                                </td>
                                                <td className="py-4 px-6">
                                                    {participant.name}
                                                </td>
                                                <td className="py-4 px-6">
                                                    {participant.phone}
                                                </td>
                                                <td className="py-4 px-6">
                                                    {participant.unit}
                                                </td>
                                                <td className="py-4 px-6">
                                                <Badge color={participant.is_active ? 'info' : 'gray'} size="sm">
                                                    {participant.is_active ? 'Active' : 'Non-Active'}
                                                </Badge>
                                                </td>
                                                <td className="py-4 px-6">
                                                    {participant.event.name}
                                                </td>
                                                <td className="py-4 px-6">
                                                    {participant.image_url !==
                                                        null && (
                                                            <img
                                                                src={participant.image_url}
                                                                className="mb-1 max-h-16 w-full object-contain"
                                                                alt="preview"
                                                            />
                                                        )}
                                                </td>
                                                <td className="py-4 px-6 flex justify-end">
                                                    <Dropdown
                                                        label={'Opsi'}
                                                        placement={'bottom'}
                                                        dismissOnClick={true}
                                                        size={'sm'}
                                                    >
                                                        <Dropdown.Item
                                                            onClick={() =>
                                                                toggleFormModal(
                                                                    participant
                                                                )
                                                            }
                                                        >
                                                            <div className="flex space-x-1 items-center">
                                                                <HiPencil />
                                                                <div>
                                                                    Ubah
                                                                </div>
                                                            </div>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item
                                                            onClick={() =>
                                                                handleDeleteClick(
                                                                    participant
                                                                )
                                                            }
                                                        >
                                                            <div className="flex space-x-1 items-center">
                                                                <HiTrash />
                                                                <div>
                                                                    Hapus
                                                                </div>
                                                            </div>
                                                        </Dropdown.Item>
                                                    </Dropdown>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="w-full flex items-center justify-center">
                                <Pagination links={links} params={params} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ModalConfirm modalState={confirmModal} onConfirm={onDelete} />
            <FormModal modalState={formModal} />
        </AuthenticatedLayout>
    )
}
