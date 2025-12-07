import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useAppTheme } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LANGUAGES = [
    { code: 'en', label: 'EN', flag: '🇬🇧', name: 'English' },
    { code: 'hi', label: 'HI', flag: '🇮🇳', name: 'हिंदी' },
    { code: 'mr', label: 'MR', flag: '🇮🇳', name: 'मराठी' },
    { code: 'or', label: 'OR', flag: '🇮🇳', name: 'ଓଡ଼ିଆ' },
];

const LANGUAGE_KEY = '@app_language';

const LanguageSwitcher = () => {
    const { isDark } = useAppTheme();
    const [currentIndex, setCurrentIndex] = React.useState(0);

    // Load saved language on mount
    React.useEffect(() => {
        loadLanguage();
    }, []);

    const loadLanguage = async () => {
        try {
            const saved = await AsyncStorage.getItem(LANGUAGE_KEY);
            if (saved) {
                const index = LANGUAGES.findIndex(l => l.code === saved);
                if (index !== -1) setCurrentIndex(index);
            }
        } catch (error) {
            console.log('Error loading language:', error);
        }
    };

    const handlePress = async () => {
        const nextIndex = (currentIndex + 1) % LANGUAGES.length;
        const nextLang = LANGUAGES[nextIndex];

        try {
            await AsyncStorage.setItem(LANGUAGE_KEY, nextLang.code);
            setCurrentIndex(nextIndex);
            // Here you can add logic to actually change app language if needed
            console.log('Language changed to:', nextLang.name);
        } catch (error) {
            console.log('Error saving language:', error);
        }
    };

    const currentLang = LANGUAGES[currentIndex];

    return (
        <TouchableOpacity
            onPress={handlePress}
            style={[
                styles.container,
                { backgroundColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)' }
            ]}
            activeOpacity={0.7}
        >
            <Text style={styles.flag}>{currentLang.flag}</Text>
            <Text style={[styles.label, { color: isDark ? '#F1F5F9' : '#fff' }]}>
                {currentLang.label}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
        minWidth: 50,
    },
    flag: {
        fontSize: 14,
    },
    label: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
});

export default LanguageSwitcher;
