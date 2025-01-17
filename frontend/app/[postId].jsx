import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    Button,
    Image,
    Alert,
    StyleSheet,
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

    useEffect(() => {
        console.log("Fetching post with ID to Edit:", postId);
        const fetchPost = async () => {
            try {
                const response = await api.get(
                    `http://10.0.2.2:8000/api/posts/${postId}`
                );
                const postData = response.data;
                console.log("Fetched Post Data:", postData);
                setPost(postData);
                setTitle(postData.title);
                setContent(postData.content);
                setImage({ uri: postData.photo }); // Assuming photo is just a URI
            } catch (error) {
                console.error("Error fetching post:", error);
                Alert.alert("Error", "Could not fetch post data.");
            }
        };

        fetchPost();
    }, [postId]);

    const handleSaveChanges = async () => {
        try {
            const response = await axios.put(
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

    if (!post) return <Text>Loading...</Text>;

    const imageUri = `http://10.0.2.2:8000${image?.uri}`;
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Edit Post</Text>
            {image && <Image source={{ uri: imageUri }} style={styles.image} />}
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
            <Button title="Save Changes" onPress={handleSaveChanges} />
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

export default EditPost;
