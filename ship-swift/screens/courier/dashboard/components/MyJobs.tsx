"use client";

import Details from "./JobDetails";
import RequestDetails from "./RequestDetails";
import { Suspense, useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Truck, Loader2 } from "lucide-react";
import JobsTable from "./JobsTable";
import {
  getAllActiveJobsByDriverId,
  updateActiveJobStatus,
} from "@/actions/activeJobsActions";
import { getUnapprovedJobRequests } from "@/actions/jobRequestActions";
import { getDirectRequestsByDriverId } from "@/actions/directRequestActions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function MyJobs() {
  const [jobs, setJobs] = useState<any[] | undefined>([]);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [jobRequests, setJobRequests] = useState<any[] | undefined>([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [directRequests, setDirectRequests] = useState<any[] | undefined>([]);
  const [error, setError] = useState<string | null | undefined>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusLoading, setIsStatusLoading] = useState<boolean>(false); // Moved here
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [jobToUpdate, setJobToUpdate] = useState<{
    jobId: string;
    newStatus: string;
  } | null>(null);

  const { userId } = useAuth();
  const router = useRouter();

  const fetchJobs = async () => {
    setLoading(true);
    const response = await getAllActiveJobsByDriverId(userId || "");
    if (response && response.length > 0) {
      setJobs(response);
      setSelectedJob(response[0]);
    } else if (response) {
      setError("An unexpected error occurred");
    } else {
      setError("No response received");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, [userId]);

  const handleRequestApproved = async (requestId: string) => {
    setDirectRequests((prevRequests) =>
      prevRequests?.filter((request) => request.Id !== requestId)
    );
    await fetchJobs();
  };

  useEffect(() => {
    const fetchJobRequests = async () => {
      if (userId) {
        const requests = await getUnapprovedJobRequests(userId);
        setJobRequests(requests);
      }
    };

    fetchJobRequests();
  }, [userId]);

  useEffect(() => {
    const fetchDirectJobRequests = async () => {
      if (userId) {
        const directRequest = await getDirectRequestsByDriverId(userId);
        setDirectRequests(directRequest);
      }
    };

    fetchDirectJobRequests();
  }, [userId]);

  const handleRowClick = (job: any | undefined) => {
    setSelectedJob(job);
    setSelectedRequest(null);
  };

  const handleRequestClick = (request: any | undefined) => {
    setSelectedRequest(request);
    setSelectedJob(null); // Clear selected job when a request is clicked
  };

  const handleStatusChange = async (jobId: string, newStatus: string) => {
    setJobToUpdate({ jobId, newStatus });
    setIsDialogOpen(true);
  };

  const confirmStatusChange = async () => {
    if (!jobToUpdate) return;
    setIsStatusLoading(true); // Start loading indicator
    try {
      await updateActiveJobStatus(jobToUpdate.jobId, jobToUpdate.newStatus);
      console.log("New status:", jobToUpdate.newStatus);
      setJobs((prevJobs) =>
        prevJobs?.map((job) =>
          job.Id === jobToUpdate.jobId
            ? { ...job, jobStatus: jobToUpdate.newStatus }
            : job
        )
      );
      if (jobToUpdate.newStatus === "delivered") {
        router.push("/driver/dashboard/my-jobs/capture-proof");
      }
      setIsDialogOpen(false);
      setJobToUpdate(null);
    } catch (error) {
      console.error("Error updating job status:", error);
    } finally {
      setIsStatusLoading(false); // Stop loading indicator
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-muted/40">
      {loading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white bg-opacity-30 backdrop-blur-md">
          <Truck className="animate-truck" width="100" height="100" />
          <p className="text-lg text-gray-700">____________________</p>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-sm sm:max-w-md md:max-w-lg mx-4 sm:mx-8 p-6">
          <DialogHeader>
            <DialogTitle>Confirm Job Status</DialogTitle>
            <DialogDescription>
              Are you sure you want to mark this job as{" "}
              <strong>{jobToUpdate?.newStatus}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-between items-center gap-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            {statusLoading ? (
              <Loader2 className="animate-spin text-gray-500" size={24} />
            ) : (
              <Button onClick={confirmStatusChange}>Confirm</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col gap-4 p-4 md:py-4 md:px-6 lg:px-8">
        <main className="grid gap-4 md:gap-6 lg:gap-8">
          {/* Main Content Area */}
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <JobsTable
                jobs={jobs}
                jobRequests={jobRequests}
                directRequests={directRequests}
                onStatusChange={handleStatusChange}
                onRowClick={handleRowClick}
                onRequestClick={handleRequestClick}
              />
            </div>

            <div className="lg:col-span-1">
              {selectedJob ? (
                <Details job={selectedJob} />
              ) : selectedRequest ? (
                <RequestDetails
                  request={selectedRequest}
                  onRequestApproved={handleRequestApproved}
                />
              ) : null}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
