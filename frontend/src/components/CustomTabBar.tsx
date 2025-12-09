import React from 'react';
import { View, StyleSheet, Pressable, Platform } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { spacing, borderRadius, shadows } from '../theme';
import { useResponsive } from '../hooks/useResponsive';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface CustomTabBarProps {
    state: any;
    descriptors: any;
    navigation: any;
}

const CustomTabBar: React.FC<CustomTabBarProps> = ({ state, descriptors, navigation }) => {
    const theme = useTheme();
    const { isMobile, responsiveValue } = useResponsive();

    const getIconName = (routeName: string) => {
        switch (routeName) {
            case 'HomeTab':
                return 'home';
            case 'Lessons':
                return 'book-open-variant';
            case 'Games':
                return 'gamepad-variant';
            case 'Quiz':
                return 'help-circle-outline';
            default:
                return 'circle';
        }
    };

    const getLabel = (routeName: string) => {
        switch (routeName) {
            case 'HomeTab':
                return 'Home';
            case 'Lessons':
                return 'Lessons';
            case 'Games':
                return 'Games';
            case 'Quiz':
                return 'Quiz';
            default:
                return routeName;
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.tabBar}>
                {state.routes.map((route: any, index: number) => {
                    const { options } = descriptors[route.key];
                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    return (
                        <TabBarItem
                            key={route.key}
                            iconName={getIconName(route.name)}
                            label={getLabel(route.name)}
                            isFocused={isFocused}
                            onPress={onPress}
                            theme={theme}
                            isMobile={isMobile}
                            responsiveValue={responsiveValue}
                        />
                    );
                })}
            </View>
        </View>
    );
};

interface TabBarItemProps {
    iconName: string;
    label: string;
    isFocused: boolean;
    onPress: () => void;
    theme: any;
    isMobile: boolean;
    responsiveValue: (mobile: number, tablet?: number, desktop?: number) => number;
}

const TabBarItem: React.FC<TabBarItemProps> = ({
    iconName,
    label,
    isFocused,
    onPress,
    theme,
    isMobile,
    responsiveValue,
}) => {
    const scale = useSharedValue(1);
    const iconScale = useSharedValue(1);

    const handlePressIn = () => {
        scale.value = withSpring(0.95);
        iconScale.value = withSpring(0.9);
    };

    const handlePressOut = () => {
        scale.value = withSpring(1);
        iconScale.value = withSpring(1);
    };

    const animatedContainerStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const animatedIconStyle = useAnimatedStyle(() => ({
        transform: [{ scale: iconScale.value }],
    }));

    const animatedBackgroundStyle = useAnimatedStyle(() => ({
        opacity: withTiming(isFocused ? 1 : 0, { duration: 200 }),
        transform: [{ scale: withSpring(isFocused ? 1 : 0.8) }],
    }));

    const iconSize = responsiveValue(24, 26, 28);

    return (
        <AnimatedPressable
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={[styles.tabItem, animatedContainerStyle]}
        >
            <View style={styles.tabItemContent}>
                {/* Animated background for active tab */}
                <Animated.View
                    style={[
                        styles.activeBackground,
                        { backgroundColor: `${theme.colors.primary}15` },
                        animatedBackgroundStyle,
                    ]}
                />

                {/* Icon */}
                <Animated.View style={animatedIconStyle}>
                    <MaterialCommunityIcons
                        name={iconName as any}
                        size={iconSize}
                        color={isFocused ? theme.colors.primary : theme.colors.onSurfaceVariant}
                    />
                </Animated.View>

                {/* Label */}
                <Text
                    variant="labelSmall"
                    style={[
                        styles.label,
                        {
                            color: isFocused ? theme.colors.primary : theme.colors.onSurfaceVariant,
                            fontWeight: isFocused ? '600' : '400',
                        },
                    ]}
                >
                    {label}
                </Text>
            </View>
        </AnimatedPressable>
    );
};

const styles = StyleSheet.create({
    container: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(0, 0, 0, 0.08)',
        ...shadows.sm,
        paddingBottom: Platform.OS === 'ios' ? spacing.lg : spacing.sm,
    },
    tabBar: {
        flexDirection: 'row',
        paddingTop: spacing.sm,
        paddingHorizontal: spacing.xs,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.sm,
    },
    tabItemContent: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    activeBackground: {
        position: 'absolute',
        width: 64,
        height: 64,
        borderRadius: 32,
        top: -16,
    },
    label: {
        marginTop: spacing.xs,
        fontSize: 11,
    },
});

export default CustomTabBar;
