export interface Pharmacy {
    id: string;
    image: string;
    name: string;
    address: string;
    openHour: string;
    closeHour: string;
    phone: string;
    latitude: number;
    longitude: number;
    status: 'open' | 'closed';
}