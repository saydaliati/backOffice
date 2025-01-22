import { useState } from 'react';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { Building2, MapPin, Phone, X, Upload } from 'lucide-react';
import { pharmacyFormSchema } from '../validations/pharmacySchema';
import InputField from './InputField';
import { Pharmacy } from '../types/pharmacy';

interface PharmacyUpdateFormProps {
    pharmacy: Pharmacy;
    onSubmit: (formData: FormData) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
    isRTL?: boolean;
}

const PharmacyUpdateForm = ({ pharmacy, onSubmit, onCancel, isLoading, isRTL }: PharmacyUpdateFormProps) => {
    const { t } = useTranslation();
    const [preview, setPreview] = useState<string>(pharmacy.image || '');

    const formik = useFormik({
        initialValues: {
            name: pharmacy.name,
            address: pharmacy.address,
            telephone: pharmacy.telephone,
            openHours: pharmacy.openHours,
            closeHours: pharmacy.closeHours,
            image: pharmacy.image || '',
            latitude: pharmacy.latitude,
            longLatitude: pharmacy.longLatitude,
        },
        validationSchema: pharmacyFormSchema,
        onSubmit: async (values) => {
            const formData = new FormData();
            Object.entries(values).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    if (key === 'image' && value instanceof File) {
                        formData.append('image', value);
                    } else {
                        formData.append(key, value.toString());
                    }
                }
            });
            await onSubmit(formData);
        },
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            formik.setFieldValue('image', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div className="flex justify-center">
                <div className="relative group w-36 h-32">
                    <div className={`
                        w-full h-full rounded-xl overflow-hidden border-2
                        ${preview ? 'border-primary' : 'border-dashed border-primary dark:border-gray-500'}
                        hover:border-primary transition-colors
                    `}>
                        {preview ? (
                            <div className="relative h-full">
                                <img
                                    src={preview}
                                    alt={formik.values.name}
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setPreview('');
                                        formik.setFieldValue('image', undefined);
                                    }}
                                    className="absolute top-2 right-2 p-1 bg-red-500/80 
                                             rounded-full text-white opacity-0 
                                             group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800">
                                <Upload className="w-6 h-6 text-primary dark:text-gray-500" />
                                <span className="text-xs text-gray-500 mt-2">{t('upload image')}</span>
                            </div>
                        )}
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <InputField
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        label={t('pharmacy name')}
                        startIcon={Building2}
                        error={formik.touched.name && formik.errors.name ? formik.errors.name : ''}
                        placeholder={t('enter pharmacy name')}
                    />
                    <InputField
                        name="telephone"
                        value={formik.values.telephone}
                        onChange={formik.handleChange}
                        label={t('phone')}
                        startIcon={Phone}
                        error={formik.touched.telephone && formik.errors.telephone ? formik.errors.telephone : ''}
                        placeholder={t('enter phone number')}
                        dir="ltr"
                    />
                </div>

                <InputField
                    name="address"
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    label={t('address')}
                    startIcon={MapPin}
                    error={formik.touched.address && formik.errors.address ? formik.errors.address : ''}
                    placeholder={t('enter address')}
                />

                <div className="grid grid-cols-2 gap-4">
                    <InputField
                        name="latitude"
                        label={t('latitude')}
                        type="text"
                        value={formik.values.latitude}
                        onChange={formik.handleChange}
                        error={formik.touched.latitude && formik.errors.latitude ? formik.errors.latitude : ''}
                        placeholder={t('enter latitude')}
                    />
                    <InputField
                        name="longLatitude"
                        label={t('longitude')}
                        type="text"
                        value={formik.values.longLatitude}
                        onChange={formik.handleChange}
                        error={formik.touched.longLatitude && formik.errors.longLatitude ? formik.errors.longLatitude : ''}
                        placeholder={t('enter longitude')}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <InputField
                        type="time"
                        name="openHours"
                        value={formik.values.openHours}
                        onChange={formik.handleChange}
                        label={t('opening hour')}
                        error={formik.touched.openHours && formik.errors.openHours ? formik.errors.openHours : ''}
                        dir="ltr"
                    />
                    <InputField
                        type="time"
                        name="closeHours"
                        value={formik.values.closeHours}
                        onChange={formik.handleChange}
                        label={t('closing hour')}
                        error={formik.touched.closeHours && formik.errors.closeHours ? formik.errors.closeHours : ''}
                        dir="ltr"
                    />
                </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 border-t border-gray-200 dark:border-gray-600 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="w-full px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 
                             bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 
                             rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 
                             transition-colors duration-200"
                    disabled={isLoading}
                >
                    {t('cancel')}
                </button>
                <button
                    type="submit"
                    disabled={isLoading || formik.isSubmitting}
                    className="w-full px-4 py-2.5 text-sm font-medium text-white 
                             bg-primary rounded-lg hover:bg-primary-dark 
                             disabled:opacity-50 disabled:cursor-not-allowed
                             transition-colors duration-200
                             flex items-center justify-center gap-2"
                >
                    {isLoading && (
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    )}
                    {t('update')}
                </button>
            </div>
        </form>
    );
};

export default PharmacyUpdateForm;