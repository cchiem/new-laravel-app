import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    Button,
    Image,
    Alert,
    ScrollView,
    TouchableOpacity,
} from "react-native";
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
    const imageUri = `http://10.0.2.2:8000${image?.uri}`;

    const fetchPostToEdit = async () => {
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

    useEffect(() => {
        console.log("Fetching post with ID to Edit:", postId);
        fetchPostToEdit();
    }, [postId]);
    return (
        <ScrollView className="flex-1 bg-white">
            <View className="p-6">
                <Text className="text-3xl font-bold mb-6 text-gray-800">
                    Edit Post: {post.id}
                </Text>

                <View className="mb-6 items-center">
                    {image ? (
                        <Image
                            source={{ uri: imageUri }}
                            className="w-[300px] h-[300px] rounded-md"
                        />
                    ) : (
                        <View className="w-[300px] h-[300px] bg-gray-200 rounded-md items-center justify-center"></View>
                    )}
                </View>

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
                    onPress={handleSaveChanges}
                    className="bg-blue-500 py-3 px-4 rounded-md"
                >
                    <Text className="text-white text-center font-semibold">
                        Edit Post
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default EditPost;
