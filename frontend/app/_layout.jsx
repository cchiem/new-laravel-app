import { Stack } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons"; // Import icons
import "../global.css";

export default function Layout() {
    return (
        <View className="flex-1 bg-gray-100">
            {/* Stack Navigator */}
            <Stack>
                <Stack.Screen name="index" options={{ title: "Home" }} />
                <Stack.Screen name="create" options={{ title: "Create" }} />
                <Stack.Screen name="edit" options={{ title: "Edit" }} />
            </Stack>

            {/* Modern Navigation Bar */}
            <View className="flex-row justify-around items-center h-16 bg-blue-600">
                <NavButton
                    label="Home"
                    route="/"
                    icon={<Ionicons name="home" size={24} color="white" />}
                />
                <NavButton
                    label="Create"
                    route="create"
                    icon={
                        <FontAwesome
                            name="plus-square"
                            size={24}
                            color="white"
                        />
                    }
                />
                <NavButton
                    label="Edit"
                    route="edit"
                    icon={<Ionicons name="create" size={24} color="white" />}
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
            <Text className="text-white text-sm mt-1">{label}</Text>
        </TouchableOpacity>
    );
}
