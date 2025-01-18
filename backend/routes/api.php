<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PostController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Get all posts (index)
Route::get('/posts', [PostController::class, 'index']);

// Create a new post (store)
Route::post('/posts', [PostController::class, 'store']);

// Get a specific post by ID (show)
Route::get('/posts/{id}', [PostController::class, 'show']);

// Update a specific post by ID (update)
Route::put('/posts/{id}', [PostController::class, 'update']);

// Delete a specific post by ID (destroy)
Route::delete('/posts/{id}', [PostController::class, 'destroy']);
