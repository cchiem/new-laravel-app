import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Image, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import api from "./api"; // Adjust this import path as necessary
import axios from "axios";

const EditPost = () => {
    const router = useRouter();
    const { postId } = useLocalSearchParams();
    const [post, setPost] = useState(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [image, setImage] = useState(null);

    useEffect(() => {
        console.log("Fetching post with ID to Edit:", postId);
        const fetchPost = async () => {
            try {
                const response = await api.get(
                    `http://10.0.2.2:8000/api/posts/${postId}`
                );
                const res = response.data;
                console.log("Fetched Post:", res.id);
                setPost(res);
                setTitle(res.title);
                setContent(res.content);
                setImage({ uri: res.photo }); // Assuming photo is just a URI
            } catch (error) {
                console.error("Error fetching post:", error);
                Alert.alert("Error", "Could not fetch post data.");
            }
        };

        fetchPost();
    }, [postId]);

    const handleSaveChanges = async () => {
        try {
            await axios.put(
                `http://10.0.2.2:8000/api/posts/${post.id}`,
                {
                    title: title,
                    content: content,
                    photo: image.uri,
                },
                {
                    headers: {
                        "Content-Type": "application/json", // Ensure you're sending JSON
                    },
                }
            );

            Alert.alert("Success", "Post updated successfully!");
            router.push("/"); // Navigate to the home page
        } catch (error) {
            console.error("Error updating post:", error); // Logs the error object
        }
    };

    const imageUri = `http://10.0.2.2:8000${image?.uri}`;

    return (
        <View className="flex-1 justify-center items-center p-4 bg-white">
            <Text className="text-2xl font-bold mb-4">Edit Post</Text>
            {image && (
                <Image source={{ uri: imageUri }} className="w-72 h-72 mb-4" />
            )}
            <TextInput
                className="w-full p-3 border border-gray-300 rounded-lg mb-3 text-lg"
                placeholder="Post Title"
                value={title}
                onChangeText={setTitle}
            />
            <TextInput
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 text-lg"
                placeholder="Post Content"
                value={content}
                onChangeText={setContent}
                multiline
                style={{ height: 120, textAlignVertical: "top" }}
            />
            <Button title="Save Changes" onPress={handleSaveChanges} />
        </View>
    );
};

export default EditPost;
