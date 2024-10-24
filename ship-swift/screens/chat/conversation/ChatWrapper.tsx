"use client";
import { getClientById } from "@/actions/clientActions";
import { getcontactById } from "@/actions/contactsActions";
import { getDriverByID } from "@/actions/driverActions";
import { getUserRoleById } from "@/app/utils/getUserRole";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import useUser from "@/hooks/useUser";
import { PhoneCall, VideoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type Props = React.PropsWithChildren<{
  conversationId: string;
}>;

const ChatWrapper = ({ children, conversationId }: Props) => {
  const { setFullName, setCallReceiverId } = useUser();
  const router = useRouter();

  // State to store contact, user role, driver, and client data
  const [contact, setContact] = useState<any>(null);
  const [userRole, setUserRole] = useState<any>(null);
  const [driver, setDriver] = useState<any>(null);
  const [client, setClient] = useState<any>(null);

  useEffect(() => {
    // Function to fetch the data asynchronously
    const fetchData = async () => {
      const [contactResponse, userRoleResponse] = await Promise.all([
        getcontactById(conversationId),
        getUserRoleById(),
      ]);

      if (contactResponse.success) {
        setContact(contactResponse.data);
        setUserRole(userRoleResponse.data);

        if (userRoleResponse.data?.client) {
          const driverResponse = await getDriverByID(
            contactResponse.data?.driverId || ""
          );
          setDriver(driverResponse);
        } else {
          const clientResponse = await getClientById(
            contactResponse.data?.clientId || ""
          );
          setClient(clientResponse);
        }
      }
    };

    fetchData();
  }, [conversationId]);

  return (
    <div className="h-full w-full flex flex-col gap-4">
      <div className="w-full h-[8%]">
        {userRole?.client ? (
          <div className="flex justify-center border-b h-full w-full items-center">
            <div className="w-[50%] flex flex-row items-center gap-2">
              <Avatar>
                <AvatarImage src={driver?.photoUrl} alt="user photo" />
              </Avatar>
              <div className="flex flex-col">
                <p className="font-semibold">{`${driver?.firstName} ${driver?.lastName}`}</p>
              </div>
            </div>
            <div className="w-[50%] flex justify-between items-center">
              <div></div>
              <div className="flex mr-5">
                <PhoneCall
                  onClick={() => {
                    setFullName(`${driver?.firstName} ${driver?.lastName}`);
                    setCallReceiverId(driver?.Id);
                    router.push(`/room/${conversationId}`);
                  }}
                  className="cursor-pointer"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center border-b h-full w-full items-center">
            <div className="w-[50%] flex flex-row items-center gap-2">
              <Avatar>
                <AvatarImage src={client?.data?.photoUrl} alt="user photo" />
              </Avatar>
              <div className="flex flex-col">
                <p className="font-semibold">{`${client?.data?.firstName} ${client?.data?.lastName}`}</p>
              </div>
            </div>
            <div className="w-[50%] flex justify-between items-center">
              <div></div>
              <div className="flex mr-5">
                <PhoneCall
                  onClick={() => {
                    setFullName(
                      `${client?.data?.firstName} ${client?.data?.lastName}`
                    );
                    setCallReceiverId(client?.Id);
                    window.open(`/room/${conversationId}`, "_blank");
                  }}
                  className="cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="w-full h-[92%] overflow-y-auto no-scrollbar">
        {children}
      </div>
    </div>
  );
};

export default ChatWrapper;
