import { JobRequest } from "../JobsRequestsTable";
import { handleApply, handleApplied } from "../utils/jobRequests";
import { getcontact, createcontact } from "@/actions/contactsActions";
import { createMessage } from "@/actions/messagesActions";

export type ApplicationStatus =
  | "not_applied"
  | "applying"
  | "applied"
  | "error";

interface ApplicationState {
  status: ApplicationStatus;
  errorMessage: string | null;
}

interface CheckApplicationResult {
  status: ApplicationStatus;
  errorMessage: string | null;
}

export const checkJobApplication = async (
  userId: string | null | undefined,
  job: JobRequest | null
): Promise<CheckApplicationResult> => {
  if (!userId || !job) {
    return {
      status: "not_applied",
      errorMessage: null,
    };
  }

  try {
    const result = await handleApplied(userId);
    if (result.success) {
      const hasAlreadyApplied = result.data.some(
        (request) => request.CourierJob.Id === job.Id
      );
      return {
        status: hasAlreadyApplied ? "applied" : "not_applied",
        errorMessage: null,
      };
    } else {
      return {
        status: "error",
        errorMessage: result.error || "Failed to check application status",
      };
    }
  } catch (error) {
    console.error("Error checking job application:", error);
    return {
      status: "error",
      errorMessage: "An unexpected error occurred",
    };
  }
};

export const applyForJob = async (
  jobId: string,
  userId: string
): Promise<ApplicationState> => {
  try {
    const result = await handleApply(jobId, userId);
    if (result.success) {
      return {
        status: "applied",
        errorMessage: null,
      };
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error("Error applying for job:", error);
    return {
      status: "error",
      errorMessage:
        error instanceof Error ? error.message : "Failed to apply for job",
    };
  }
};

export const formatClientName = (firstName: string, lastName: string) => {
  return {
    fullName: `${firstName} ${lastName}`,
    initials: `${firstName.charAt(0)}${lastName.charAt(0)}`,
  };
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString();
};

export const formatBudget = (
  budget: string | number | null | undefined
): string => {
  if (budget === null || budget === undefined) return "M0";
  const numericBudget =
    typeof budget === "string" ? parseFloat(budget) : budget;
  return `M${isNaN(numericBudget) ? "0" : numericBudget}`;
};

interface checkContactResponse {
  success: boolean;
  data: any;
}

export async function checkContact(
  clientId: string,
  driverId: string
): Promise<checkContactResponse> {
  const isContact = await getcontact(clientId, driverId);
  console.log(isContact);
  if (isContact.success) {
    return { success: true, data: isContact.data };
  }
  return { success: false, data: null };
}

export async function createContact(
  driverId: string,
  clientId: string
): Promise<boolean> {
  const contactData = {
    clientId: clientId,
    driverId: driverId,
  };
  const isContact = await createcontact(contactData);
  if (isContact.success) {
    return true;
  }
  return false;
}

export async function messageContact(
  clientId: string,
  driverId: string
): Promise<string | undefined> {
  console.log("messageContact called with:", { clientId, driverId });

  try {
    const contactResponse = await getcontact(clientId, driverId);
    console.log("getcontact response:", contactResponse);

    // Check if a contact exists and extract its ID if available
    if (contactResponse.success && contactResponse.data?.[0]?.Id) {
      console.log("Found contact ID:", contactResponse.data[0].Id);
      return contactResponse.data[0].Id;
    } else {
      console.log("No valid contact found in response");
      return undefined;
    }
  } catch (error) {
    console.error("Error in messageContact:", error);
    throw error;
  }
}
