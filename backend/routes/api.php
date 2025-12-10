<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\TaskAttachmentController;
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('users')->group(function () {

    Route::post('/register', [AuthController::class, 'create']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/check-user', [AuthController::class, 'checkUser']);


    Route::get('/', [AuthController::class, 'getAllUsers']);
    Route::get('/{id}', [AuthController::class, 'getUser']);
    Route::put('/{id}', [AuthController::class, 'updateUser']);
    Route::delete('/{id}', [AuthController::class, 'deleteUser']);
});
Route::prefix('projects')->group(function () {
    Route::post('/create', [ProjectController::class, 'create']);
    Route::get('/', [ProjectController::class, 'show']);
    Route::get('/{id}', [ProjectController::class, 'showById']);
    Route::put('/{id}', [ProjectController::class, 'update']);
    Route::delete('/delete', [ProjectController::class, 'destroy']);
    Route::post('/{projectId}/members', [ProjectController::class, 'addMember']);
    Route::delete('/{projectId}/members/{userId}', [ProjectController::class, 'removeMember']);
    Route::put('/{projectId}/members/{userId}/role', [ProjectController::class, 'updateMemberRole']);
    Route::get('/{projectId}/tasks', [ProjectController::class, 'getTasks']);
    Route::get('/{projectId}/statistics', [ProjectController::class, 'getStatistics']);
});
Route::prefix('tasks')->group(function () {
    Route::get('/', [TaskController::class, 'index']);
    Route::post('/', [TaskController::class, 'store']);
    Route::get('/search', [TaskController::class, 'search']);
    Route::get('/upcoming', [TaskController::class, 'upcoming']);
    Route::get('/{id}', [TaskController::class, 'show']);
    Route::put('/{id}', [TaskController::class, 'update']);
    Route::delete('/{id}', [TaskController::class, 'destroy']);
    Route::post('/{id}/complete', [TaskController::class, 'complete']);
});


Route::prefix('task-attachments')->group(function () {
    Route::get('/', [TaskAttachmentController::class, 'index']);
    Route::post('/upload', [TaskAttachmentController::class, 'store']);
    Route::get('/{id}', [TaskAttachmentController::class, 'show']);
    Route::put('/{id}', [TaskAttachmentController::class, 'update']);
    Route::delete('/{id}', [TaskAttachmentController::class, 'destroy']);
    Route::get('/{id}/download', [TaskAttachmentController::class, 'download']);
    Route::get('/{id}/preview', [TaskAttachmentController::class, 'preview']);
    Route::get('/task/{taskId}/stats', [TaskAttachmentController::class, 'stats']);
});
