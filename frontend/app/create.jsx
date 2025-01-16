import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Button,
    Image,
    Platform,
    Alert,
    StyleSheet,
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
                await saveImage(uri);
                setImage({ uri });
            }
        } catch (error) {
            console.error("Error selecting image:", error);
        }
    };

    const saveImage = async (uri) => {
        try {
            await ensureDirExists();
            const filename = new Date().getTime() + ".jpeg";
            const dest = imgDir + filename;
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

            if (Platform.OS === "web") {
                const response = await fetch(image.uri);
                const blob = await response.blob();
                formData.append("image", blob, "image.jpg");
            } else {
                formData.append("image", {
                    uri: image.uri,
                    type: "image/jpeg",
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
            console.error("Error creating post:", error);
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
            <Button
                title="Pick an Image from Library"
                onPress={() => selectImage(true)}
            />
            <Button title="Take a Photo" onPress={() => selectImage(false)} />
            <Button
                title="Create Post"
                onPress={handleCreatePost}
                disabled={isLoading}
            />
            {isLoading && <Text>Creating post...</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
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
});

export default CreatePost;
