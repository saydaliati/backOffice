import * as Yup from 'yup';
import i18next from 'i18next';
import { PharmacyStatus } from '../types/pharmacy';

const t = (key: string) => i18next.t(key);

export const pharmacyFormSchema = Yup.object().shape({
    name: Yup.string()
        .required('name required'),
    address: Yup.string()
        .required('address required'),
    telephone: Yup.string()
        .required('phone required')
        .matches(/^\+?[1-9]\d{1,14}$/, 'invalid phone number'),
    openHours: Yup.string()
        .required('opening hour required')
        .matches(/^([01]?[0-9]|2[0-3]):([0-5]?[0-9])$/, 'opening hour must be in HH:mm format'),
    closeHours: Yup.string()
        .required('closing hour required')
        .matches(/^([01]?[0-9]|2[0-3]):([0-5]?[0-9])$/, 'closing hour must be in HH:mm format'),
    latitude: Yup.string()
        .required('latitude required'),
    longLatitude: Yup.string()
        .required('longitude required'),
    image: Yup.mixed()
        .nullable()
        .optional(),
    status: Yup.string()
        .oneOf(Object.values(PharmacyStatus))
        .default(PharmacyStatus.OPEN)
}); 