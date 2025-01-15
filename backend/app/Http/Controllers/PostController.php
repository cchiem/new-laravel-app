<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Post;
use Illuminate\Support\Facades\Storage; // Import Storage facade

class PostController extends Controller
{   
    // Get all posts
    public function index() {
        return Post::all();
    }
    
    // Create a new post
    public function store(Request $request) {
        // Validate incoming request data
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);
        
        // Handle image upload if present
        $imagePath = null;
        if ($request->hasFile('photo') && $request->file('photo')->isValid()) {
            $imagePath = $request->file('photo')->store('posts', 'public');
        }
    
        // Create the post
        $post = Post::create([
            'title' => $request->input('title'),
            'content' => $request->input('content'),
            'photo' => $imagePath, // Store the image path
        ]);
    
        return response()->json($post, 201); // Respond with the created post
    }
    
    
    // Show specific post
    public function show(Post $post) {
        return $post;
    }

    // Delete post     public function destroy(Post $post) {
    public function destroy(Post $post) {
        $post->delete();
        return response()->noContent();
    }
}
