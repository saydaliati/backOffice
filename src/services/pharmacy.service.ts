import { AxiosResponse } from 'axios';
import axiosInstance from '../config/axios';
import { Pharmacy } from '../types/pharmacy';

class PharmacyService {
    private readonly BASE_PATH = '/pharmacy';

    async getAllPharmacies(): Promise<Pharmacy[]> {
        const response: AxiosResponse<Pharmacy[]> = await axiosInstance.get(this.BASE_PATH);
        return response.data;
    }

    async getPharmacyById(id: string): Promise<Pharmacy> {
        const response: AxiosResponse<Pharmacy> = await axiosInstance.get(`${this.BASE_PATH}/${id}`);
        return response.data;
    }

    async createPharmacy(formData: FormData): Promise<Pharmacy> {
        const response = await axiosInstance.post(
            `${this.BASE_PATH}/createPharmacy`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        console.log(response.data);
        return response.data;
    }

    async updatePharmacy(id: string, pharmacyData: Partial<Pharmacy>): Promise<Pharmacy> {
        const response: AxiosResponse<Pharmacy> = await axiosInstance.patch(
            `${this.BASE_PATH}/${id}`,
            pharmacyData
        );
        return response.data;
    }

    async deletePharmacy(id: string): Promise<void> {
        await axiosInstance.delete(`${this.BASE_PATH}/${id}`);
    }

    async updatePharmacyStatus(id: string): Promise<Pharmacy> {
        const response: AxiosResponse<Pharmacy> = await axiosInstance.patch(
            `${this.BASE_PATH}/updateStatus/${id}`
        );
        return response.data;
    }
}

export const pharmacyService = new PharmacyService(); 