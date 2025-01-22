import { useRef, useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Search,
    PlusCircle,
    MapPin,
    Clock,
    Phone,
    Edit3,
    Trash2,
    Building2,
    Filter,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Eye,
    ArrowDownUp,
    ArrowLeftRight,
    Copy,
    ClipboardCheck,
    MessageSquare
} from 'lucide-react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PharmacyAddForm from '../components/PharmacyAddForm';
import Modal from '../components/Modal';
import DeletePharmacy from '../components/DeletePharmacy';
import PharmacyUpdateForm from '../components/PharmacyUpdateForm';
import { Pharmacy, PharmacyStatus } from '../types/pharmacy';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { pharmacyService } from '../services/pharmacy.service';

const Pharmacies = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.dir() === 'rtl';
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [pharmacyToDelete, setPharmacyToDelete] = useState<Pharmacy>();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [pharmacyToUpdate, setPharmacyToUpdate] = useState<Pharmacy | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    // Filter states
    const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'closed'>('all');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isStatusUpdating, setIsStatusUpdating] = useState<string | null>(null);

    const fetchPharmacies = useCallback(async () => {
        try {
            setError(null);
            setIsLoading(true);
            const pharmaciesData = await pharmacyService.getAllPharmacies();
            setPharmacies(pharmaciesData);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'error fetching pharmacies';
            setError(errorMessage);
            toast.error(t(errorMessage));
        } finally {
            setIsLoading(false);
        }
    }, [t]);

    useEffect(() => {
        fetchPharmacies();
    }, [fetchPharmacies]);

    const filteredPharmacies = pharmacies.filter((pharmacy: Pharmacy) => {

        if (!pharmacy || !pharmacy.name || !pharmacy.address) return false;
        const matchesSearchTerm = pharmacy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pharmacy.address.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatusFilter = statusFilter === 'all' || pharmacy.status === statusFilter;
        return matchesSearchTerm && matchesStatusFilter;
    });


    // Delete handlers
    const handleDeleteClick = (pharmacy: Pharmacy) => {
        setPharmacyToDelete(pharmacy);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteCancel = () => {
        setPharmacyToDelete(undefined);
        setIsDeleteModalOpen(false);
    };

    const handleDeleteConfirm = async () => {
        if (!pharmacyToDelete) return;

        try {
            setIsDeleting(true);
            await pharmacyService.deletePharmacy(pharmacyToDelete.id);

            // Update local state
            setPharmacies(prevPharmacies =>
                prevPharmacies.filter(p => p.id !== pharmacyToDelete.id)
            );

            toast.success(t('pharmacy deleted successfully'));
            handleDeleteCancel();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'error deleting pharmacy';
            toast.error(t(errorMessage));
        } finally {
            setIsDeleting(false);
        }
    };

    // Filter options configuration
    const statusOptions = [
        { value: 'all', label: t('all'), icon: Building2 },
        { value: 'open', label: t('open'), icon: CheckCircle2 },
        { value: 'closed', label: t('closed'), icon: XCircle }
    ];

    // ====== Refs & Effects ======
    const filterRef = useRef<HTMLDivElement>(null);

    // Handle click outside filter dropdown
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setIsFilterOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleUpdate = (pharmacy: Pharmacy) => {
        setPharmacyToUpdate(pharmacy);
        setIsUpdateModalOpen(true);
    };

    const handleUpdateSubmit = async (formData: FormData) => {
        if (!pharmacyToUpdate) return;

        try {
            setIsUpdating(true);
            await pharmacyService.updatePharmacy(pharmacyToUpdate.id, formData);
            await fetchPharmacies();

            toast.success(t('pharmacy updated successfully'));
            setIsUpdateModalOpen(false);
            setPharmacyToUpdate(null);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'error updating pharmacy';
            toast.error(t(errorMessage));
        } finally {
            setIsUpdating(false);
        }
    };

    // Add pharmacy handlers
    const handleAddPharmacy = async (formData: FormData) => {
        try {
            setIsLoading(true);
            formData.append('status', 'open');

            await pharmacyService.createPharmacy(formData);
            await fetchPharmacies();

            toast.success(t('pharmacy added successfully'));
            setIsAddModalOpen(false);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'error adding pharmacy';
            toast.error(t(errorMessage));
        } finally {
            setIsLoading(false);
        }
    };

    // Status toggle handler
    const toggleStatus = async (pharmacyId: string) => {
        try {
            setIsStatusUpdating(pharmacyId);
            await pharmacyService.updatePharmacyStatus(pharmacyId);

            setPharmacies(prevPharmacies =>
                prevPharmacies.map(p =>
                    p.id === pharmacyId
                        ? { ...p, status: p.status === 'open' ? ('close' as PharmacyStatus) : ('open' as PharmacyStatus) }
                        : p
                )
            );

            toast.success(t('status updated successfully'));
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'error updating status';
            toast.error(t(errorMessage));
            await fetchPharmacies();
        } finally {
            setIsStatusUpdating(null);
        }
    };

    // View pharmacy handler
    const handleView = (pharmacy: Pharmacy) => {
        console.log('View pharmacy:', pharmacy);
    };

    const handleCopyCoordinate = (value: number, type: 'latitude' | 'longitude') => {
        navigator.clipboard.writeText(value.toString());

        // Afficher une notification toast
        toast.success(
            <div className="flex items-center gap-2">
                <ClipboardCheck className="w-4 h-4" />
                <span>{t('coordinate copied', { type: t(type) })}</span>
            </div>
        );
    };

    return (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm">
            {/* Header */}
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                <div className="flex items-center gap-3">
                    <Building2 className="w-8 h-8 text-primary" />
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{t('Pharmacies')}</h3>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder={t('search pharmacy...')}
                            className="pl-10 pr-4 py-2.5 rounded-full border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-1 focus:ring-primary focus:border-primary outline-none w-72 transition-all duration-300"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-primary w-5 h-5" />
                    </div>
                    <div className="relative">
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-full border ${statusFilter !== 'all'
                                ? 'border-primary text-primary bg-primary/10'
                                : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                                } hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300`}
                        >
                            <Filter className="w-5 h-5" />
                            {t('status')}: {t(statusFilter)}
                        </button>

                        {/* Dropdown Menu */}
                        {isFilterOpen && (
                            <div className="absolute top-full mt-2 right-0 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                                {statusOptions.map((option) => {
                                    const Icon = option.icon;
                                    return (
                                        <button
                                            key={option.value}
                                            onClick={() => {
                                                setStatusFilter(option.value as 'all' | 'open' | 'closed');
                                                setIsFilterOpen(false);
                                            }}
                                            className={`w-full flex items-center gap-2 px-4 py-2 text-sm ${statusFilter === option.value
                                                ? 'bg-primary/10 text-primary'
                                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                                } transition-colors duration-200`}
                                        >
                                            <Icon className="w-4 h-4" />
                                            {option.label}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                    <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary text-white hover:bg-primary-dark transition-all duration-300">
                        <PlusCircle className="w-5 h-5" />
                        {t('add pharmacy')}
                    </button>
                </div>
            </div>

            {/* Loading state */}
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
                </div>
            ) : (
                <>

                    {/* Table */}
                    <div className="relative overflow-hidden">
                        <PerfectScrollbar className="relative w-full rounded-lg">
                            <div className="rounded-lg min-w-full align-middle">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="sticky top-0 bg-primary dark:bg-gray-800/60">
                                        <tr className="bg-primary dark:bg-gray-800/60">
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-white">{t('image')}</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-white">{t('name')}</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-white">{t('address')}</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-white">{t('hours')}</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-white">{t('phone')}</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-white">{t('latitude')}</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-white">{t('longitude')}</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-white">{t('status')}</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-white">{t('actions')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {filteredPharmacies.map((pharmacy) => (
                                            <tr key={pharmacy.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors duration-200">
                                                <td className="px-6 py-4">
                                                    <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary/20 hover:ring-primary transition-all duration-300">
                                                        <img src={pharmacy.image} alt={pharmacy.name} className="w-full h-full object-cover" />
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-gray-800 dark:text-gray-200 font-medium">{pharmacy.name}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                        <MapPin className="w-4 h-4 shrink-0" />
                                                        <span className="truncate max-w-[200px]" title={pharmacy.address} dir={isRTL ? 'rtl' : 'ltr'}>
                                                            {pharmacy.address}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                                            <Clock className="w-4 h-4" />
                                                            <span className="text-sm">{pharmacy.openHours}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                                                            <Clock className="w-4 h-4" />
                                                            <span className="text-sm">{pharmacy.closeHours}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                        <Phone className="w-4 h-4 shrink-0" />
                                                        <span className="truncate max-w-[150px]" title={pharmacy.telephone} dir={isRTL ? 'rtl' : 'ltr'}>
                                                            {pharmacy.telephone}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/50">
                                                            <ArrowDownUp className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                                                            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                                                                {pharmacy.latitude}°N
                                                            </span>
                                                        </div>
                                                        <button
                                                            onClick={() => handleCopyCoordinate(pharmacy.latitude, 'latitude')}
                                                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors duration-150"
                                                            title={t('copy to clipboard')}
                                                        >
                                                            <Copy className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-green-50 dark:bg-green-900/50">
                                                            <ArrowLeftRight className="w-3.5 h-3.5 text-green-500 dark:text-green-400" />
                                                            <span className="text-sm font-medium text-green-700 dark:text-green-300">
                                                                {pharmacy.longLatitude}°E
                                                            </span>
                                                        </div>
                                                        <button
                                                            onClick={() => handleCopyCoordinate(pharmacy.longLatitude, 'longitude')}
                                                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors duration-150"
                                                            title={t('copy to clipboard')}
                                                        >
                                                            <Copy className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => toggleStatus(pharmacy.id)}
                                                        disabled={isStatusUpdating === pharmacy.id}
                                                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 hover:shadow-sm ${pharmacy.status === 'open'
                                                                ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-500/30'
                                                                : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-500/30'
                                                            }`}
                                                        title={t(pharmacy.status === 'open' ? 'click to close' : 'click to open')}>
                                                        {isStatusUpdating === pharmacy.id ? (
                                                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                        ) : (
                                                            <>
                                                                {pharmacy.status === 'open' ? (
                                                                    <>
                                                                        <CheckCircle2 className="w-4 h-4" />
                                                                        <span>{t('open')}</span>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <XCircle className="w-4 h-4" />
                                                                        <span>{t('closed')}</span>
                                                                    </>
                                                                )}
                                                            </>
                                                        )}
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        {/* View comments button */}
                                                        <button
                                                            onClick={() => navigate(`/pharmacies/${pharmacy.id}/comments`)}
                                                            className="group p-2 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 transition-all duration-300 flex items-center gap-2"
                                                            title={t('view_comments')}>
                                                            <MessageSquare className="w-5 h-5 text-blue-500 group-hover:text-blue-600 dark:text-blue-400" />
                                                        </button>
                                                        {/* View Button */}
                                                        <button
                                                            onClick={() => handleView(pharmacy)}
                                                            className="group p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all duration-300"
                                                            title={t('view')}
                                                        >
                                                            <Eye className="w-5 h-5 text-blue-500 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                                                        </button>

                                                        {/* Edit Button */}
                                                        <button
                                                            onClick={() => handleUpdate(pharmacy)}
                                                            className="group p-2 rounded-lg hover:bg-primary/10 transition-all duration-300"
                                                            title={t('edit')}
                                                        >
                                                            <Edit3 className="w-5 h-5 text-primary group-hover:text-primary-dark" />
                                                        </button>

                                                        {/* Delete Button */}
                                                        <button
                                                            onClick={() => handleDeleteClick(pharmacy)}
                                                            className="group p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-all duration-300"
                                                            title={t('delete')}
                                                        >
                                                            <Trash2 className="w-5 h-5 text-red-500 group-hover:text-red-600 dark:group-hover:text-red-400" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </PerfectScrollbar>
                    </div>

                    {filteredPharmacies.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12">
                            <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                {t('no pharmacies found')}
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                {t('try different search')}
                            </p>
                        </div>
                    )}
                </>
            )}

            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title={t('add pharmacy')}>
                <PharmacyAddForm onSubmit={handleAddPharmacy} onCancel={() => setIsAddModalOpen(false)} />
            </Modal>

            <Modal
                isOpen={isUpdateModalOpen}
                onClose={() => setIsUpdateModalOpen(false)}
                title={t('update pharmacy')}
            >
                {pharmacyToUpdate && (
                    <PharmacyUpdateForm
                        pharmacy={pharmacyToUpdate}
                        onSubmit={handleUpdateSubmit}
                        onCancel={() => setIsUpdateModalOpen(false)}
                        isLoading={isUpdating}
                        isRTL={isRTL}
                    />
                )}
            </Modal>

            <DeletePharmacy
                isOpen={isDeleteModalOpen}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                pharmacyName={pharmacyToDelete?.name || ''}
                isLoading={isDeleting}
            />
        </div>
    );
};

export default Pharmacies;