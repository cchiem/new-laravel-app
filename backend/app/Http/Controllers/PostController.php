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
        $posts = Post::all();
        return response()->json($posts);
    }
    public function store(Request $request)
    {
        $image = $request->file('image');
        $originalName = $image->getClientOriginalName();

        // Store the image in the 'posts' directory
        $imagePath = $image->storeAs('posts', $originalName, 'public');

        // Create the new post
        $post = Post::create([
            'title' => request('title'),
            'content' => request('content'),
            'photo' => Storage::url($imagePath),
        ]);

        return response()->json($post);
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

    public function show($id)
    {
        $post = Post::findOrFail($id);
        return response()->json($post);
    }

    public function destroy($id)
    {
        $post = Post::findOrFail($id);
    
        // (remove `/storage/` prefix)
        $photoPath = str_replace('/storage/', '', $post->photo);
    
        // Check if the file exists and delete it
        if (Storage::disk('public')->exists($photoPath)) {
            Storage::disk('public')->delete($photoPath);
        }
    
        // Delete the post
        $post->delete();
    
        return response()->json(null, 204);
    }
}

