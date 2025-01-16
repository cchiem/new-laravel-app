import React from "react";
import { View, Text, Image, Button, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons"; // Import Ionicons

const Post = ({ post, onEdit, onDelete }) => {
    // Assuming the image is being served from localhost at port 8000
    const imageUri = `http://10.0.2.2:8000${post.photo}`;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{post.title}</Text>
            {post.photo && (
                <Image source={{ uri: imageUri }} style={styles.image} />
            )}
            <Text style={styles.content}>{post.content}</Text>

            <View style={styles.buttonContainer}>
                <Button title="Edit" onPress={() => onEdit(post.id)} />
            </View>

            {/* Delete Icon (X) in the top right corner */}
            <TouchableOpacity
                onPress={() => onDelete(post.id)}
                style={styles.deleteButton}
            >
                <Ionicons name="close-circle" size={30} color="red" />{" "}
                {/* "X" icon */}
            </TouchableOpacity>
        </View>
    );
};

const styles = {
    container: {
        borderWidth: 1,
        borderColor: "#d1d5db", // gray-300
        borderRadius: 8,
        backgroundColor: "white",
        width: "100%",
        padding: 16,
        position: "relative", // To position the delete icon absolutely
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
    },
    image: {
        width: "100%", // Make the image full width
        height: undefined, // Automatically adjust the height
        aspectRatio: 1, // Maintain aspect ratio (you can adjust this if needed)
        marginVertical: 10,
    },
    content: {
        fontSize: 16,
        marginBottom: 12,
        color: "#4b5563", // gray-600
    },
    buttonContainer: {
        flexDirection: "row",
        gap: 28, // gap-7
    },
    deleteButton: {
        position: "absolute",
        top: 10,
        right: 10,
        backgroundColor: "transparent",
        padding: 5,
    },
};

export default Post;
