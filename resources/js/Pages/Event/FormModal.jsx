import React, { useEffect, useRef } from 'react'
import Modal from '@/Components/Modal'
import { useForm } from '@inertiajs/react'
import Button from '@/Components/Button'
import FormInput from '@/Components/FormInput'
import { isEmpty } from 'lodash'
import FormInputDate from '@/Components/FormInputDate'
import FormFile from '@/Components/FormFile'
import FormInputNumeric from '@/Components/FormInputNumeric'

export default function FormModal(props) {
    const inputRef = useRef()
    const { modalState } = props
    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            name: '',
            date: '',
            slug: '',
            start_at: '',
            end_at: '',
            location: '',
            description: '',
            agenda: '',
            capacity: 0,
            registration_deadline: '',
            pic_name: '',
            pic_contact: '',
            is_public: true,
            budget_total: 0,
            image: null,
            image_url: '',
        })

    const handleOnChange = (event) => {
        setData(
            event.target.name,
            event.target.type === 'checkbox'
                ? event.target.checked
                    ? 1
                    : 0
                : event.target.value
        )
    }

    const handleReset = () => {
        if (inputRef.current) {
            inputRef.current.value = ''
        }
        modalState.setData(null)
        reset()
        clearErrors()
    }

    const handleClose = () => {
        handleReset()
        modalState.toggle()
    }

    const handleSubmit = () => {
        const event = modalState.data
        if (event !== null) {
            post(route('event.update', event), {
                onSuccess: () => handleClose(),
            })
            return
        }
        post(route('event.store'), {
            onSuccess: () => handleClose(),
        })
    }

    useEffect(() => {
        const event = modalState.data
        if (isEmpty(event) === false) {
            setData((prev) => ({
                ...prev,
                name: event.name,
                date: event.date,
                slug: event.slug,
                start_at: event.start_at,
                end_at: event.end_at,
                location: event.location,
                description: event.description,
                agenda: event.agenda,
                capacity: event.capacity,
                registration_deadline: event.registration_deadline,
                pic_name: event.pic_name,
                pic_contact: event.pic_contact,
                is_public: event.is_public,
                budget_total: event.budget_total,
                image_url: event.image_url,
            }))
            return
        }
    }, [modalState.data])

    return (
        <Modal isOpen={modalState.isOpen} toggle={handleClose} title={'Event'}>
            <FormInput
                name="name"
                value={data.name}
                onChange={handleOnChange}
                label="Nama"
                error={errors.name}
            />
            <FormInput
                name="slug"
                value={data.slug}
                onChange={handleOnChange}
                label="Slug"
                error={errors.slug}
            />
            <FormInputDate
                name="date"
                selected={data.date}
                onChange={(date) => setData('date', date)}
                label="Tanggal"
                error={errors.date}
            />
            <FormInputDate
                name="start_at"
                selected={data.start_at}
                onChange={(date) => setData('start_at', date)}
                label="Mulai"
                error={errors.start_at}
            />
            <FormInputDate
                name="end_at"
                selected={data.end_at}
                onChange={(date) => setData('end_at', date)}
                label="Selesai"
                error={errors.end_at}
            />
            <FormInput
                name="location"
                value={data.location}
                onChange={handleOnChange}
                label="Lokasi"
                error={errors.location}
            />
            <FormInput
                name="pic_name"
                value={data.pic_name}
                onChange={handleOnChange}
                label="PIC"
                error={errors.pic_name}
            />
            <FormInput
                name="pic_contact"
                value={data.pic_contact}
                onChange={handleOnChange}
                label="Kontak PIC"
                error={errors.pic_contact}
            />
            <FormInputNumeric
                name="capacity"
                value={data.capacity}
                onChange={(value) => setData('capacity', value)}
                label="Kuota"
                error={errors.capacity}
            />
            <FormInputDate
                name="registration_deadline"
                selected={data.registration_deadline}
                onChange={(date) => setData('registration_deadline', date)}
                label="Batas Registrasi"
                error={errors.registration_deadline}
            />
            <FormInputNumeric
                name="budget_total"
                value={data.budget_total}
                onChange={(value) => setData('budget_total', value)}
                label="Anggaran"
                error={errors.budget_total}
            />
            <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Deskripsi</label>
                <textarea
                    name="description"
                    value={data.description}
                    onChange={handleOnChange}
                    className="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:text-white"
                    rows={3}
                />
                {errors.description && <p className="text-red-600 text-sm">{errors.description}</p>}
            </div>
            <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Agenda</label>
                <textarea
                    name="agenda"
                    value={data.agenda}
                    onChange={handleOnChange}
                    className="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:text-white"
                    rows={3}
                />
                {errors.agenda && <p className="text-red-600 text-sm">{errors.agenda}</p>}
            </div>
            <div className="flex items-center space-x-2 mb-3">
                <input
                    type="checkbox"
                    name="is_public"
                    checked={!!data.is_public}
                    onChange={(e) => setData('is_public', e.target.checked)}
                />
                <span className="text-sm text-gray-700 dark:text-gray-200">Event publik</span>
            </div>
            <FormFile
                inputRef={inputRef}
                label={'Gambar'}
                onChange={(e) => setData('image', e.target.files[0])}
                error={errors.image}
                preview={
                    isEmpty(data.image_url) === false && (
                        <img
                            src={data.image_url}
                            className="mb-1 max-h-32 w-full object-contain"
                            alt="preview"
                        />
                    )
                }
            />
            <div className="flex items-center py-2">
                <Button onClick={handleSubmit} processing={processing}>
                    Simpan
                </Button>
                <Button onClick={handleClose} type="secondary">
                    Batal
                </Button>
            </div>
        </Modal>
    )
}
