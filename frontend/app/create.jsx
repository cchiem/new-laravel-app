import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Image,
    Alert,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import api from "./api"; // Adjust this import path as necessary

const imgDir = FileSystem.documentDirectory + "images/";

const ensureDirExists = async () => {
    const dirInfo = await FileSystem.getInfoAsync(imgDir);
    if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(imgDir, { intermediates: true });
    }
};

const CreatePost = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [image, setImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const selectImage = async (useLibrary) => {
        try {
            const permissionResult = await (useLibrary
                ? ImagePicker.requestMediaLibraryPermissionsAsync()
                : ImagePicker.requestCameraPermissionsAsync());

            if (!permissionResult.granted) {
                Alert.alert(
                    "Permission Denied",
                    "Permission is required to access images."
                );
                return;
            }

            const result = useLibrary
                ? await ImagePicker.launchImageLibraryAsync({
                      mediaTypes: ImagePicker.MediaTypeOptions.Images,
                      allowsEditing: true,
                      aspect: [4, 4],
                      quality: 0.75,
                  })
                : await ImagePicker.launchCameraAsync({
                      mediaTypes: ImagePicker.MediaTypeOptions.Images,
                      allowsEditing: true,
                      aspect: [4, 4],
                      quality: 0.75,
                  });

            if (!result.canceled) {
                const uri = result.assets[0].uri;
                const fileName = uri.split("/").pop();
                await saveImage(uri, fileName);
                setImage({ uri, fileName });
            }
        } catch (error) {
            console.error("Error selecting image:", error);
        }
    };

    const saveImage = async (uri, fileName) => {
        try {
            await ensureDirExists();
            const dest = imgDir + fileName;
            await FileSystem.copyAsync({ from: uri, to: dest });
        } catch (error) {
            console.error("Error saving image:", error);
        }
    };

    const handleCreatePost = async () => {
        if (!title || !content || !image) {
            Alert.alert(
                "Incomplete Form",
                "Please fill in all fields and select an image."
            );
            return;
        }

        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("content", content);

            formData.append("image", {
                uri: image.uri,
                type: "image/jpeg",
                name: image.fileName,
            });

            const response = await api.post(
                "http://10.0.2.2:8000/api/posts",
                formData
            );

            Alert.alert("Success", "Post created successfully!");
            setTitle("");
            setContent("");
            setImage(null);
            router.push("/?refresh=true"); // Redirect to the home page with a refresh query
        } catch (error) {
            console.error("Error creating post:", error);
            Alert.alert("Error", "An error occurred while creating the post.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ScrollView className="flex-1 bg-white">
            <View className="p-6">
                <Text className="text-3xl font-bold mb-6 text-gray-800">
                    Create Post
                </Text>

                <TouchableOpacity
                    onPress={selectImage}
                    className="mb-6 items-center"
                >
                    {image ? (
                        <Image
                            source={{ uri: image.uri }}
                            className="w-[300px] h-[225px] rounded-md"
                        />
                    ) : (
                        <View className="w-[300px] h-[225px] bg-gray-200 rounded-md items-center justify-center">
                            <Text className="text-gray-500">
                                Tap to add an image
                            </Text>
                        </View>
                    )}
                </TouchableOpacity>

                {/* Camera button below the placeholder image */}
                <TouchableOpacity
                    onPress={() => selectImage(false)} // Trigger the camera
                    className="bg-blue-500 py-2 px-4 rounded-md mb-4"
                >
                    <Text className="text-white text-center">Take a Photo</Text>
                </TouchableOpacity>

                <View className="mb-4">
                    <Text className="text-sm font-medium text-gray-700 mb-2">
                        Title
                    </Text>
                    <TextInput
                        placeholder="Enter post title"
                        value={title}
                        onChangeText={setTitle}
                        className="p-4 border border-gray-300 rounded-md text-gray-900"
                    />
                </View>

                <View className="mb-6">
                    <Text className="text-sm font-medium text-gray-700 mb-2">
                        Description
                    </Text>
                    <TextInput
                        placeholder="Enter post description"
                        value={content}
                        onChangeText={setContent}
                        multiline
                        numberOfLines={4}
                        className="p-4 border border-gray-300 rounded-md text-gray-900"
                    />
                </View>

                <TouchableOpacity
                    onPress={handleCreatePost}
                    className="bg-blue-500 py-3 px-4 rounded-md"
                >
                    <Text className="text-white text-center font-semibold">
                        Create Post
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default CreatePost;
