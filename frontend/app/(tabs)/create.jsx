import { View, Text, TextInput, Button, Image } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import api from "../api"; // Import the correct instance for API

const CreatePost = () => {
    const [title, setTitle] = useState(""); // State for post title
    const [content, setContent] = useState(""); // State for post content
    const [image, setImage] = useState(null); // State for the selected image
    const navigation = useNavigation(); // Get navigation object

    // Request permission to access the camera or gallery
    const pickImage = async () => {
        let permissionResult =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            alert("Permission to access the camera roll is required!");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri); // Store the image URI in state
        } else {
            alert("No image selected.");
        }
    };

    // Function to handle post creation
    const handleCreatePost = async () => {
        if (!title || !content || !image) {
            alert("Please fill in all fields and select an image.");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);

        // Check the file extension and set MIME type dynamically
        const fileExtension = image.split(".").pop(); // Get file extension
        const mimeType =
            fileExtension === "jpg" || fileExtension === "jpeg"
                ? "image/jpeg"
                : "image/png"; // Adjust MIME type

        formData.append("photo", {
            uri: image,
            type: mimeType, // Dynamically set MIME type
            name: `post-image.${fileExtension}`, // Set image name
        });

        try {
            const response = await api.post("/api/posts", formData); // Send FormData
            if (response.status === 201) {
                alert("Post created successfully!");
                setTitle("");
                setContent("");
                setImage(null); // Reset image after post creation
                navigation.goBack(); // Go to the root screen and refresh it
            } else {
                throw new Error("Failed to create post.");
            }
        } catch (error) {
            console.error("Error details:", error.response?.data); // Log the error response details
            alert(
                "Failed to create post. Please check the console for more details."
            );
        }
    };

    return (
        <View className="flex-1 justify-center items-center p-4 bg-white">
            <Text className="text-2xl font-bold mb-4">Create New Post</Text>
            {/* Display the selected image */}
            {image && (
                <Image
                    source={{ uri: image }}
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

            {/* Button to pick an image */}
            <Button
                title="Pick an Image"
                onPress={pickImage}
                className="w-full p-4"
            />
            <Button title="Create Post" onPress={handleCreatePost} />
        </View>
    );
};

export default CreatePost;
