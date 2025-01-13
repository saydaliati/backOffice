import { useRef, useEffect, useState } from 'react';
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
    Eye
} from 'lucide-react';
import PharmacyAddForm from '../components/PharmacyAddForm';
import Modal from '../components/Modal';
import DeletePharmacy from '../components/DeletePharmacy';
import PharmacyUpdateForm from '../components/PharmacyUpdateForm';
import { Pharmacy } from '../types/pharmacy';
const Pharmacies = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.dir() === 'rtl';
    const [searchTerm, setSearchTerm] = useState('');
    const [pharmacies, setPharmacies] = useState<Pharmacy[]>([
        {
            id: '1',
            image: '/assets/pharmacy1.jpg',
            name: 'Pharmacie Centrale',
            address: '123 Rue Mohammed V, Casablanca',
            openHour: '08:00',
            closeHour: '23:00',
            phone: '+212 522-123456',
            status: 'open'
        },
        {
            id: '2',
            image: '/assets/pharmacy2.jpg',
            name: 'Pharmacie Al Amal',
            address: '45 Avenue Hassan II, Rabat',
            openHour: '09:00',
            closeHour: '22:00',
            phone: '+212 537-789012',
            status: 'closed'
        }
    ]);

    // ====== States ======
    // Modal states
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

    // ====== Handlers ======
    // Update pharmacy handlers
    const handleUpdate = (pharmacy: Pharmacy) => {
        setPharmacyToUpdate(pharmacy);
        setIsUpdateModalOpen(true);
    };

    const handleUpdateSubmit = async (data: any) => {
        try {
            setIsUpdating(true);
            // Update pharmacy logic
            console.log('Updating pharmacy:', { ...pharmacyToUpdate, ...data });

            // Update local state
            setPharmacies(prevPharmacies =>
                prevPharmacies.map(p =>
                    p.id === pharmacyToUpdate?.id ? { ...p, ...data } : p
                )
            );

            // Reset modal state
            setIsUpdateModalOpen(false);
            setPharmacyToUpdate(null);
        } catch (error) {
            console.error('Error updating pharmacy:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    // Add pharmacy handlers
    const handleAddPharmacy = async (data: any) => {
        console.log('New pharmacy data:', data);
        // Add pharmacy logic here
        setIsAddModalOpen(false);
    };

    // Delete pharmacy handlers
    const handleDelete = (pharmacy: Pharmacy) => {
        setPharmacyToDelete(pharmacy);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!pharmacyToDelete) return;

        try {
            setIsDeleting(true);
            // Delete pharmacy logic here
            console.log('Deleting pharmacy:', pharmacyToDelete);

            // Reset modal state
            setIsDeleteModalOpen(false);
            setPharmacyToDelete(undefined);
        } catch (error) {
            console.error('Error deleting pharmacy:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    // Status toggle handler
    const toggleStatus = (pharmacyId: string) => {
        setPharmacies(prevPharmacies =>
            prevPharmacies.map(p =>
                p.id === pharmacyId
                    ? { ...p, status: p.status === 'open' ? 'closed' : 'open' }
                    : p
            )
        );
    };

    // View pharmacy handler
    const handleView = (pharmacy: Pharmacy) => {
        console.log('View pharmacy:', pharmacy);
    };

    // ====== Filters ======
    // Apply filters to pharmacies
    const filteredPharmacies = pharmacies.filter(pharmacy => {
        const matchesSearchTerm = pharmacy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pharmacy.address.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatusFilter = statusFilter === 'all' || pharmacy.status === statusFilter;
        return matchesSearchTerm && matchesStatusFilter;
    });

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
                            className="pl-10 pr-4 py-2.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none w-72 transition-all duration-300"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
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

            {/* Table */}
            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-gray-800/60">
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">{t('image')}</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">{t('name')}</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">{t('address')}</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">{t('hours')}</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">{t('phone')}</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">{t('status')}</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">{t('actions')}</th>
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
                                            <span className="text-sm">{pharmacy.openHour}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                                            <Clock className="w-4 h-4" />
                                            <span className="text-sm">{pharmacy.closeHour}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                        <Phone className="w-4 h-4 shrink-0" />
                                        <span className="truncate max-w-[150px]" title={pharmacy.phone} dir={isRTL ? 'rtl' : 'ltr'}>
                                            {pharmacy.phone}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => toggleStatus(pharmacy.id)}
                                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 hover:shadow-sm ${pharmacy.status === 'open'
                                            ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-500/30'
                                            : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-500/30'
                                            }`}
                                        title={t(pharmacy.status === 'open' ? 'click_to_close' : 'click_to_open')}
                                    >
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
                                    </button>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
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
                                            onClick={() => handleDelete(pharmacy)}
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

            {/* Message si aucune pharmacie trouvée */}
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
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                pharmacyName={pharmacyToDelete?.name || ''}
                isLoading={isDeleting}
            />
        </div>
    );
};

export default Pharmacies;