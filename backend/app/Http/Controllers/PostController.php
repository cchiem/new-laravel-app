<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Post;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class PostController extends Controller
{
    public function index()
    {
        return Post::all();
    }
    public function store(Request $request)
    {
        // Validate the request data
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'image' => 'required|file|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);
    
        try {
            // Initialize imagePath to null
            $imagePath = null;
    
            // Handle the image upload if provided
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                
                // Use the original name of the file
                $originalName = $image->getClientOriginalName();
    
                // Store the image in the 'posts' directory
                $imagePath = $image->storeAs('posts', $originalName, 'public');
            }
    
            // Create the new post with or without the image
            $post = Post::create([
                'title' => $validated['title'],
                'content' => $validated['content'],
                'photo' => $imagePath ? Storage::url($imagePath) : null,
            ]);
    
            // Return success response
            return response()->json([
                'message' => 'Post created successfully',
                'post' => $post,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create post',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    
    
    public function update($id)
    {
        // Find the post by ID or fail if not found
        $post = Post::findOrFail($id);
        $post->title = request('title');
        $post->content = request('content');
        $post->save();
        return response()->json($post);
    }

    public function show($postid)
    {
        // Find the post by ID
        $post = Post::find($postid);

        // If the post is not found, return a 404 response
        if (!$post) {
            return response()->json(['message' => 'Post not found'], 404);
        }

        // Return the post data (you can customize this depending on the response format you need)
        return response()->json($post);
    }

    public function destroy(Post $post)
    {
        $post->delete();
        return response()->noContent();
    }
}

