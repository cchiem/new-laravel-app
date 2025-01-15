import React from "react";
import { Platform } from "react-native";
import { Tabs } from "expo-router";
import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

const TabLayout = () => {
    const colorScheme = useColorScheme();

    const screenOptions = {
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
            ios: {
                position: "absolute", // Use a transparent background on iOS to show the blur effect
            },
            default: {},
        }),
    };

    const renderIcon = (name) => (
        <IconSymbol size={28} name={name} color="black" />
    );

    return (
        <Tabs screenOptions={screenOptions}>
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: () => renderIcon("house.fill"),
                }}
            />
            <Tabs.Screen
                name="create"
                options={{
                    title: "Create Post",
                    tabBarIcon: () => renderIcon("plus.circle.fill"),
                }}
            />
            <Tabs.Screen
                name="edit"
                options={{
                    title: "Edit",
                    tabBarIcon: () => renderIcon("pencil.circle.fill"),
                }}
            />
        </Tabs>
    );
};

export default TabLayout;
