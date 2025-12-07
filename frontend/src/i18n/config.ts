import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Translation resources
const resources = {
    en: {
        translation: {
            // Common
            welcome: 'Welcome',
            continue: 'Continue',
            back: 'Back',
            save: 'Save',
            cancel: 'Cancel',
            // Add more translations as needed
        }
    },
    hi: {
        translation: {
            welcome: 'स्वागत है',
            continue: 'जारी रखें',
            back: 'वापस',
            save: 'सहेजें',
            cancel: 'रद्द करें',
        }
    },
    mr: {
        translation: {
            welcome: 'स्वागत आहे',
            continue: 'सुरू ठेवा',
            back: 'मागे',
            save: 'जतन करा',
            cancel: 'रद्द करा',
        }
    },
    or: {
        translation: {
            welcome: 'ସ୍ୱାଗତ',
            continue: 'ଜାରି ରଖନ୍ତୁ',
            back: 'ପଛକୁ',
            save: 'ସଞ୍ଚୟ କରନ୍ତୁ',
            cancel: 'ବାତିଲ୍ କରନ୍ତୁ',
        }
    },
};

// Language persistence
const LANGUAGE_KEY = '@app_language';

const languageDetector = {
    type: 'languageDetector' as const,
    async: true,
    detect: async (callback: (lang: string) => void) => {
        try {
            const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
            callback(savedLanguage || 'en');
        } catch (error) {
            callback('en');
        }
    },
    init: () => { },
    cacheUserLanguage: async (language: string) => {
        try {
            await AsyncStorage.setItem(LANGUAGE_KEY, language);
        } catch (error) {
            console.error('Error saving language:', error);
        }
    },
};

i18n
    .use(languageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        compatibilityJSON: 'v4',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
