"use server";
import { createJobRequest } from "@/actions/jobRequestActions";
export const handleApply = async (jobId: string, userId: string | null) => {
  if (userId && jobId) {
    try {
      await createJobRequest({
        courierJobId: jobId,
        driverId: userId,
      });
      return ({success: true, data: "Job request submitted successfully!"});
    } catch (error) {
      console.error("Error creating job request:", error);
      console.log("Failed to submit job request.");
    }
  } else {
    return ({success: false, error: "User ID or Job ID is missing."});
  }
};
