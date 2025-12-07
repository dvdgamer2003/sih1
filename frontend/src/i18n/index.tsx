import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { translations } from './translations';

// Define proper types
interface LanguageContextType {
    language: string;
    setLanguage: (lang: string) => Promise<void>;
    t: (key: string) => string;
}

// Create context with null default and proper type
const LanguageContext = React.createContext<LanguageContextType | null>(null);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
    const [language, setLanguageState] = React.useState('en');

    React.useEffect(() => {
        loadLanguage();
    }, []);

    const loadLanguage = async () => {
        try {
            const savedLang = await AsyncStorage.getItem('lang');
            if (savedLang && (savedLang === 'en' || savedLang === 'hi' || savedLang === 'od')) {
                setLanguageState(savedLang);
            }
        } catch (error) {
            console.error('Error loading language:', error);
        }
    };

    const setLanguage = async (lang: string) => {
        try {
            await AsyncStorage.setItem('lang', lang);
            setLanguageState(lang);
        } catch (error) {
            console.error('Error saving language:', error);
        }
    };

    const t = (key: string): string => {
        const keys = key.split('.');
        let value: any = translations[language as 'en' | 'hi' | 'od'];

        for (const k of keys) {
            if (value && typeof value === 'object') {
                value = value[k];
            } else {
                return key;
            }
        }

        return typeof value === 'string' ? value : key;
    };

    return React.createElement(
        LanguageContext.Provider,
        { value: { language, setLanguage, t } },
        children
    );
};

export const useTranslation = (): LanguageContextType => {
    const context = React.useContext(LanguageContext);
    if (!context) {
        throw new Error('useTranslation must be used within a LanguageProvider');
    }
    return context;
};
