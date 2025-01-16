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
    
                // Generate a unique filename and store the image
                $filename = Str::uuid() . '.' . $image->getClientOriginalExtension();
                $imagePath = $image->storeAs('posts', $filename, 'public');
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
            // Return error response
            return response()->json([
                'message' => 'Failed to create post',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function show(Post $post)
    {
        return $post;
    }

    public function destroy(Post $post)
    {
        $post->delete();
        return response()->noContent();
    }
}

