import React from "react";
import { Copy, CreditCard, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusBadge } from "./JobsTable"; // Assuming StatusBadge is relevant for request statuses
import { JobRequest } from "./MyRequests";
interface RequestDetailsProps {
  request: JobRequest;
}

export default function RequestDetails({ request }: RequestDetailsProps) {
  return (
    <div>
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-start bg-muted/50">
          <div className="grid gap-0.5">
            <CardTitle className="group flex items-center gap-2 text-lg">
              {request.CourierJob.Title}
              <StatusBadge
                status={request.isApproved ? "Approved" : "Pending"}
              />
              <Button
                size="icon"
                variant="outline"
                className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <Copy className="h-3 w-3" />
                <span className="sr-only">Copy Request ID</span>
              </Button>
            </CardTitle>
            <CardDescription>
              Request ID: {request.Id}
              <br />
              Date Created:{" "}
              {new Date(request.CourierJob.dateCreated).toLocaleString()}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-6 text-sm">
          <div className="grid gap-3">
            <div className="font-semibold">Job Details</div>
            <ul className="grid gap-3">
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Budget</span>
                <span>M {request.CourierJob.Budget}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Items</span>
                <span>{request.CourierJob.Description}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Pickup Location</span>
                <span>{request.CourierJob.PickUp}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Dropoff Location</span>
                <span>{request.CourierJob.DropOff}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Collection Date</span>
                <span>
                  {new Date(request.CourierJob.collectionDate).toLocaleString()}
                </span>
              </li>
            </ul>
            <div className="grid gap-3">
              <div className="font-semibold">Client Information</div>
              <dl className="grid gap-3">
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Name</dt>
                  <dd>
                    {request.CourierJob.client.firstName}{" "}
                    {request.CourierJob.client.lastName}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
          <div className="flex-grow text-muted-foreground">
            Payment Status: <span>Pending</span>{" "}
            {/* Adjust based on your logic */}
          </div>
          <Button size="icon" variant="outline">
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">More Actions</span>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
