import React, { useEffect } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, router, useForm } from '@inertiajs/react'
import { useModalState } from '@/hooks'
import Modal from '@/Components/Modal'
import Button from '@/Components/Button'
import FormInput from '@/Components/FormInput'
import FormInputDate from '@/Components/FormInputDate'
import FormFile from '@/Components/FormFile'
import Pagination from '@/Components/Pagination'
import { isEmpty } from 'lodash'

export default function Materials({ materials, auth, flash, errors }) {
    const formModal = useModalState()
    const { data, setData, post, processing, reset, errors: formErrors, clearErrors } = useForm({
        id: null,
        event_id: '',
        title: '',
        description: '',
        link_url: '',
        is_public: true,
        published_at: '',
        file: null,
        file_url: '',
    })

    const handleSubmit = () => {
        const url = data.id ? route('event.materials.update', data.id) : route('event.materials.store')
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
        const material = formModal.data
        if (!isEmpty(material)) {
            setData({
                id: material.id,
                event_id: material.event_id,
                title: material.title,
                description: material.description,
                link_url: material.link_url,
                is_public: material.is_public,
                published_at: material.published_at,
                file: null,
                file_url: material.file_url,
            })
        }
    }, [formModal.data])

    const deleteItem = (id) => {
        router.delete(route('event.materials.destroy', id))
    }

    return (
        <AuthenticatedLayout auth={auth} errors={errors} flash={flash} page={'Event'} action={'Materi'}>
            <Head title="Materi" />
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
                                    <th className="py-2 px-3">Judul</th>
                                    <th className="py-2 px-3">Event</th>
                                    <th className="py-2 px-3">Publik</th>
                                    <th className="py-2 px-3"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {materials.data.map((material) => (
                                    <tr key={material.id} className="border-b">
                                        <td className="py-2 px-3">
                                            <div className="font-semibold">{material.title}</div>
                                            <div className="text-xs text-gray-600">{material.description}</div>
                                        </td>
                                        <td className="py-2 px-3">{material.event?.name}</td>
                                        <td className="py-2 px-3">{material.is_public ? 'Ya' : 'Tidak'}</td>
                                        <td className="py-2 px-3 text-right space-x-2">
                                            <Button
                                                size="xs"
                                                onClick={() => {
                                                    formModal.setData(material)
                                                    formModal.toggle()
                                                }}
                                            >
                                                Ubah
                                            </Button>
                                            <Button size="xs" type="secondary" onClick={() => deleteItem(material.id)}>
                                                Hapus
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="w-full flex items-center justify-center">
                        <Pagination links={materials.links} />
                    </div>
                </div>
            </div>
            <Modal isOpen={formModal.isOpen} toggle={handleClose} title="Materi">
                <FormInput
                    name="event_id"
                    value={data.event_id}
                    onChange={(e) => setData('event_id', e.target.value)}
                    label="Event ID"
                    error={formErrors.event_id}
                />
                <FormInput name="title" value={data.title} onChange={(e) => setData('title', e.target.value)} label="Judul" error={formErrors.title} />
                <div className="mb-3">
                    <label className="block text-sm font-medium">Deskripsi</label>
                    <textarea
                        name="description"
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        className="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:text-white"
                        rows={3}
                    />
                    {formErrors.description && <p className="text-red-600 text-sm">{formErrors.description}</p>}
                </div>
                <FormInput
                    name="link_url"
                    value={data.link_url}
                    onChange={(e) => setData('link_url', e.target.value)}
                    label="Link"
                    error={formErrors.link_url}
                />
                <FormInputDate
                    name="published_at"
                    selected={data.published_at}
                    onChange={(date) => setData('published_at', date)}
                    label="Tanggal Publikasi"
                    error={formErrors.published_at}
                />
                <div className="flex items-center space-x-2 mb-3">
                    <input
                        type="checkbox"
                        name="is_public"
                        checked={!!data.is_public}
                        onChange={(e) => setData('is_public', e.target.checked)}
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-200">Dapat diakses publik</span>
                </div>
                <FormFile
                    label="File"
                    onChange={(e) => setData('file', e.target.files[0])}
                    error={formErrors.file}
                    preview={
                        data.file_url && (
                            <a href={data.file_url} className="text-blue-600 underline" target="_blank" rel="noreferrer">
                                Lihat file
                            </a>
                        )
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
