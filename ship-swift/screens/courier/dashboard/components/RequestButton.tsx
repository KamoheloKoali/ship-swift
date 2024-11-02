import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UserPlus, MessageSquare, Clock, Loader2 } from "lucide-react";
import { createRequest, messageContact, checkRequest } from "./utils/jobsInfo";
import useDriverDetails from "@/screens/courier/registration/utils/DriverDetails";

interface RequestStatus {
  isPending: boolean;
  isAccepted: boolean;
}

interface RequestButtonProps {
  clientId: string;
  userId: string;
  requestStatus: RequestStatus;
  isInitialCheckDone: boolean;
  isRequestLoading: boolean;
  setIsRequestLoading: (loading: boolean) => void;
  setRequestStatus: (status: RequestStatus) => void;
}

const RequestButton: React.FC<RequestButtonProps> = ({
  clientId,
  userId,
  requestStatus,
  isInitialCheckDone,
  isRequestLoading,
  setIsRequestLoading,
  setRequestStatus,
}) => {
  const router = useRouter();

  const handleSendRequest = async () => {
    if (userId && clientId) {
      console.log("Sending request...");
      console.log("Client ID:", clientId);
      console.log("User ID:", userId);
      setIsRequestLoading(true);
      try {
        console.log("Creating request...");
        const result = await createRequest(clientId, userId);
        if (result) {
          const newStatus = {
            isPending: true,
            isAccepted: false,
          };
          setRequestStatus(newStatus);

          // Verify the status after a short delay
          setTimeout(async () => {
            const verifiedStatus = await checkRequest(clientId, userId);
            setRequestStatus(verifiedStatus);
          }, 1000);
        }
      } catch (error) {
        console.error("Error creating contact:", error);
      } finally {
        setIsRequestLoading(false);
      }
    }
  };

  const handleMessage = async () => {
    if (userId && clientId) {
      try {
        const conversationId = await messageContact(clientId, userId);
        if (conversationId) {
          router.push(`/conversations/${conversationId}`);
        }
      } catch (error) {
        console.error("Error navigating to conversation:", error);
      }
    }
  };

  const { driverData } = useDriverDetails();

  if (driverData?.isVerified == false) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button
              className="flex items-center space-x-2 border border-gray-500 bg-gray-100 text-gray-700 px-4 py-2 rounded-md my-2 cursor-not-allowed"
              disabled
            >
              <span>Chat</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Not verified</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (!isInitialCheckDone || isRequestLoading) {
    return (
      <Button
        className="flex items-center space-x-2 border border-gray-500 bg-gray-100 text-gray-700 px-4 py-2 rounded-md my-2 cursor-not-allowed"
        disabled
      >
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Loading...</span>
      </Button>
    );
  }

  if (requestStatus.isAccepted) {
    return (
      <Button
        className="flex text-black items-center justify-center space-x-2 border border-black bg-white hover:bg-gray-100 transition-colors duration-200 my-2 w-full"
        onClick={handleMessage}
      >
        <MessageSquare className="w-4 h-4 text-black" />
        <span>Message</span>
      </Button>
    );
  }

  if (requestStatus.isPending) {
    return (
      <Button
        className="flex text-black items-center justify-center space-x-2 border border-black bg-white hover:bg-gray-100 transition-colors duration-200 my-2 w-full"
        disabled
      >
        <Clock className="w-4 h-4" />
        <span>Requested</span>
      </Button>
    );
  }

  return (
    <Button
      className="flex items-center justify-center space-x-2 border border-black bg-white hover:bg-gray-100 transition-colors duration-200 my-2 w-full"
      variant="outline"
      onClick={handleSendRequest}
    >
      <UserPlus className="w-4 h-4 text-black" />
      <span className="text-black">Connect</span>
    </Button>
  );
};
export default RequestButton;
