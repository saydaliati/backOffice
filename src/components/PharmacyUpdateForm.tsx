import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { Building2, MapPin, Phone, Clock, X, Upload } from 'lucide-react';
import { pharmacySchema, PHARMACY_VALIDATION } from '../validations/pharmacySchema';
import InputField from './InputField';

interface PharmacyUpdateFormProps {
    pharmacy: Pharmacy;
    onSubmit: (values: any) => void;
    onCancel: () => void;
    isLoading?: boolean;
    isRTL?: boolean;
}

interface Pharmacy {
    id: string;
    image: string;
    name: string;
    address: string;
    openHour: string;
    closeHour: string;
    phone: string;
    status: 'open' | 'closed';
}

const PharmacyUpdateForm = ({ pharmacy, onSubmit, onCancel, isLoading, isRTL }: PharmacyUpdateFormProps) => {
    const { t } = useTranslation();

    const {
        handleSubmit,
        handleChange,
        setFieldValue,
        values,
        touched,
        errors,
    } = useFormik({
        initialValues: {
            name: pharmacy.name,
            address: pharmacy.address,
            phone: pharmacy.phone,
            openHour: pharmacy.openHour,
            closeHour: pharmacy.closeHour,
            image: pharmacy.image || '',
        },
        validationSchema: pharmacySchema,
        onSubmit: (values) => {
            onSubmit(values);
        },
    });

    const handleImageChange = async (
        e: React.ChangeEvent<HTMLInputElement>,
        setFieldValue: (field: string, value: any) => void
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validation de la taille
        if (file.size > PHARMACY_VALIDATION.IMAGE.MAX_SIZE) {
            alert(t('image too large'));
            return;
        }

        // Validation du type
        if (!PHARMACY_VALIDATION.IMAGE.ACCEPTED_TYPES.includes(file.type as any)) {
            alert(t('invalid image type'));
            return;
        }

        // Convertir en base64
        const reader = new FileReader();
        reader.onloadend = () => {
            setFieldValue('image', reader.result);
        };
        reader.readAsDataURL(file);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div className="flex justify-center">
                <div className="relative group w-36 h-32">
                    <div className={`w-full h-full rounded-xl overflow-hidden border-2
                     ${values.image ? 'border-primary border-dashed' : 'border-dashed border-primary dark:border-gray-500'}
                     hover:border-primary transition-colors`}>
                        {values.image ? (
                            <div className="relative h-full">
                                <img
                                    src={values.image}
                                    alt={values.name}
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => setFieldValue('image', '')}
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
                    value={values.name}
                    onChange={handleChange}
                    label={t('pharmacy name')}
                    startIcon={Building2}
                    error={touched.name && errors.name ? errors.name : ''}
                    placeholder={t('enter pharmacy name')}
                />

                <InputField
                    name="address"
                    value={values.address}
                    onChange={handleChange}
                    label={t('pharmacy address')}
                    startIcon={MapPin}
                    error={touched.address && errors.address ? errors.address : ''}
                    placeholder={t('enter address')}
                />

                <InputField
                    name="phone"
                    value={values.phone}
                    onChange={handleChange}
                    label={t('pharmacy phone')}
                    startIcon={Phone}
                    error={touched.phone && errors.phone ? errors.phone : ''}
                    placeholder={t('enter phone')}
                    dir="ltr"
                />

                <div className="grid grid-cols-2 gap-4">
                    <InputField
                        type="time"
                        name="openHour"
                        value={values.openHour}
                        onChange={handleChange}
                        label={t('opening hour')}
                        error={touched.openHour && errors.openHour ? errors.openHour : ''}
                        dir="ltr"
                    />

                    <InputField
                        type="time"
                        name="closeHour"
                        value={values.closeHour}
                        onChange={handleChange}
                        label={t('closing hour')}
                        error={touched.closeHour && errors.closeHour ? errors.closeHour : ''}
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
                    {t('update')}
                </button>
            </div>
        </form>
    );
};

export default PharmacyUpdateForm; 