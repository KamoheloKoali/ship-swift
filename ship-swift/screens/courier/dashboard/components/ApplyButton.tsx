// ApplyButton.tsx
import React from 'react';
import { Button } from "@/components/ui/button";
import { CheckCheck, Loader2, AlertCircle } from "lucide-react";
import { ApplicationStatus, applyForJob } from "./utils/jobsInfo";

interface ApplyButtonProps {
  jobId: string;
  userId: string;
  applicationStatus: ApplicationStatus;
  setApplicationStatus: (status: ApplicationStatus) => void;
  setErrorMessage: (message: string | null) => void;
}

const ApplyButton: React.FC<ApplyButtonProps> = ({
  jobId,
  userId,
  applicationStatus,
  setApplicationStatus,
  setErrorMessage
}) => {
  const jobApply = async () => {
    if (userId && jobId) {
      setApplicationStatus("applying");
      const result = await applyForJob(jobId, userId);
      setApplicationStatus(result.status);
      setErrorMessage(result.errorMessage);
    }
  };

  switch (applicationStatus) {
    case "applying":
      return (
        <Button
          className="flex items-center justify-center space-x-2 border border-gray-500 bg-gray-100 text-gray-700 px-4 py-2 rounded-md my-2 cursor-not-allowed w-full"
          disabled
        >
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Applying...</span>
        </Button>
      );
    case "applied":
      return (
        <div className="flex items-center justify-center space-x-2 border border-gray-500 bg-gray-100 text-gray-700 px-4 py-2 rounded-md my-2 cursor-not-allowed w-full">
          <CheckCheck className="w-4 h-4" />
          <span>Applied</span>
        </div>
      );
    case "error":
      return (
        <Button
          className="flex items-center justify-center space-x-2 border border-red-500 bg-red-100 text-red-700 px-4 py-2 rounded-md my-2 w-full"
          onClick={() => setApplicationStatus("not_applied")}
        >
          <AlertCircle className="w-4 h-4" />
          <span>Error - Try Again</span>
        </Button>
      );
    case "not_applied":
      return (
        <Button
          className="flex items-center justify-center space-x-2 border border-black bg-white hover:bg-gray-100 transition-colors duration-200 my-2 w-full"
          variant="outline"
          onClick={jobApply}
        >
          <CheckCheck className="w-4 h-4 text-black" />
          <span className="text-black">Apply</span>
        </Button>
      );
  }
};

export default ApplyButton;