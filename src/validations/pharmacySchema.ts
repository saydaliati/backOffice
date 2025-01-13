import * as Yup from 'yup';
import i18next from 'i18next';

const t = (key: string) => i18next.t(key);

export const PHARMACY_VALIDATION = {
    TIME: {
        DEFAULT_OPEN: '09:00',
        DEFAULT_CLOSE: '18:00',
    },
    IMAGE: {
        MAX_SIZE: 5 * 1024 * 1024,
        ACCEPTED_TYPES: ['image/jpeg', 'image/png', 'image/webp'] as const,
    },
} as const;

export const pharmacySchema = Yup.object({
    name: Yup.string()
        .required(t('name required'))
        .min(3, t('name too short'))
        .max(50, t('name too long')),

    address: Yup.string()
        .required(t('address required'))
        .min(5, t('address too short')),

    phone: Yup.string()
        .required(t('phone required'))
        .matches(/^\+?[\d\s-()]+$/, t('invalid phone')),

    openHour: Yup.string()
        .required(t('opening hour required')),

    closeHour: Yup.string()
        .required(t('closing hour required'))
        .test('is-after-open', t('invalid closing time'), 
            (value, ctx) => !value || !ctx.parent.openHour || value > ctx.parent.openHour
        ),

    image: Yup.string().nullable(),
});

export type PharmacyFormData = Yup.InferType<typeof pharmacySchema>;

export const initialPharmacyData = {
    name: '',
    address: '',
    openHour: PHARMACY_VALIDATION.TIME.DEFAULT_OPEN,
    closeHour: PHARMACY_VALIDATION.TIME.DEFAULT_CLOSE,
    phone: '',
    image: null,
} as const satisfies Partial<PharmacyFormData>;