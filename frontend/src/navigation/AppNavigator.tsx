import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import AdminNavigator from './AdminNavigator';
import InstituteNavigator from './InstituteNavigator';
import TeacherNavigator from './TeacherNavigator';
import { ActivityIndicator, View } from 'react-native';
import LevelUpPopup from '../components/ui/LevelUpPopup';
import PendingApprovalScreen from '../screens/PendingApprovalScreen';

const AppNavigator = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            {user ? (
                user.status === 'pending' ? <PendingApprovalScreen /> :
                    user.role === 'admin' ? <AdminNavigator /> :
                        user.role === 'institute' ? <InstituteNavigator /> :
                            user.role === 'teacher' ? <TeacherNavigator /> :
                                <MainNavigator />
            ) : (
                <AuthNavigator />
            )}
            <LevelUpPopup />
        </NavigationContainer>
    );
};

export default AppNavigator;
