import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Basic translation resources
const resources = {
    en: {
        translation: {
            "Welcome": "Welcome to CSGORoll Price Tracker"
        }
    },
    vi: {
        translation: {
            "Welcome": "Chào mừng đến với CSGORoll Price Tracker"
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "en", // default language
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
