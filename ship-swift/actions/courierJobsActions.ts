"use server";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export const createJob = async (jobData: FormData) => {
  try {
    // Extract values from FormData
    const title = jobData.get("title") as string | null;
    const description = jobData.get("description") as string | null;
    const budget = jobData.get("budget") as string | null;
    const clientId = jobData.get("clientId") as string | null;
    const dropOff = jobData.get("dropOff") as string | null;
    const pickUp = jobData.get("pickUp") as string | null;
    const districtDropOff = jobData.get("districtDropoff") as string | null;
    const districtPickUp = jobData.get("districtPickup") as string | null;
    const parcelSize = jobData.get("parcelSize") as string | null;
    const pickupPhoneNumber = jobData.get("pickupPhoneNumber") as string | null;
    const dropoffPhoneNumber = jobData.get("dropoffPhoneNumber") as
      | string
      | null;
    const dropOffEmail = jobData.get("dropoffEmail") as string | null;
    const collectionDate = jobData.get("collectionDate") as string | null;
    const isDirect = jobData.get("isDirect") === "true" ? true : false; // Default to false if not provided
    const weight = jobData.get("weight") as string | null;
    const dimensions = jobData.get("dimensions") as string | null;
    const suitableVehicles = jobData.get("suitableVehicles") as string | null;

    // Ensure none of the required fields are null or undefined
    if (!clientId) {
      return { success: false, error: "Client ID is required." };
    }

    // Create a new job in the database
    const newJob = await prisma.courierJobs.create({
      data: {
        Title: title,
        Description: description,
        Budget: budget,
        clientId: clientId,
        DropOff: dropOff,
        PickUp: pickUp,
        districtDropOff: districtDropOff,
        districtPickUp: districtPickUp,
        parcelSize: parcelSize,
        pickupPhoneNumber: pickupPhoneNumber,
        dropoffPhoneNumber: dropoffPhoneNumber,
        dropOffEmail: dropOffEmail,
        collectionDate: collectionDate ? new Date(collectionDate) : undefined, // Convert to Date
        packageStatus: "unclaimed",
        weight: weight,
        dimensions: dimensions,
        suitableVehicles: suitableVehicles,
        isDirect: isDirect, // Add the isDirect flag to the job data
      },
    });

    // Revalidate the cache for the client dashboard path
    revalidatePath("/client/dashboard");
    return { success: true, data: newJob };
  } catch (error: any) {
    console.error("Detailed error creating job:", error); // Log full error message
    return { success: false, error: `Error creating job: ${error.message}` }; // Return detailed error
  }
};

// Function to get all jobs
export const getAllJobs = async () => {
  try {
    const jobs = await prisma.courierJobs.findMany({
      include: { client: true }, // Include client data if needed
      where: {
        packageStatus: "unclaimed",
        isDirect: false,
      }
    });
    return { success: true, data: jobs };
  } catch (error) {
    console.error("Error retrieving jobs:", error);
    return { success: false, error: "Error retrieving jobs." };
  }
};

export const getAllJobsFiltered = async (clientId: string) => {
  try {
    const jobs = await prisma.courierJobs.findMany({
      where: { clientId: clientId },
      include: {
        client: true, // Always include DirectRequest
      },
    });
    return { success: true, data: jobs };
  } catch (error) {
    console.error("Error retrieving jobs:", error);
    return { success: false, error: "Error retrieving jobs." };
  }
};
// Function to get job by ID
export const getJobById = async (jobId: string) => {
  try {
    const job = await prisma.courierJobs.findUnique({
      where: { Id: jobId },
    });
    if (job) {
      return { success: true, data: job };
    } else {
      return { success: false, error: "Job not found" };
    }
  } catch (error: any) {
    console.error("Error retrieving job:", error.message);
    return { success: false, error: "Error retrieving job." };
  }
};

// Function to update a job
export const updateJob = async (jobId: string, jobData: Partial<any>) => {
  try {
    const updatedJob = await prisma.courierJobs.update({
      where: { Id: jobId },
      data: jobData,
    });
    return { success: true, data: updatedJob };
  } catch (error: any) {
    console.error("Error updating job:", error.message);
    return { success: false, error: "Error updating job." };
  }
};

// Function to delete a job
export const deleteJob = async (jobId: string) => {
  try {
    const deletedJob = await prisma.courierJobs.delete({
      where: { Id: jobId },
    });
    return { success: true, data: deletedJob };
  } catch (error: any) {
    console.error("Error deleting job:", error.message);
    return { success: false, error: "Error deleting job." };
  }
};

export async function updateJobStatus(id: string, status: string) {
  try {
    const updatedJob = await prisma.courierJobs.update({
      where: { Id: id },
      data: { packageStatus: status },
    });
    return updatedJob;
  } catch (error) {
    console.error("Error updating Job status:", error);
  }
}
