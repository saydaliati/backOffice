import { lazy } from 'react';
const Index = lazy(() => import('../pages/Pharmacies'));
const PharmacyComments = lazy(() => import('../pages/PharmacyComments'));

const routes = [
    // dashboard
    {
        path: '/pharmacies',
        element: <Index />,
        layout: 'default',
    },
    {
        path: '/pharmacies/:id/comments',
        element: <PharmacyComments />,
        layout: 'default',
    },
];

export { routes };
