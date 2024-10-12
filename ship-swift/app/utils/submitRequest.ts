"use server";
import { createClientRequest, getClientRequest } from "@/actions/clientRequest";
import { createDriverRequest, getDriverRequest } from "@/actions/driverRequest";
import { currentUser } from "@clerk/nextjs/server";
export const onSubmitAsClient = async (receiver: any) => {
  const user = await currentUser();
  const userId = user?.id || "";

  try {
    if (!user || !receiver || receiver.length === 0) {
      console.error("user or receiver not found");
      console.log(`user: ${user}, receiver: ${receiver}`);
      return 3;
    }
    const receiverId = String(receiver.Id); // Ensure receiverId is a string

    // Check if a request between user and receiver already exists
    const checkRequestInClient = await getClientRequest(userId, receiverId);
    const checkRequestInDriver = await getDriverRequest(receiverId, userId);

    if (checkRequestInClient?.success) {
      console.log(
        "Request already sent, request: " + checkRequestInClient?.data
      );
      return 2;
    } else if (checkRequestInDriver?.success) {
      console.log(
        "Request already sent, request: " + checkRequestInClient?.data
      );
      return 1;
    } else {
      const requestData = {
        receiverId: receiverId, // Ensure this is a plain string
        senderId: userId, // Ensure this is also a plain string
      };

      // Pass requestData as an argument to ensure it's a plain object
      const response = await createClientRequest(requestData);
      if (response.success) {
        return response.success;
      } else {
        return response.success;
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
      return 3;
    }
    const receiverId = String(receiver.Id); // Ensure receiverId is a string

    // Check if a request between user and receiver already exists
    const checkRequestInClient = await getClientRequest(receiverId, userId);
    const checkRequestInDriver = await getDriverRequest(userId, receiverId);

    if (checkRequestInClient?.success) {
      console.log(
        "Request already sent, request: " + checkRequestInClient?.data
      );
      return 2;
    } else if (checkRequestInDriver?.success) {
      console.log(
        "Request already sent, request: " + checkRequestInClient?.data
      );
      return 1;
    } else {
      const requestData = {
        receiverId: receiverId, // Ensure this is a plain string
        senderId: userId, // Ensure this is also a plain string
      };

      // Pass requestData as an argument to ensure it's a plain object
      const response = await createDriverRequest(requestData);
      if (response.success) {
        return response.success;
      } else {
        return response.success;
      }
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
};
