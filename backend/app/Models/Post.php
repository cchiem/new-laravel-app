<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Post extends Model
{
    use HasFactory; // Capitalize HasFactory
    
    protected $table = 'posts'; // You can specify the table name if it's not the default (plural form of the model name)
    
    // Add the fillable property to prevent mass-assignment errors
    protected $fillable = ['title', 'content', 'photo'];
}
