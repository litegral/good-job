<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User; // Assuming User model will store profile information

class UserProfileController extends Controller
{
    /**
     * Display the authenticated user's profile.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request)
    {
        return response()->json($request->user());
    }

    /**
     * Update the authenticated user's profile.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        $user = $request->user();

        // Validate the request data
        // Add validation rules as needed for your profile fields
        $validatedData = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $user->id,
            // Add other profile fields here, e.g.:
            // 'bio' => 'nullable|string',
            // 'location' => 'nullable|string|max:255',
            // 'avatar_url' => 'nullable|url|max:255',
        ]);

        $user->fill($validatedData);
        $user->save();

        return response()->json($user);
    }
} 