import { useTranslation } from 'react-i18next';
import { Calendar, Clock, MessageSquare, User } from 'lucide-react';
import Modal from './Modal';

interface CommentViewModalProps {
    comment: any;
    isOpen: boolean;
    onClose: () => void;
}

const CommentViewModal = ({ comment, isOpen, onClose }: CommentViewModalProps) => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    if (!isOpen || !comment) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('comment details')}>
            {/* Card principale */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
                {/* En-tête avec info utilisateur */}
                <div className="p-6 bg-gradient-to-r from-primary/5 via-transparent to-primary/5">
                    <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        {/* Avatar */}
                        <div className="relative">
                            {comment.userAvatar ? (
                                <img
                                    src={comment.userAvatar}
                                    alt={comment.username}
                                    className="w-12 h-12 rounded-full object-cover ring-2 ring-white dark:ring-gray-700 shadow-md"
                                />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                    <User className="w-6 h-6 text-primary" />
                                </div>
                            )}
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white dark:border-gray-700"></div>
                        </div>

                        {/* Info utilisateur */}
                        <div className="flex-1 min-w-0">
                            <h4 className={`font-medium text-gray-900 dark:text-white truncate ${isRTL ? 'font-cairo text-right' : ''}`}>
                                {comment.username}
                            </h4>
                            {/* Métadonnées */}
                            <div className={`flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <div className={`flex items-center gap-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <Calendar className="w-4 h-4" />
                                    <span dir={isRTL ? 'rtl' : 'ltr'}>
                                        {new Date(comment.createdAt).toLocaleDateString(isRTL ? 'ar-SA' : 'fr-FR')}
                                    </span>
                                </div>
                                <span className="text-gray-300 dark:text-gray-600">•</span>
                                <div className={`flex items-center gap-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <Clock className="w-4 h-4" />
                                    <span dir={isRTL ? 'rtl' : 'ltr'}>
                                        {new Date(comment.createdAt).toLocaleTimeString(isRTL ? 'ar-SA' : 'fr-FR')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contenu du commentaire */}
                <div className="p-6">
                    <div className="relative text-left">
                        <MessageSquare className="absolute top-0 left-0 w-8 h-8 text-primary/10 transform -translate-x-2" />
                        <div className="relative">
                            <p className={`text-gray-600 dark:text-gray-300 leading-relaxed ${isRTL ? 'font-cairo pr-8' : 'pl-8'}`}>
                                {comment.comment}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer avec actions */}
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700">
                    <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <button
                            onClick={onClose}
                            className={`
                                flex items-center gap-2 px-4 py-2 
                                text-sm font-medium text-gray-700 dark:text-gray-200
                                bg-white dark:bg-gray-700 
                                rounded-lg border border-gray-200 dark:border-gray-600
                                hover:bg-gray-50 dark:hover:bg-gray-600
                                transition-colors duration-200
                                ${isRTL ? 'flex-row-reverse font-cairo' : ''}
                            `}
                        >
                            <span>{t('close')}</span>
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default CommentViewModal;