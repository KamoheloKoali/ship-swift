import { createClientRequest, getClientRequest } from "@/actions/clientRequest";
import { createDriverRequest, getDriverRequest } from "@/actions/driverRequest";
import { currentUser } from "@clerk/nextjs/server";
import { toast } from "sonner";

export const onSubmitAsClient = async (receiver: any) => {
  const user = await currentUser();
  const userId = user?.id || "";

  try {
    if (!user || !receiver || receiver.length === 0) {
      console.error("user or receiver not found");
      console.log(`user: ${user}, receiver: ${receiver}`);
      toast.error("Driver does not exist");
      return;
    }
    const receiverId = String(receiver[0].Id); // Ensure receiverId is a string

    // Check if a request between user and receiver already exists
    const checkRequestInClient = await getClientRequest(userId, receiverId);
    const checkRequestInDriver = await getDriverRequest(receiverId, userId);

    if (checkRequestInClient?.success) {
      console.log(
        "Request already sent, request: " + checkRequestInClient?.data
      );
      toast.error(
        `Request to add ${
          receiver[0].firstName + "" + receiver[0].lastName
        } already sent!`
      );
    } else if (checkRequestInDriver?.success) {
      console.log(
        "Request already sent, request: " + checkRequestInClient?.data
      );
      toast.error(
        `${
          receiver[0].firstName + "" + receiver[0].lastName
        } already sent you a request`
      );
    } else {
      const requestData = {
        receiverId: receiverId, // Ensure this is a plain string
        senderId: userId, // Ensure this is also a plain string
      };

      console.log("Request Data:", requestData);

      // Pass requestData as an argument to ensure it's a plain object
      const response = await createClientRequest(requestData);
      console.log("response for trying to make request: " + response.success);
      if (response.success) {
        toast.success(
          `Request to add ${
            receiver[0].firstName + "" + receiver[0].lastName
          } as Contact sent!`
        );
      } else {
        toast.error(
          `Request to add ${
            receiver[0].firstName + "" + receiver[0].lastName
          } as Contact unsuccesful!`
        );
      }
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

export const onSubmitAsDriver = async (receiver: any) => {
  const user = await currentUser();
  const userId = user?.id || "";

  try {
    if (!user || !receiver || receiver.length === 0) {
      console.error("user or receiver not found");
      console.log(`user: ${user}, receiver: ${receiver}`);
      toast.error("Client does not exist");
      return;
    }
    const receiverId = String(receiver[0].Id); // Ensure receiverId is a string

    // Check if a request between user and receiver already exists
    const checkRequestInClient = await getClientRequest(receiverId, userId);
    const checkRequestInDriver = await getDriverRequest(userId, receiverId);

    if (checkRequestInClient?.success) {
      console.log(
        "Request already sent, request: " + checkRequestInClient?.data
      );
      toast.error(
        `Request to add ${
          receiver[0].firstName + "" + receiver[0].lastName
        } as contact already sent!`
      );
    } else if (checkRequestInDriver?.success) {
      console.log(
        "Request already sent, request: " + checkRequestInClient?.data
      );
      toast.error(
        `${
          receiver[0].firstName + "" + receiver[0].lastName
        } already sent you a request`
      );
    } else {
      const requestData = {
        receiverId: receiverId, // Ensure this is a plain string
        senderId: userId, // Ensure this is also a plain string
      };

      console.log("Request Data:", requestData);

      // Pass requestData as an argument to ensure it's a plain object
      const response = await createDriverRequest(requestData);
      console.log("response for trying to make request: " + response.success);
      if (response.success) {
        toast.success(
          `Request to add ${
            receiver[0].firstName + "" + receiver[0].lastName
          } as Contact sent!`
        );
      } else {
        toast.error(
          `Request to add ${
            receiver[0].firstName + "" + receiver[0].lastName
          } as Contact unsuccesful!`
        );
      }
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
};
