import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { t } = useTranslation();
    
    return (
        <div className="dark:text-white-dark text-center ltr:sm:text-left rtl:sm:text-right p-6 mt-auto">
            {t('saydaliati all rights reserved')} © {new Date().getFullYear()}
        </div>
    );
};

export default Footer;