import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import Post from "@/components/Post"; // Assuming you have the Post component
import api from "./api";

const Index = () => {
    const [posts, setPosts] = useState([]); // Initialize posts state
    const [loading, setLoading] = useState(true); // State to handle loading

    // Fetch posts from API
    const fetchPosts = async () => {
        setLoading(true); // Start loading
        try {
            const res = await api.get("/api/posts");
            setPosts(res.data); // Assuming response contains the posts data
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setLoading(false); // Stop loading after fetching
        }
    };

    // Remove a post by its ID
    const removePost = async (id) => {
        try {
            await api.delete(`/api/posts/${id}`); // Correctly format URL with dynamic ID
            fetchPosts(); // Refresh posts after deletion
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    // Fetch posts when component mounts
    useEffect(() => {
        fetchPosts();
    }, []);

    // Handle editing a post (implement as needed)
    const handleEdit = (id) => {
        console.log(`Edit post with ID: ${id}`);
        // Implement navigation to edit screen or logic to edit post
    };

    return (
        <>
            <Text className="text-5xl font-bold text-center bg-gray-100 py-4">
                Post List
            </Text>
            <ScrollView className="flex-1 bg-gray-100 p-4">
                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" /> // Show a spinner while loading
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
                    <Text className="text-center font-bold text-3xl text-gray-400 py-10">
                        NO POSTS HERE
                    </Text>
                )}
            </ScrollView>
        </>
    );
};

export default Index;
