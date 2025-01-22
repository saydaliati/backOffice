
export enum PharmacyStatus {
    OPEN = 'open',
    CLOSE = 'close'
}

export interface Pharmacy {
    id: string;
    name: string;
    image?: string;
    address: string;
    latitude: string;
    longLatitude: string;
    openHours: string;
    closeHours: string;
    telephone: string;
    status: PharmacyStatus;
}

export interface PharmacyFormData {
    name: string;
    address: string;
    openHours: string;
    closeHours: string;
    telephone: string; 
    latitude: string;
    longLatitude: string; 
    image?: string;
    status?: PharmacyStatus;
    createdAt?: Date;
    updatedAt?: Date;
}