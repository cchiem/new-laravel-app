<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});


Route::get('test', function () {
    return "test";
});



Route::get('hello', function () {
    return "hello world";
});

