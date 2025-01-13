import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Trash2,
    MessageSquare,
    ArrowLeft,
    Eye,
    Search,
    User,
    Clock,
    ChevronDown,
    Calendar,
    X
} from 'lucide-react';
import { toast } from 'sonner';
import CommentViewModal from '../components/CommentViewModal';

interface Comment {
    id: string;
    userId: string;
    username: string;
    userAvatar: string;
    comment: string;
    createdAt: string;
}

const PharmacyComments = () => {
    const { t } = useTranslation();
    const { pharmacyId } = useParams();
    const navigate = useNavigate();
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [pharmacyName, setPharmacyName] = useState('');
    const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredComments, setFilteredComments] = useState<Comment[]>([]);

    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredComments(comments);
            return;
        }

        const searchTermLower = searchTerm.toLowerCase();
        const filtered = comments.filter(comment =>
            comment.username.toLowerCase().includes(searchTermLower) ||
            comment.comment.toLowerCase().includes(searchTermLower) ||
            new Date(comment.createdAt).toLocaleDateString().toLowerCase().includes(searchTermLower)
        );

        setFilteredComments(filtered);
    }, [searchTerm, comments]);

    useEffect(() => {
        fetchPharmacyComments();
    }, [pharmacyId]);

    const fetchPharmacyComments = async () => {
        try {
            // Simulation d'appel API
            setTimeout(() => {
                const mockComments = [
                    {
                        id: '1',
                        userId: 'user1',
                        username: 'John Doe',
                        userAvatar: 'https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC&color=fff',
                        comment: 'Excellent service, très professionnel ! Le personnel est attentif et compétent.',
                        createdAt: '2024-01-15T10:30:00',
                    },
                    {
                        id: '2',
                        userId: 'user2',
                        username: 'Marie Dubois',
                        userAvatar: 'https://ui-avatars.com/api/?name=Marie+Dubois&background=FF6B6B&color=fff',
                        comment: 'Très satisfaite de ma visite. Les conseils étaient pertinents et précis.',
                        createdAt: '2024-01-16T14:45:00',
                    },
                    {
                        id: '3',
                        userId: 'user3',
                        username: 'Pierre Martin',
                        userAvatar: 'https://ui-avatars.com/api/?name=Pierre+Martin&background=51CF66&color=fff',
                        comment: 'Pharmacie moderne et bien équipée. Service rapide et efficace.',
                        createdAt: '2024-01-17T09:15:00',
                    },
                    {
                        id: '4',
                        userId: 'user4',
                        username: 'Sophie Bernard',
                        userAvatar: 'https://ui-avatars.com/api/?name=Sophie+Bernard&background=845EF7&color=fff',
                        comment: 'Équipe très sympathique et professionnelle. Je recommande !',
                        createdAt: '2024-01-18T16:20:00',
                    },
                ];

                setComments(mockComments);
                setPharmacyName('Pharmacie Centrale');
                setLoading(false);
            }, 1000);
        } catch (error) {
            toast.error(t('error_loading_comments'));
            setLoading(false);
        }
    };

    const handleDelete = async (commentId: string) => {
        try {
            // Simulation de suppression
            setComments(comments.filter(c => c.id !== commentId));
            toast.success(t('comment deleted successfully'));
        } catch (error) {
            toast.error(t('error deleting comment'));
        }
    };

    return (
        <div className="min-h-screen rounded-xl bg-gray-50 dark:bg-gray-900 p-4 sm:px-6">
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 rtl:rotate-180 text-gray-600 dark:text-gray-400" />
                    </button>
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {pharmacyName}
                    </h1>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
                    <div className="relative flex-1 max-w-md">
                        <input
                            type="text"
                            placeholder={t('Search comments...')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 rounded-full border border-gray-200 outline-none dark:border-gray-700 focus:ring-2 focus:ring-primary text-gray-900 dark:text-white"
                        />
                        <Search className="w-5 h-5 text-primary absolute left-3 top-1/2 transform -translate-y-1/2" />

                    </div>
                    <div className="flex items-center gap-2 text-sm bg-primary text-white rounded-full px-4 py-2">
                        <User className="w-4 h-4 text-white" />
                        <span>{filteredComments.length} {t('comments')}</span>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-60">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
                    </div>
                ) : filteredComments.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredComments.map((comment) => (
                            <div
                                key={comment.id}
                                className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 hover:border-primary dark:hover:border-primary transition-colors duration-200"
                            >
                                <div className="flex items-start gap-3">
                                    <img
                                        src={comment.userAvatar}
                                        alt={comment.username}
                                        className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-700"
                                    />

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <h3 className="font-medium text-gray-900 dark:text-white truncate">
                                                    {comment.username}
                                                </h3>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <Calendar className="w-3 h-3 text-gray-400" />
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                        {new Date(comment.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => {
                                                        setSelectedComment(comment);
                                                        setIsViewModalOpen(true);
                                                    }}
                                                    className="p-1 hover:text-primary transition-colors"
                                                    title={t('view_comment')}
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(comment.id)}
                                                    className="p-1 hover:text-red-500 transition-colors"
                                                    title={t('delete_comment')}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-1 break-words">
                                            {comment.comment}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <MessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                            {t('no results found')}
                        </h3>
                    </div>
                )}
            </div>

            <CommentViewModal
                comment={selectedComment}
                isOpen={isViewModalOpen}
                onClose={() => {
                    setIsViewModalOpen(false);
                    setSelectedComment(null);
                }}
            />
        </div>
    );
};

export default PharmacyComments;