import React, { useEffect } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, router, useForm } from '@inertiajs/react'
import { useModalState } from '@/hooks'
import Modal from '@/Components/Modal'
import Button from '@/Components/Button'
import FormInput from '@/Components/FormInput'
import FormInputNumeric from '@/Components/FormInputNumeric'
import FormFile from '@/Components/FormFile'
import Pagination from '@/Components/Pagination'
import { isEmpty } from 'lodash'

export default function Speakers({ speakers, auth, flash, errors }) {
    const formModal = useModalState()
    const { data, setData, post, processing, reset, errors: formErrors, clearErrors } = useForm({
        id: null,
        event_id: '',
        name: '',
        title: '',
        company: '',
        bio: '',
        order_column: 0,
        avatar: null,
        avatar_url: '',
    })

    const handleSubmit = () => {
        const url = data.id ? route('event.speakers.update', data.id) : route('event.speakers.store')
        post(url, {
            forceFormData: true,
            onSuccess: () => handleClose(),
        })
    }

    const handleClose = () => {
        formModal.setData(null)
        reset()
        clearErrors()
        if (formModal.isOpen) formModal.toggle()
    }

    useEffect(() => {
        const speaker = formModal.data
        if (!isEmpty(speaker)) {
            setData({
                id: speaker.id,
                event_id: speaker.event_id,
                name: speaker.name,
                title: speaker.title,
                company: speaker.company,
                bio: speaker.bio,
                order_column: speaker.order_column,
                avatar: null,
                avatar_url: speaker.avatar_url,
            })
        }
    }, [formModal.data])

    const deleteItem = (id) => {
        router.delete(route('event.speakers.destroy', id))
    }

    return (
        <AuthenticatedLayout auth={auth} errors={errors} flash={flash} page={'Event'} action={'Speakers'}>
            <Head title="Pembicara" />
            <div className="mx-auto sm:px-6 lg:px-8">
                <div className="p-4 bg-white dark:bg-gray-800 rounded shadow space-y-4">
                    <div className="flex justify-end">
                        <Button size="sm" onClick={() => formModal.toggle()}>
                            Tambah
                        </Button>
                    </div>
                    <div className="overflow-auto">
                        <table className="min-w-full text-sm text-left">
                            <thead>
                                <tr className="border-b">
                                    <th className="py-2 px-3">Nama</th>
                                    <th className="py-2 px-3">Event</th>
                                    <th className="py-2 px-3">Peran</th>
                                    <th className="py-2 px-3"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {speakers.data.map((speaker) => (
                                    <tr key={speaker.id} className="border-b">
                                        <td className="py-2 px-3">
                                            <div className="font-semibold">{speaker.name}</div>
                                            <div className="text-gray-600 text-xs">{speaker.company}</div>
                                        </td>
                                        <td className="py-2 px-3">{speaker.event?.name}</td>
                                        <td className="py-2 px-3">{speaker.title}</td>
                                        <td className="py-2 px-3 text-right space-x-2">
                                            <Button
                                                size="xs"
                                                onClick={() => {
                                                    formModal.setData(speaker)
                                                    formModal.toggle()
                                                }}
                                            >
                                                Ubah
                                            </Button>
                                            <Button size="xs" type="secondary" onClick={() => deleteItem(speaker.id)}>
                                                Hapus
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="w-full flex items-center justify-center">
                    <Pagination links={speakers.links} />
                </div>
            </div>
            <Modal isOpen={formModal.isOpen} toggle={handleClose} title="Pembicara">
                <FormInput
                    name="event_id"
                    value={data.event_id}
                    onChange={(e) => setData('event_id', e.target.value)}
                    label="Event ID"
                    error={formErrors.event_id}
                />
                <FormInput name="name" value={data.name} onChange={(e) => setData('name', e.target.value)} label="Nama" error={formErrors.name} />
                <FormInput
                    name="title"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    label="Jabatan/Title"
                    error={formErrors.title}
                />
                <FormInput
                    name="company"
                    value={data.company}
                    onChange={(e) => setData('company', e.target.value)}
                    label="Perusahaan"
                    error={formErrors.company}
                />
                <div className="mb-3">
                    <label className="block text-sm font-medium">Bio</label>
                    <textarea
                        name="bio"
                        value={data.bio}
                        onChange={(e) => setData('bio', e.target.value)}
                        className="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:text-white"
                        rows={3}
                    />
                    {formErrors.bio && <p className="text-red-600 text-sm">{formErrors.bio}</p>}
                </div>
                <FormInputNumeric
                    name="order_column"
                    value={data.order_column}
                    onChange={(value) => setData('order_column', value)}
                    label="Urutan"
                    error={formErrors.order_column}
                />
                <FormFile
                    label="Avatar"
                    onChange={(e) => setData('avatar', e.target.files[0])}
                    error={formErrors.avatar}
                    preview={
                        data.avatar_url && <img src={data.avatar_url} className="mb-2 h-16 w-16 object-cover rounded-full" />
                    }
                />
                <div className="flex space-x-2 mt-2">
                    <Button onClick={handleSubmit} processing={processing}>
                        Simpan
                    </Button>
                    <Button type="secondary" onClick={handleClose}>
                        Batal
                    </Button>
                </div>
            </Modal>
        </AuthenticatedLayout>
    )
}
