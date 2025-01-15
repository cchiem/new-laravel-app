import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Button,
    Image,
    Platform,
    Alert,
} from "react-native";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import api from "./api"; // Adjust this import path as necessary

const CreatePost = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [image, setImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleImagePick = async () => {
        const permissionResult =
            await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            Alert.alert(
                "Permission Required",
                "Permission to access camera roll is required!"
            );
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            const localUri = await saveImageToLocalStorage(
                result.assets[0].uri
            );
            setImage({ uri: localUri, type: "image/jpeg" });
        }
    };

    const saveImageToLocalStorage = async (uri) => {
        if (Platform.OS !== "web") {
            // Only attempt to save image on native platforms
            const filename = uri.split("/").pop();
            const newPath = `${FileSystem.documentDirectory}${filename}`;

            try {
                await FileSystem.copyAsync({
                    from: uri,
                    to: newPath,
                });
                console.log("Image saved to local storage:", newPath);
                return newPath;
            } catch (error) {
                console.error("Error saving image to local storage:", error);
                throw error;
            }
        } else {
            // For web, just return the URI as is.
            return uri;
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

            // Handle image for web and native platforms
            if (Platform.OS === "web") {
                const response = await fetch(image.uri);
                const blob = await response.blob();
                formData.append("image", blob, "image.jpg");
            } else {
                const imageUri = image.uri.replace("file://", "");
                formData.append("image", {
                    uri: imageUri,
                    type: image.type,
                    name: "image.jpg",
                });
            }

            console.log("Submitting FormData:", formData);

            const response = await api.post("/api/posts", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Accept: "application/json",
                },
            });

            console.log("API Response:", response.data);

            Alert.alert("Success", "Post created successfully!");
            setTitle("");
            setContent("");
            setImage(null);
            router.push("/");
        } catch (error) {
            Alert.alert("Error", errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View className="flex-1 justify-center items-center p-4 bg-white">
            <Text className="text-2xl font-bold mb-4">Create New Post</Text>
            {image && (
                <Image
                    source={{ uri: image.uri }}
                    style={{ width: 200, height: 200, marginVertical: 10 }}
                />
            )}
            <TextInput
                className="w-full p-3 border border-gray-300 rounded-lg mb-3 text-lg placeholder:text-gray-400"
                placeholder="Post Title"
                value={title}
                onChangeText={setTitle}
            />
            <TextInput
                className="w-full p-3 border border-gray-300 rounded-lg mb-6 text-lg h-32 text-top placeholder:text-gray-400"
                placeholder="Post Content"
                value={content}
                onChangeText={setContent}
                multiline
            />
            <Button title="Pick an Image" onPress={handleImagePick} />
            <Button
                title="Create Post"
                onPress={handleCreatePost}
                disabled={isLoading}
            />
            {isLoading && <Text>Creating post...</Text>}
        </View>
    );
};

export default CreatePost;
