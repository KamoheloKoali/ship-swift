"use client";
import supabase from "@/app/utils/supabase";
import { Loader2 } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { getDriverById } from "@/actions/driverActions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Props = {
  incomingRequestsWithNames: any;
  outgoingRequestsWithNames: any;
  role: Boolean;
};

const ListContacts = ({
  incomingRequestsWithNames,
  outgoingRequestsWithNames,
  role,
}: Props) => {
  const { userId } = useAuth();
  const [incomingRequests, setIncomingRequests] = useState(
    Array.isArray(incomingRequestsWithNames) ? incomingRequestsWithNames : []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handler functions moved outside of useEffect
  const handleAccept = async (requestId: string) => {
    setIsSubmitting(true);
    try {
      if (role) {
        await supabase
          .from("DriverRequests")
          .update({ isAccepted: true, isPending: false })
          .eq("Id", requestId);
        setIncomingRequests((prevRequests) =>
          prevRequests.map((request) =>
            request.Id === requestId
              ? { ...request, isAccepted: true, isPending: false }
              : request
          )
        );
      } else {
        await supabase
          .from("clientRequests")
          .update({ isAccepted: true, isPending: false })
          .eq("Id", requestId);
        setIncomingRequests((prevRequests) =>
          prevRequests.map((request) =>
            request.Id === requestId
              ? { ...request, isAccepted: true, isPending: false }
              : request
          )
        );
      }
    } catch (error) {
      console.error("Error accepting request:", error);
    }
    setIsSubmitting(false);
  };

  const handleReject = async (requestId: string) => {
    setIsSubmitting(true);
    try {
      if (role) {
        await supabase
          .from("DriverRequests")
          .update({ isAccepted: false, isPending: false })
          .eq("Id", requestId);
        setIncomingRequests((prevRequests) =>
          prevRequests.map((request) =>
            request.Id === requestId
              ? { ...request, isAccepted: false, isPending: false }
              : request
          )
        );
      } else {
        await supabase
          .from("clientRequests")
          .update({ isAccepted: false, isPending: false })
          .eq("Id", requestId);
        setIncomingRequests((prevRequests) =>
          prevRequests.map((request) =>
            request.Id === requestId
              ? { ...request, isAccepted: false, isPending: false }
              : request
          )
        );
      }
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error rejecting request:", error);
      toast.error("Failed to accept request");
    }
    setIsSubmitting(false);
  };

  useEffect(() => {
    const handleNewRequest = async (payload: any) => {
      const newRequest = payload.new;
      if (newRequest.receiverId === userId) {
        const driverData = await getDriverById(newRequest.senderId); // Fetch driver by senderId
        const fullName = driverData.success
          ? `${driverData.data?.firstName} ${driverData.data?.lastName}`
          : "Unknown Driver";

        setIncomingRequests((prevRequests) => [
          ...prevRequests,
          { ...newRequest, fullName },
        ]);
      }
    };

    const channelName = role ? "Driver requests - insert" : "driver requests";
    const tableName = role ? "DriverRequests" : "clientRequests";

    const insertChannel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: tableName,
        },
        handleNewRequest
      )
      .subscribe();

    return () => {
      supabase.removeChannel(insertChannel);
    };
  }, [supabase, userId, role]);

  return (
    <div>
      {incomingRequests ? (
        incomingRequests.length === 0 ? (
          <p className="h-full w-full flex items-center justify-center">
            No Contacts
          </p>
        ) : (
          <div>
            <p className="text-base font-semibold">Incoming requests</p>
            {Array.isArray(incomingRequests) &&
              incomingRequests.map((request: any) =>
                request.isAccepted ? (
                  <div key={request.Id} className="border-b py-2"> <p className="font-semibold">
                  {`${request.fullName}`}
                </p></div>
                ) : (
                  <div key={request.Id} className="border-b py-2">
                    (
                    <p className="font-semibold">
                      {`Request from: ${request.fullName}`}
                    </p>
                    <p>{request.message}</p>
                    <p>
                      Status:{" "}
                      {request.isAccepted
                        ? "Accepted"
                        : request.isPending
                        ? "Pending"
                        : "Rejected"}
                    </p>
                    <div className="flex gap-2">
                      {isSubmitting ? (
                        <Button>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleAccept(request.Id)}
                        >
                          Accept
                        </Button>
                      )}
                      <Button
                        size="sm"
                        onClick={() => handleReject(request.Id)}
                      >
                        Reject
                      </Button>
                      )
                    </div>
                  </div>
                )
              )}
          </div>
        )
      ) : (
        <Loader2 className="mr-2 h-8 w-8 animate-spin" />
      )}
    </div>
  );
};

export default ListContacts;
