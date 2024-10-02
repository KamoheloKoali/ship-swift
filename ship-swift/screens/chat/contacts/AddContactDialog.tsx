"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AddContactSchema } from "@/app/utils/zodSchema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createClientRequest, getClientRequest } from "@/actions/clientRequest";
import { getClientByEmail, getClientById } from "@/actions/clientActions";
import { currentUser } from "@clerk/nextjs/server";

type Props = {};

const AddContactDialog = (props: Props) => {
  const form = useForm<z.infer<typeof AddContactSchema>>({
    resolver: zodResolver(AddContactSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof AddContactSchema>) => {
    try {
      const sender = await currentUser();
      const receiver = await getClientByEmail(values.email);
  
      if (!sender || !receiver?.data?.Id) {
        console.error("Sender or receiver not found");
        return;
      }
  
      const result = await getClientRequest(sender.id, receiver.data.Id);
  
      if (result.success) {
        console.log("Request already sent");
      } else {
        const requestData = {
          receiverId: receiver?.data?.Id,
          senderId: sender?.id,
          message: "Just sent a friend request",
        };
  
        // Pass requestData as an argument
        await createClientRequest(requestData);
        console.log("Friend request sent");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
  

  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="icon" variant="outline" asChild>
            <DialogTrigger>
              <UserPlus />
            </DialogTrigger>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Add Contact</p>
        </TooltipContent>
      </Tooltip>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Contact</DialogTitle>
          <DialogDescription>Send a request to connect!</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Send Request</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddContactDialog;
