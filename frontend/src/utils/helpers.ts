import { Platform } from 'react-native';

export const isWeb = Platform.OS === 'web';

export const formatDate = (date: Date): string => {
    return date.toLocaleDateString();
};
