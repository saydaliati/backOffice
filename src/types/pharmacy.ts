export interface Pharmacy {
    id: string;
    image: string;
    name: string;
    address: string;
    openHour: string;
    closeHour: string;
    phone: string;
    status: 'open' | 'closed';
}