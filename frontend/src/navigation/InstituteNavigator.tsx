import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import InstituteHomeScreen from '../screens/institute/InstituteHomeScreen';
import InstituteTeacherManagerScreen from '../screens/institute/InstituteTeacherManagerScreen';
import InstituteAnalyticsScreen from '../screens/institute/InstituteAnalyticsScreen';
import SyllabusAssignScreen from '../screens/institute/SyllabusAssignScreen';
import ContentUploadScreen from '../screens/institute/ContentUploadScreen';
import QuizManagerScreen from '../screens/institute/QuizManagerScreen';
import InstituteDashboardScreen from '../screens/InstituteDashboardScreen';
import NotificationScreen from '../screens/NotificationScreen';

const Stack = createNativeStackNavigator();

const InstituteNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="InstituteHome" component={InstituteHomeScreen} />
            <Stack.Screen name="InstituteTeacherManager" component={InstituteTeacherManagerScreen} />
            <Stack.Screen name="InstituteAnalytics" component={InstituteAnalyticsScreen} />
            <Stack.Screen name="InstituteDashboard" component={InstituteDashboardScreen} />
            <Stack.Screen name="SyllabusAssign" component={SyllabusAssignScreen} />
            <Stack.Screen name="ContentUpload" component={ContentUploadScreen} />
            <Stack.Screen name="QuizManager" component={QuizManagerScreen} />
            <Stack.Screen name="Notifications" component={NotificationScreen} />
        </Stack.Navigator>
    );
};

export default InstituteNavigator;
