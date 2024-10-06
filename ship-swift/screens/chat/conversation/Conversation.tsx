"use client";
import { createMessage } from "@/actions/messagesActions";
import supabase from "@/app/utils/supabase";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@clerk/nextjs";
import { Paperclip, SendHorizontal } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type Props = {
  clientDetails: any;
  driverDetails: any;
  contactDetails: any;
  role: any;
  Messages: any;
};

const Conversation = ({
  clientDetails,
  driverDetails,
  contactDetails,
  role,
  Messages,
}: Props) => {
  const currentUser = useAuth();
  const userId = currentUser.userId;
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [messages, setNewMessage] = useState(
    Array.isArray(Messages) ? Messages : []
  );
  let senderId;
  let receiverId;

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset the height to allow shrinking if the content is smaller
      textarea.style.height = "auto";
      // Set the height to match the scroll height of the content
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  if (contactDetails.clientId === currentUser.userId) {
    senderId = contactDetails.clientId;
    receiverId = contactDetails.driverId;
  } else {
    senderId = contactDetails.driverId;
    receiverId = contactDetails.clientId;
  }

  useEffect(() => {
    const handleNewMessage = async (payload: any) => {
      const newMessage = payload.new;
      if (newMessage.clientId === userId || newMessage.driverId === userId) {
        setNewMessage((prevMessages) => [...prevMessages, { ...newMessage }]);
      }
    };

    const insertContactChannel = supabase
      .channel("on Insert Contact")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Messages",
        },
        handleNewMessage
      )
      .subscribe();

    return () => {
      supabase.removeChannel(insertContactChannel);
    };
  }, [supabase, userId, role]);

  const handleSubmit = async () => {
    const textarea = textareaRef.current;

    if (!textarea) return;

    const message = textarea.value;
    const messageText = textarea.value.trim(); // Get value and trim leading/trailing whitespace

    // Validation to prevent empty or whitespace-only messages
    if (messageText === "") {
      toast.error("Please enter a message before submitting.");
      return;
    }
    // Add the new message to the state so it's rendered in the UI
    setNewMessage((prevMessages) => [...prevMessages, message]);

    // You can replace this with your actual submission logic (e.g., send to Supabase or another backend)
    const response = await createMessage({
      driverId: driverDetails.Id,
      clientId: clientDetails.Id,
      senderId: userId || "",
      message: message,
    });

    if (!response.success) {
      toast.error("Error sending message. Please try again");
      messages.pop();
      return;
    }

    // Clear the textarea after successful submission
    textarea.value = "";
    textarea.style.height = "auto"; // Reset the height
  };

  return (
    <div className="w-full h-full flex flex-col justify-between flex-1 overflow-y-auto gap-2 p-3 no-scrollbar">
      <div className="w-full h-[95%] overflow-y-auto">
        {messages.map((message: any, index: number) => (
          <div key={index} className="flex flex-col gap-4">
            {userId === message.senderId ? (
              <div className="flex justify-end border">
                <div className="max-w-[80%] rounded-2xl bg-gray-900 px-4 py-3 text-white shadow-lg dark:bg-gray-800">
                  <p className="text-sm font-medium">{message.message}</p>
                </div>
              </div>
            ) : (
              <div className="flex justify-start border">
                <div className="max-w-[80%] rounded-2xl bg-gray-100 px-4 py-3 text-gray-900 shadow-lg dark:bg-gray-950 dark:text-gray-50">
                  <p className="text-sm font-medium">{message.message}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="w-full h-[5%] flex flex-row gap-2 items-center">
        <Paperclip />
        <Textarea
          ref={textareaRef}
          className="w-full resize-none overflow-hidden"
          placeholder="Enter your message..."
          onInput={handleInput}
          rows={1} // Initial number of rows
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault(); // Prevent new line on Enter
              handleSubmit();
            }
          }}
        />
        <SendHorizontal onClick={handleSubmit} />
      </div>
    </div>
  );
};

export default Conversation;
