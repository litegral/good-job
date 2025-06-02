<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobApplication;
use App\Models\JobPosting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class JobApplicationController extends Controller
{
    public function indexByJobPosting(Request $request, JobPosting $job_posting)
    {
        // Authorization: Only the employer who posted the job can see applications
        if ($request->user()->id !== $job_posting->user_id || $request->user()->type !== 'employer') {
            return response()->json(['message' => 'Unauthorized. You are not the owner of this job posting or not an employer.'], 403);
        }

        $applications = JobApplication::with('user:id,name,email') // Eager load applicant details (id, name, email)
            ->where('job_posting_id', $job_posting->id)
            ->orderBy('created_at', 'desc')
            ->get();

        // Optionally, generate full resume URLs if R2_URL is set
        $applications->each(function ($application) {
            if ($application->resume_path) {
                $application->resume_url = Storage::disk('r2')->url($application->resume_path);
            }
        });

        return response()->json($applications);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, JobPosting $job_posting)
    {
        $request->validate([
            'resume' => ['required', 'file', 'mimes:pdf', 'max:2048'], // Max 2MB PDF
        ]);

        // Authorization: Only 'talent' users can apply
        if ($request->user()->type !== 'talent') {
            return response()->json(['message' => 'Only talent users can apply for jobs.'], 403);
        }

        // Check if the user has already applied for this job
        $existingApplication = JobApplication::where('user_id', $request->user()->id)
            ->where('job_posting_id', $job_posting->id)
            ->first();

        if ($existingApplication) {
            return response()->json(['message' => 'You have already applied for this job.'], 409);
        }

        $resumePath = null;
        if ($request->hasFile('resume')) {
            // Store in the 'resumes' directory on the 'r2' disk
            $resumePath = $request->file('resume')->store('resumes', 'r2');
        }

        $application = JobApplication::create([
            'user_id' => $request->user()->id,
            'job_posting_id' => $job_posting->id,
            'resume_path' => $resumePath,
        ]);

        return response()->json($application, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, JobApplication $job_application)
    {
        // Eager load related data
        $job_application->load(['user:id,name,email', 'jobPosting:id,title,user_id']);

        // Authorization:
        // 1. The applicant can view their own application.
        // 2. The employer who posted the job can view the application.
        $isApplicant = $request->user()->id === $job_application->user_id;
        $isJobOwner = $request->user()->id === $job_application->jobPosting->user_id && $request->user()->type === 'employer';

        if (! ($isApplicant || $isJobOwner)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Generate resume URL if R2_URL is set
        if ($job_application->resume_path) {
            $job_application->resume_url = Storage::disk('r2')->url($job_application->resume_path);
        }

        return response()->json($job_application);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, JobApplication $job_application)
    {
        // Eager load job posting for authorization
        $job_application->load('jobPosting:id,user_id');

        // Authorization: Only the employer who posted the job can update the application status
        if ($request->user()->id !== $job_application->jobPosting->user_id || $request->user()->type !== 'employer') {
            return response()->json(['message' => 'Unauthorized. You are not the owner of this job posting or not an employer.'], 403);
        }

        $request->validate([
            'status' => ['required', 'string', Rule::in(['pending', 'under review', 'interviewing', 'accepted', 'rejected'])],
        ]);

        $job_application->update([
            'status' => $request->status,
        ]);

        // Optionally, reload user and job posting data and generate resume URL for the response
        $job_application->load(['user:id,name,email', 'jobPosting:id,title,user_id']);
        if ($job_application->resume_path) {
            $job_application->resume_url = Storage::disk('r2')->url($job_application->resume_path);
        }

        return response()->json($job_application);
    }

    /**
     * Display the authenticated user's job application history.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function myApplications(Request $request)
    {
        $user = $request->user();

        // Only 'talent' users should have an application history of this kind
        if ($user->type !== 'talent') {
            return response()->json(['message' => 'Only talent users can have job application history.'], 403);
        }

        $applications = JobApplication::with(['jobPosting:id,title,company_name,location']) // Eager load job posting details
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        // Optionally, generate full resume URLs if R2_URL is set
        // And add job posting URL (assuming you have a named route for job-postings.show)
        $applications->each(function ($application) {
            if ($application->resume_path) {
                $application->resume_url = Storage::disk('r2')->url($application->resume_path);
            }
            if ($application->jobPosting) {
                // It's good practice to check if jobPosting is loaded to avoid errors
                $application->job_posting_url = route('job-postings.show', $application->jobPosting->id);
            }
        });

        return response()->json($applications);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
