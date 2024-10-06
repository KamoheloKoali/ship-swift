import { getClientById } from "@/actions/clientActions";
import { getcontactById } from "@/actions/contactsActions";
import { getDriverById } from "@/actions/driverActions";
import { getUserRoleById } from "@/app/utils/getUserRole";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { PhoneCall, VideoIcon } from "lucide-react";
import React from "react";

type Props = React.PropsWithChildren<{
  conversationId: string;
}>;

const ChatWrapper = async ({ children, conversationId }: Props) => {
  const contact = await getcontactById(conversationId);
  const userRole = await getUserRoleById();
  let driver;
  let client;
  if (contact.success) {
    if (userRole.data?.client) {
      driver = await getDriverById(contact.data?.driverId || "");
    } else {
      client = await getClientById(contact.data?.clientId || "");
    }
  }
  return (
    <div className="h-full w-full flex flex-col gap-4">
      <div className="w-full h-[8%] ">
        {userRole.data?.client ? (
          <div className="flex justify-center border-b h-full w-full items-center ">
            <div className="w-[50%] flex flex-row items-center gap-2 ">
              <div className="">
                <Avatar>
                  <AvatarImage src={driver?.data?.photoUrl} alt="user photo" />
                </Avatar>
              </div>
              <div className="flex flex-col">
                <p className="font-semibold">{`${driver?.data?.firstName} ${driver?.data?.lastName}`}</p>
              </div>
            </div>
            <div className=" w-[50%] flex justify-between items-center">
              <div></div>
              <div className="flex flex-row gap-6 mr-2">
                <PhoneCall />
                <VideoIcon />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center border-b h-full w-full items-center ">
            <div className="w-[50%] flex flex-row items-center gap-2 ">
              <div className="">
                <Avatar>
                  <AvatarImage src={client?.data?.photoUrl} alt="user photo" />
                </Avatar>
              </div>
              <div className="flex flex-col">
                <p className="font-semibold">{`${client?.data?.firstName} ${client?.data?.lastName}`}</p>
              </div>
            </div>
            <div className=" w-[50%] flex justify-between items-center">
              <div></div>
              <div className="flex flex-row gap-6 mr-2">
                <PhoneCall />
                <VideoIcon />
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="w-full  h-[92%] overflow-y-auto no-scrollbar">
        {children}
      </div>
    </div>
  );
};

export default ChatWrapper;
