import React from "react";
import { View, Text, Image, Button } from "react-native";

const Post = ({ post, onEdit, onDelete }) => {
    // Assuming the image is being served from localhost at port 8000
    const imageUri = `http://localhost:8000${post.photo}`;

    return (
        <View className="border rounded-lg border-gray-300 bg-white w-full p-4">
            <Text className="text-2xl font-bold">{post.title}</Text>
            {post.photo && (
                <Image
                    source={{ uri: imageUri }}
                    style={{ width: 200, height: 200, marginVertical: 10 }}
                    className="w-full h-48 mt-2 mb-3 rounded-lg"
                />
            )}
            <Text className="text-base mb-3 text-gray-600">{post.content}</Text>

            <View className="flex-row gap-7">
                <Button title="Edit" onPress={() => onEdit(post.id)} />
                <Button
                    title="Delete"
                    onPress={() => onDelete(post.id)}
                    color="red"
                />
            </View>
        </View>
    );
};

export default Post;
