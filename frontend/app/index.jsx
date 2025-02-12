import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import Post from "@/components/Post"; // Assuming you have the Post component
import api from "./api";
import { router } from "expo-router";

const Index = () => {
    const [posts, setPosts] = useState([]); // Initialize posts state
    const [loading, setLoading] = useState(true); // State to handle loading

    // Fetch posts from API
    const fetchPosts = async () => {
        setLoading(true); // Start loading
        try {
            const res = await api.get("http://10.0.2.2:8000/api/posts");
            console.log("Posts: ", res.data);
            const sortedPosts = res.data.sort((a, b) => {
                return b.id - a.id; // (newest first)
            });
            setPosts(sortedPosts); // Update state with sorted posts
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setLoading(false); // Stop loading after fetching
        }
    };

    // Remove a post by its ID
    const removePost = async (id) => {
        try {
            console.log("Deleting Post: ", id);
            await api.delete(`http://10.0.2.2:8000/api/posts/${id}`); // Correctly format URL with dynamic ID
            fetchPosts(); // Refresh posts after deletion
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    // Handle editing a post (implement as needed)
    const handleEdit = (id) => {
        router.push(`/${id}`); // Navigate to the EditPost page with the post ID
    };

    // Fetch posts when component mounts
    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <>
            <Text className="text-5xl font-bold text-center bg-gray-100 pt-8 pb-4">
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
