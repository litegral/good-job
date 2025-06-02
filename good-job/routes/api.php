<?php

use App\Http\Controllers\Api\JobPostingController;
use App\Http\Controllers\Api\JobApplicationController;
use App\Http\Controllers\Api\UserProfileController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Public routes
Route::get('job-postings', [JobPostingController::class, 'index'])->name('job-postings.index');
Route::get('job-postings/{job_posting}', [JobPostingController::class, 'show'])->name('job-postings.show');

// Protected routes (require auth:sanctum)
Route::middleware('auth:sanctum')->group(function () {
    // Job Posting Routes
    Route::get('my-job-postings', [JobPostingController::class, 'myJobPostings'])->name('job-postings.myJobPostings');
    Route::post('job-postings', [JobPostingController::class, 'store'])->name('job-postings.store');
    Route::put('job-postings/{job_posting}', [JobPostingController::class, 'update'])->name('job-postings.update'); // PUT for full update
    Route::patch('job-postings/{job_posting}', [JobPostingController::class, 'update']); // PATCH for partial update, also maps to update method
    Route::delete('job-postings/{job_posting}', [JobPostingController::class, 'destroy'])->name('job-postings.destroy');

    // Job Application Routes
    Route::get('my-applications', [JobApplicationController::class, 'myApplications'])->name('job-applications.myApplications');
    Route::post('job-postings/{job_posting}/apply', [JobApplicationController::class, 'store'])->name('job-applications.store');
    Route::get('job-postings/{job_posting}/applications', [JobApplicationController::class, 'indexByJobPosting'])->name('job-applications.indexByJobPosting');
    Route::get('job-applications/{job_application}', [JobApplicationController::class, 'show'])->name('job-applications.show');
    Route::put('job-applications/{job_application}', [JobApplicationController::class, 'update'])->name('job-applications.update');

    // User Profile Routes
    Route::get('profile', [UserProfileController::class, 'show'])->name('profile.show');
    Route::put('profile', [UserProfileController::class, 'update'])->name('profile.update'); // Or PATCH if you prefer partial updates
});

// Auth routes
Route::post('/register', [AuthController::class, 'register'])->name('register'); 
Route::post('/login', [AuthController::class, 'login'])->name('login'); 