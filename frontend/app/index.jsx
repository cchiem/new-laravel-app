import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import Post from "@/components/Post"; // Assuming you have the Post component
import api from "./api";

const Index = () => {
    const [posts, setPosts] = useState([]); // Initialize as empty array
    const [loading, setLoading] = useState(true); // State to handle loading state

    // Fetch posts from API
    async function fetch() {
        setLoading(true); // Start loading
        try {
            const res = await api.get("/api/posts");
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
            await api.delete(`/api/posts/${id}`); // Correctly format URL with dynamic ID
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
        <>
            <Text className="text-5xl font-bold text-center bg-gray-100 py-4 ">
                Post List
            </Text>
            <ScrollView className="flex-1 bg-gray-100 p-4">
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
                    <Text className="text-center font-bold text-3xl text-gray-400 py-10">
                        NO POSTS HERE
                    </Text>
                )}
            </ScrollView>
        </>
    );
};

export default Index;
