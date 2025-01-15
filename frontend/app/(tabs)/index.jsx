import { View, Text, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import api from "../api"; // Import the correct instance
import Post from "@/components/Post"; // Assuming you have the Post component
import { rem } from "nativewind"; // If you plan to use rem for styling
import * as ImagePicker from "expo-image-picker";

const Index = () => {
    const [posts, setPosts] = useState([]); // Initialize as empty array
    const [loading, setLoading] = useState(true); // State to handle loading state

    // Fetch posts from API
    async function fetch() {
        setLoading(true); // Start loading
        try {
            const res = await api.get("/api/posts");
            console.log(res);
            setPosts(res.data); // Assuming response has data
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false); // Stop loading once data is fetched
        }
    }

    // Remove a post
    async function removePost(id) {
        try {
            const res = await api.delete(`/api/posts/${id}`); // Correctly format URL with dynamic ID
            console.log(res);
            fetch(); // Refresh posts after deletion
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetch(); // Fetch posts on component mount
    }, []);

    // Handle editing a post (implement as needed)
    const handleEdit = (id) => {
        console.log(`Edit post with ID: ${id}`);
        // Navigate to the edit screen, or implement logic to edit the post
    };

    return (
        <View className="flex-1 justify-center items-center p-4 ">
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" /> // Show a blue spinner while loading
            ) : posts.length > 0 ? (
                posts.map((post) => (
                    <Post
                        key={post.id}
                        post={post}
                        onEdit={handleEdit}
                        onDelete={removePost}
                    />
                ))
            ) : (
                <Text className="text-center font-bold text-3xl text-gray-400">
                    NO POSTS HERE
                </Text>
            )}
        </View>
    );
};

export default Index;
