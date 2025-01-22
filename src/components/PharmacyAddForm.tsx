import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowDownUp, ArrowLeftRight, Building2, MapPin, Phone, Upload, X } from 'lucide-react';
import InputField from './InputField';

interface PharmacyAddFormProps {
    onSubmit: (data: FormData) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
    isRTL?: boolean;
}

const PharmacyAddForm = ({ onSubmit, onCancel, isLoading, isRTL }: PharmacyAddFormProps) => {
    const { t } = useTranslation();
    const [preview, setPreview] = useState<string>('');
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        telephone: '',
        latitude: '',
        longLatitude: '',
        openHours: '',
        closeHours: '',
        image: null as File | null
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData(prev => ({ ...prev, image: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const submitData = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value) submitData.append(key, value);
        });
        await onSubmit(submitData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
            {/* Image Upload */}
            <div className="flex justify-center">
                <div className="relative group w-36 h-32">
                    <div className={`w-full h-full rounded-xl overflow-hidden border-2 
                        ${preview ? 'border-primary' : 'border-dashed border-primary dark:border-gray-500'}
                        hover:border-primary transition-colors`}>
                        {preview ? (
                            <div className="relative h-full">
                                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setPreview('');
                                        setFormData(prev => ({ ...prev, image: null }));
                                    }}
                                    className="absolute top-2 right-2 p-1 bg-red-500/80 rounded-full text-white 
                                             opacity-0 group-hover:opacity-100 transition-opacity"
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
                        label={t('pharmacy name')}
                        startIcon={Building2}
                        value={formData.name}
                        onChange={handleChange}
                        placeholder={t('enter pharmacy name')}
                    />
                    <InputField
                        name="telephone"
                        label={t('phone')}
                        startIcon={Phone}
                        value={formData.telephone}
                        onChange={handleChange}
                        placeholder={t('enter phone number')}
                    />
                </div>

                <InputField
                    name="address"
                    label={t('address')}
                    startIcon={MapPin}
                    value={formData.address}
                    onChange={handleChange}
                    placeholder={t('enter address')}
                />

                <div className="grid grid-cols-2 gap-4">
                    <InputField
                        name="latitude"
                        label={t('latitude')}
                        startIcon={ArrowDownUp}
                        type="text"
                        value={formData.latitude}
                        onChange={handleChange}
                        placeholder={t('enter latitude')}
                    />
                    <InputField
                        name="longLatitude"
                        label={t('longitude')}
                        startIcon={ArrowLeftRight}
                        type="text"
                        value={formData.longLatitude}
                        onChange={handleChange}
                        placeholder={t('enter longitude')}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <InputField
                        name="openHours"
                        label={t('opening hour')}
                        type="time"
                        value={formData.openHours}
                        onChange={handleChange}
                        isRTL={isRTL}
                        placeholder={t('enter opening hour')}
                    />
                    <InputField
                        name="closeHours"
                        label={t('closing hour')}
                        type="time"
                        value={formData.closeHours}
                        onChange={handleChange}
                        isRTL={isRTL}
                        placeholder={t('enter closing hour')}
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
        </form>
    );
};

export default PharmacyAddForm;