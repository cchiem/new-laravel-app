import React from "react";
import { View, Text, Image, Button } from "react-native";

const Post = ({ post, onEdit, onDelete }) => {
    return (
        <View className="p-4 mb-5 border rounded-lg border-gray-300 bg-white">
            <Text className="text-xl font-bold">{post.title}</Text>
            {post.photo && (
                <Image
                    source={{ uri: post.photo }}
                    className="w-full h-48 mt-2 mb-3"
                />
            )}
            <Text className="text-base mb-3">{post.content}</Text>

            <View className="flex-row justify-between">
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
