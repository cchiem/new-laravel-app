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
        Log::info('Received request data:', $request->all());
        Log::info('Files in request:', $request->allFiles());
    
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'image' => 'required|file|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);
    
        try {
            $imagePath = null;
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                Log::info('Image details:', [
                    'original_name' => $image->getClientOriginalName(),
                    'mime_type' => $image->getMimeType(),
                    'size' => $image->getSize(),
                ]);
    
                $filename = Str::uuid() . '.' . $image->getClientOriginalExtension();
                $imagePath = $image->storeAs('posts', $filename, 'public');
            }
    
            $post = Post::create([
                'title' => $request->input('title'),
                'content' => $request->input('content'),
                'photo' => $imagePath ? Storage::url($imagePath) : null,
            ]);
    
            return response()->json([
                'message' => 'Post created successfully',
                'post' => $post,
            ], 201);
        } catch (\Exception $e) {
            Log::error('Post creation error: ' . $e->getMessage());
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

