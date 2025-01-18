import { Stack } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons"; // Import icons
import "../global.css";

export default function Layout() {
    return (
        <View className="flex-1 bg-gray-100">
            <Stack>
                <Stack.Screen name="index" options={{ title: "Home" }} />
                <Stack.Screen name="create" options={{ title: "Create" }} />
            </Stack>

            {/* Modern Navigation Bar */}
            <View className="flex-row justify-around items-center p-4 border-t border-t-gray-200 bg-white shadow-md">
                <NavButton
                    label="Home"
                    route="/"
                    icon={<Ionicons name="home" size={24} color="black" />}
                />
                <NavButton
                    label="Create"
                    route="/create"
                    icon={
                        <FontAwesome
                            name="plus-square"
                            size={24}
                            color="black"
                        />
                    }
                />
            </View>
        </View>
    );
}

function NavButton({ label, route, icon }) {
    const { push } = require("expo-router").useRouter();

    return (
        <TouchableOpacity
            onPress={() => push(route)}
            className="flex items-center"
        >
            {icon}
            <Text className="text-black text-sm mt-1">{label}</Text>
        </TouchableOpacity>
    );
}
