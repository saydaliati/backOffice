import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';
import InputField from './InputField';

interface DeletePharmacyProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    pharmacyName: string;
    isLoading?: boolean;
}

const DeletePharmacy = ({ isOpen, onClose, onConfirm, pharmacyName, isLoading }: DeletePharmacyProps) => {
    const { t } = useTranslation();
    const [confirmText, setConfirmText] = useState('');
    const [isButtonEnabled, setIsButtonEnabled] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setConfirmText('');
            setIsButtonEnabled(false);
        }
    }, [isOpen]);

    const handleConfirmTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setConfirmText(value);
        setIsButtonEnabled(value === pharmacyName);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('delete pharmacy')} size="sm">
            <div className="flex flex-col items-center text-center">
                {/* Warning Icon */}
                <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-4">
                    <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>

                {/* Warning Message */}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {t('Are you sure delete')}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                    {t('delete pharmacy warning')}
                </p>

                {/* Confirmation Input */}
                <div className="w-full mb-6">
                    <InputField
                        type="text"
                        value={confirmText}
                        label={t('type name to confirm')} 
                        onChange={handleConfirmTextChange}
                        className={`form-input w-full ${!isButtonEnabled && confirmText && 'border-red-500 dark:border-red-500'}`}
                        placeholder={pharmacyName}
                        autoComplete="off"
                    />
                </div>

                {/* Actions */}
                <div className="flex gap-3 w-full">
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 
                                 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 
                                 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 
                                 transition-colors duration-200"
                        disabled={isLoading}
                    >
                        {t('cancel')}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={!isButtonEnabled || isLoading}
                        className="w-full px-4 py-2.5 text-sm font-medium text-white 
                                 bg-red-500 rounded-lg
                                 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed
                                 transition-colors duration-200
                                 flex items-center justify-center gap-2">
                        {isLoading && (
                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        )}
                        {t('delete')}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default DeletePharmacy;