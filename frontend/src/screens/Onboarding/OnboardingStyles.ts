import { StyleSheet, Platform } from 'react-native';
import { theme } from '../../theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    lottie: {
        width: 250,
        height: 250,
        marginBottom: 30,
    },
    title: {
        textAlign: 'center',
        marginBottom: 10,
        color: theme.colors.primary,
        fontWeight: 'bold',
    },
    subtitle: {
        textAlign: 'center',
        marginBottom: 40,
        color: theme.colors.secondary,
        paddingHorizontal: 20,
    },
    languageContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 40,
    },
    languageButton: {
        flex: 1,
        marginHorizontal: 5,
        borderColor: theme.colors.outline,
    },
    selectedLanguage: {
        backgroundColor: theme.colors.primaryContainer,
        borderColor: theme.colors.primary,
    },
    continueButton: {
        width: '100%',
        paddingVertical: 5,
    },
});
