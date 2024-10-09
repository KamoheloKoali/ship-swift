"use server"
import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { getAuth } from '@clerk/nextjs/server'

const prisma = new PrismaClient();

export const createJob = async (jobData: FormData) => {
  try {
    // Extract values from FormData
    const title = jobData.get("title") as string | null;
    const description = jobData.get("description") as string | null;
    const budget = jobData.get("budget") as string | null;
    const clientId = jobData.get("clientId") as string | null;
    const dropOff = jobData.get("DropOff") as string | null;
    const pickUp = jobData.get("PickUp") as string | null;
    const districtdropoff = jobData.get("") as string | null;

    // Ensure none of the required fields are null or undefined
    if (!clientId) {
      return { success: false, error: "Client ID is required." };
    }

    // Log to see the data being passed
    console.log("Job Data: ", { title, description, budget, clientId, dropOff, pickUp });

    // Create a new job in the database
    const newJob = await prisma.courierJobs.create({
      data: {
        Title: title,
        Description: description,
        Budget: budget,
        clientId: clientId,
        DropOff: dropOff,
        PickUp: pickUp,
        districtDropOff: districtdropoff,
      },
    });

    // Revalidate the cache for the client dashboard path
    revalidatePath('/client/dashboard');
    return { success: true, data: newJob };
  } catch (error: any) {
    console.error("Detailed error creating job:", error); // Log full error message
    return { success: false, error: `Error creating job: ${error.message}` }; // Return detailed error
  }
};

// Add this function to your server actions
export const getAllJobs = async () => {
  try {
    const jobs = await prisma.courierJobs.findMany({
      include: { client: true }, // Include client data if needed
    });
    return { success: true, data: jobs };
  } catch (error) {
    console.error("Error retrieving jobs:", error);
    return { success: false, error: "Error retrieving jobs." };
  }
};


export const getJobById = async (jobId: string) => {
  try {
    const job = await prisma.courierJobs.findUnique({
      where: { Id: jobId },
    });
    if (job) {
      return { success: true, data: job };
    } else {
      return { success: false, error: 'Job not found' };
    }
  } catch (error: any) {
    console.error("Error retrieving job:", error.message);
    return { success: false, error: "Error retrieving job." };
  }
};

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
