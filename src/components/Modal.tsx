import { Fragment, PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface ModalProps extends PropsWithChildren {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    isRTL?: boolean;
}

const Modal = ({ isOpen, onClose, title, description, children, size = 'md', isRTL = false }: ModalProps) => {
    const { t } = useTranslation();
    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl'
    };

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <Fragment>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-50 overflow-y-auto">
                        <div className="min-h-full flex items-center justify-center p-4">
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className={`
                                    relative w-full ${sizeClasses[size]} 
                                    bg-white dark:bg-gray-800 
                                    shadow-xl shadow-black/10 dark:shadow-black/20
                                    rounded-2xl overflow-hidden
                                `}
                            >
                                {/* Header */}
                                <div className="relative px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                                    <div className="flex justify-between items-center">
                                        <h3 className={`text-xl font-semibold text-gray-900 dark:text-white ${isRTL ? 'order-2' : ''}`}>
                                            {title}
                                        </h3>
                                        {description && (
                                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                {description}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className={`absolute ltr:right-4 rtl:left-4 top-4 p-2 rounded-full 
                                             text-gray-400 hover:text-gray-500 
                                             dark:hover:text-gray-300
                                             hover:bg-gray-100 dark:hover:bg-gray-700
                                             transition-colors duration-200`}
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="px-6 py-5">
                                    {children}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </Fragment>
            )}
        </AnimatePresence>,
        document.getElementById('modal-portal')!
    );
};

export default Modal;