import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Building2, MapPin, Phone, Upload, X } from 'lucide-react';
import { Formik, Form } from 'formik';
import InputField from './InputField';
import { pharmacySchema, PharmacyFormData, initialPharmacyData } from '../validations/pharmacySchema';


interface PharmacyAddFormProps {
    onSubmit: (data: PharmacyFormData) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
    isRTL?: boolean;
}

const PharmacyAddForm = ({ onSubmit, onCancel, isLoading, isRTL }: PharmacyAddFormProps) => {
    const { t } = useTranslation();
    const [preview, setPreview] = useState<string>('');

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, setFieldValue: any) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
                setFieldValue('image', reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Formik
            initialValues={initialPharmacyData}
            validationSchema={pharmacySchema}
            onSubmit={onSubmit}
        >
            {({ errors, touched, setFieldValue, isSubmitting }) => (
                <Form className="space-y-6">
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
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setPreview('');
                                                setFieldValue('image', null);
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
                                onChange={(e) => handleImageChange(e, setFieldValue)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4">
                        <InputField
                            name="name"
                            label={t('pharmacy name')}
                            startIcon={Building2}
                            error={touched.name && errors.name ? errors.name : ''}
                            placeholder={t('enter pharmacy name')}
                        />

                        <InputField
                            name="address"
                            label={t('address')}
                            startIcon={MapPin}
                            error={touched.address && errors.address ? errors.address : ''}
                            placeholder={t('enter address')}
                        />

                        <InputField
                            name="phone"
                            label={t('phone')}
                            startIcon={Phone}
                            error={touched.phone && errors.phone ? errors.phone : ''}
                            placeholder={t('enter phone')}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <InputField
                                name="openHour"
                                label={t('opening hour')}
                                type="time"
                                isRTL={isRTL}
                                error={touched.openHour && errors.openHour ? errors.openHour : ''}
                            />
                            <InputField
                                name="closeHour"
                                label={t('closing hour')}
                                type="time"
                                isRTL={isRTL}
                                error={touched.closeHour && errors.closeHour ? errors.closeHour : ''}
                            />
                        </div>
                    </div>

                    {/* Actions */}
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
                            disabled={isLoading}
                            className="w-full px-4 py-2.5 text-sm font-medium text-white 
                             bg-primary rounded-lg hover:bg-primary-dark 
                             disabled:opacity-50 disabled:cursor-not-allowed
                             transition-colors duration-200
                             flex items-center justify-center gap-2"
                        >
                            {isLoading && (
                                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            )}
                            {t('save')}
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default PharmacyAddForm;