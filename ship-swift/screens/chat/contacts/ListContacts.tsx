"use client";
import supabase from "@/app/utils/supabase";
import { Loader2 } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { getDriverById } from "@/actions/driverActions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Avatar } from "@/components/ui/avatar";

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

  //   console.log(outgoingRequestsWithNames)

  let contacts: any = [];

  incomingRequests.map((request) => {
    request.isAccepted && contacts.push(request);
  });
  outgoingRequestsWithNames?.map((request: any) => {
    request.isAccepted && contacts.push(request);
  });

  return (
    <div className="h-full flex flex-col gap-6 overflow-y-auto w-full">
      <div>
        <p className="text-base font-semibold text-underline">Contacts</p>
        {contacts.length > 0 ? (
          <div>
            {Array.isArray(contacts) &&
              contacts.map((request: any) => (
                <div
                  key={request.Id}
                  className="border-b py-2 flex flex-col gap-2 w-full"
                >
                  <Avatar>LAXNSKL</Avatar>
                  <p className="font-semibold">{`${request.fullName}`}</p>
                </div>
              ))}
          </div>
        ) : (
          <p className="h-full w-full flex items-center">No contacts</p>
        )}
      </div>
      <div>
        <p className="text-base font-semibold">Incoming requests</p>
        {incomingRequests.length > 0 ? (
          <div>
            {Array.isArray(incomingRequests) &&
              incomingRequests.map((request: any) =>
                request.isAccepted ? null : (
                  <div key={request.Id} className="border-b py-2">
                    <p className="font-semibold">
                      {`Request from: ${request.fullName}`}
                    </p>
                    <p>{request.message}</p>
                    <div>
                      Status:{" "}
                      {request.isPending ? (
                        "Pending"
                      ) : (
                        <div className="flex gap-2">
                          <p>Rejected</p>
                          <Button size="sm">Delete</Button>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {isSubmitting ? (
                        <Button>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                          please wait
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
                    </div>
                  </div>
                )
              )}
          </div>
        ) : (
          <p className="h-full w-full flex items-center justify-center">
            No incoming requests
          </p>
        )}
      </div>
      <div>
        <p className="text-base font-semibold">Outgoing requests</p>
        {outgoingRequestsWithNames?.length > 0 ? (
          <div>
            {Array.isArray(outgoingRequestsWithNames) &&
              outgoingRequestsWithNames.map((request: any) =>
                request.isAccepted ? null : (
                  <div key={request.Id} className="border-b py-2">
                    <p className="font-semibold">
                      {`Request to: ${request.fullName}`}
                    </p>
                    <p>{request.message}</p>
                    <div>
                      Status:{request.isPending ? " Pending" : ""}
                      {request.isPending ? (
                        <>
                          <div className="flex gap-2">
                            <Button size="sm">Delete</Button>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-row gap-2">
                          <p>Rejected</p>
                          <Button size="sm">Delete</Button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              )}
          </div>
        ) : (
          <p className="h-full w-full flex items-center justify-center">
            No outgoing requests
          </p>
        )}
      </div>
    </div>
  );
};

export default ListContacts;
{
  /* <Loader2 className="mr-2 h-8 w-8 animate-spin" /> */
}
