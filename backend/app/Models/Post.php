<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Post extends Model
{
    use HasFactory; 
    
    protected $table = 'posts';
    
    // Add the fillable property to prevent mass-assignment errors
    protected $fillable = ['title', 'content', 'photo'];
}
