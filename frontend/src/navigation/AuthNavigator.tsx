import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NewLoginScreen from '../screens/NewLoginScreen';
import NewRegisterScreen from '../screens/NewRegisterScreen';

import OnboardingScreen from '../screens/Onboarding/OnboardingScreen';

import WelcomeScreen from '../screens/WelcomeScreen';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Welcome">
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Login" component={NewLoginScreen} />
            <Stack.Screen name="Register" component={NewRegisterScreen} />
        </Stack.Navigator>
    );
};

export default AuthNavigator;
