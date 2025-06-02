<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobPosting;
use Illuminate\Http\Request;

class JobPostingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return JobPosting::paginate(); // Paginate for efficiency
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Authorization: Check if the authenticated user is an employer
        if ($request->user()->type !== 'employer') {
            return response()->json(['message' => 'Forbidden. Only employers can post jobs.'], 403);
        }

        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'company_name' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'salary' => 'nullable|numeric',
            'employment_type' => 'required|string|max:255',
            'closes_at' => 'nullable|date',
        ]);

        $jobPosting = $request->user()->jobPostings()->create([
            'title' => $validatedData['title'],
            'description' => $validatedData['description'],
            'company_name' => $validatedData['company_name'],
            'location' => $validatedData['location'],
            'salary' => $validatedData['salary'] ?? null,
            'employment_type' => $validatedData['employment_type'],
            'posted_at' => now(), // Set posted_at to current time
            'closes_at' => $validatedData['closes_at'] ?? null,
        ]);

        return response()->json($jobPosting, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(JobPosting $jobPosting)
    {
        return $jobPosting;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, JobPosting $jobPosting)
    {
        // Authorization: Check if the authenticated user owns the job posting
        if ($request->user()->cannot('update', $jobPosting)) {
            return response()->json(['message' => 'Forbidden. You do not own this job posting.'], 403);
        }

        $validatedData = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'company_name' => 'sometimes|required|string|max:255',
            'location' => 'sometimes|required|string|max:255',
            'salary' => 'nullable|numeric',
            'employment_type' => 'sometimes|required|string|max:255',
            'closes_at' => 'nullable|date',
        ]);

        $jobPosting->update($validatedData);

        return response()->json($jobPosting);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, JobPosting $jobPosting)
    {
        // Authorization: Check if the authenticated user owns the job posting
        if ($request->user()->cannot('delete', $jobPosting)) {
            return response()->json(['message' => 'Forbidden. You do not own this job posting.'], 403);
        }

        $jobPosting->delete();

        return response()->json(null, 204);
    }

    /**
     * Display the job postings created by the authenticated employer.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function myJobPostings(Request $request)
    {
        // Authorization: Only employers can access this endpoint
        if ($request->user()->type !== 'employer') {
            return response()->json(['message' => 'Forbidden. Only employers can view their job postings.'], 403);
        }

        $jobPostings = JobPosting::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->paginate();

        return response()->json($jobPostings);
    }
}
