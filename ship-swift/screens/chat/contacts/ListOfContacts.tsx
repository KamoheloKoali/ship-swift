import { getClientRequests } from "@/actions/clientRequest";
import { getDriverRequests } from "@/actions/driverRequest";
import { getUserRoleById } from "@/app/utils/getUserRole";
import { currentUser } from "@clerk/nextjs/server";

const ListOfContacts = async () => {
  const userRole = await getUserRoleById();
  const user = await currentUser();

  let incomingRequests;
  let outgoingRequests;
  let requests;

  if (userRole.data?.client) {
    requests = await getDriverRequests("", user?.id);
    incomingRequests = requests.data;
    requests = await getClientRequests(user?.id, "");
    outgoingRequests = requests?.data;
  } else {
    requests = await getDriverRequests("", user?.id);
    outgoingRequests = requests.data;
    requests = await getClientRequests(user?.id, "");
    incomingRequests = requests?.data;
  }


  return {
    incomingRequests: incomingRequests || "",
    outgoingRequests: outgoingRequests || "",
  };
};

export default ListOfContacts;
