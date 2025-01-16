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

        if (!permissionResult.granted) {
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
            try {
                const localUri = await saveImageToLocalStorage(
                    result.assets[0].uri
                );
                setImage({ uri: localUri, type: "image/jpeg" });
            } catch (error) {
                console.error("Error saving image to gallery:", error);
                Alert.alert(
                    "Error",
                    "Failed to save the image to the gallery."
                );
            }
        }
    };

    const saveImageToLocalStorage = async (uri) => {
        if (!uri) {
            console.error("Image URI is undefined.");
            return null;
        }

        if (Platform.OS !== "web") {
            try {
                const filename = uri.split("/").pop();
                const newPath = `${FileSystem.documentDirectory}Pictures/${filename}`;

                // Ensure the Pictures directory exists
                await FileSystem.makeDirectoryAsync(
                    `${FileSystem.documentDirectory}Pictures`,
                    {
                        intermediates: true,
                    }
                );

                await FileSystem.copyAsync({ from: uri, to: newPath });
                return newPath;
            } catch (error) {
                console.error("Error saving image to local storage:", error);
                throw error;
            }
        } else {
            console.warn("Local file saving is not supported on the web.");
            return uri; // For web, return the URI as is
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

            const response = await api.post("/api/posts", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Accept: "application/json",
                },
            });

            Alert.alert("Success", "Post created successfully!");
            setTitle("");
            setContent("");
            setImage(null);
            router.push("/");
        } catch (error) {
            Alert.alert("Error", "An error occurred while creating the post.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Create New Post</Text>
            {image && (
                <Image source={{ uri: image.uri }} style={styles.image} />
            )}
            <TextInput
                style={styles.input}
                placeholder="Post Title"
                value={title}
                onChangeText={setTitle}
            />
            <TextInput
                style={styles.textArea}
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

const styles = {
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
        backgroundColor: "white",
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
    },
    image: {
        width: 300,
        height: 300,
        marginVertical: 10,
        resizeMode: "cover",
    },
    input: {
        width: "100%",
        padding: 12,
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 8,
        marginBottom: 12,
        fontSize: 16,
    },
    textArea: {
        width: "100%",
        padding: 12,
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 8,
        marginBottom: 16,
        fontSize: 16,
        height: 120,
        textAlignVertical: "top",
    },
};

export default CreatePost;
