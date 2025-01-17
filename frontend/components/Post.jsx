import React from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons"; // Import Ionicons
import { API_BASE_URL } from "@env"; // Import the environment variable

const Post = ({ post, onEdit, onDelete }) => {
    const imageUri = `http://10.0.2.2:8000${post.photo}`;

    return (
        <View style={styles.container}>
            {post.photo && (
                <Image source={{ uri: imageUri }} style={styles.image} />
            )}
            <View style={styles.contentContainer}>
                <Text style={styles.title}>{post.title}</Text>
                <Text style={styles.content}>{post.content}</Text>
                <View style={styles.actionContainer}>
                    <TouchableOpacity
                        onPress={() => onEdit(post.id)}
                        style={styles.editButton}
                    >
                        <Ionicons name="pencil" size={20} color="white" />
                        <Text style={styles.buttonText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => onDelete(post.id)}
                        style={styles.deleteButton}
                    >
                        <Ionicons name="trash-bin" size={20} color="white" />
                        <Text style={styles.buttonText}>Delete</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
        marginBottom: 20,
        overflow: "hidden",
    },
    image: {
        width: "100%", // Make the image take up the full width
        height: 400, // Adjust this height as necessary, or use a dynamic height based on content
        resizeMode: "cover", // Ensures the image scales without distortion
    },
    contentContainer: {
        padding: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 8,
        color: "#333",
    },
    content: {
        fontSize: 16,
        color: "#666",
        marginBottom: 16,
    },
    actionContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    editButton: {
        backgroundColor: "#3498db",
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    deleteButton: {
        backgroundColor: "#e74c3c",
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    buttonText: {
        color: "white",
        marginLeft: 8,
        fontWeight: "600",
    },
});

export default Post;
