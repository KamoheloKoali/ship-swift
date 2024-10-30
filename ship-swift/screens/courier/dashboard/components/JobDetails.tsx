import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  MoreVertical,
  Truck,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface JobDetailsProps {
  job: {
    Id: string;
    jobStatus: string;
    startDate: string;
    endDate?: string;
    CourierJob: {
      Title: string;
      Description: string;
      Budget: string;
      PickUp: string;
      DropOff: string;
      districtPickUp: string;
      districtDropOff: string;
      pickupPhoneNumber: string;
      dropoffPhoneNumber: string;
      dropOffEmail: string;
      parcelSize: string;
      collectionDate: string;
    };
    Client: {
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber: string;
    };
    Driver: {
      firstName: string;
      lastName: string;
      phoneNumber: string;
      vehicleType: string;
    };
  };
}
const StatusBadge: React.FC<{ status: string }> = ({ status }) => (
  <span
    className={`px-2 py-1 rounded-full text-xs font-medium ${
      status === "ongoing"
        ? "bg-blue-100 text-blue-800"
        : status === "completed"
        ? "bg-green-100 text-green-800"
        : status === "cancelled"
        ? "bg-red-100 text-red-800"
        : "bg-gray-100 text-gray-800"
    }`}
  >
    {status.charAt(0).toUpperCase() + status.slice(1)}
  </span>
);

export default function Details({ job }: JobDetailsProps) {
  return (
    <div>
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-start bg-muted/50">
          <div className="grid gap-0.5">
            <CardTitle className="group flex items-center gap-2 text-lg">
              {job.CourierJob.Title}
              <StatusBadge status={job.jobStatus} />
              <Button
                size="icon"
                variant="outline"
                className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <Copy className="h-3 w-3" />
                <span className="sr-only">Copy Order ID</span>
              </Button>
            </CardTitle>
            <CardDescription>
              Order ID: {job.Id}
              <br />
              Start Date: {new Date(job.startDate).toLocaleString()}
              {job.endDate && (
                <>
                  <br />
                  End Date: {new Date(job.endDate).toLocaleString()}
                </>
              )}
            </CardDescription>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="outline" className="h-8 w-8">
                  <MoreVertical className="h-3.5 w-3.5" />
                  <span className="sr-only">More</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem>Export</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  Cancel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="p-6 text-sm">
          <div className="grid gap-3">
            <div className="font-semibold">Delivery Details</div>
            <ul className="grid gap-3">
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Budget</span>
                <span>M {job.CourierJob.Budget}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Parcel Size</span>
                <span>{job.CourierJob.parcelSize}</span>
              </li>
            </ul>
            <Separator className="my-2" />
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-3">
                <div className="font-semibold">Pickup Information</div>
                <address className="grid gap-0.5 not-italic text-muted-foreground">
                  <span>{job.CourierJob.PickUp}</span>
                  <span>{job.CourierJob.districtPickUp}</span>
                  <span>Phone: {job.CourierJob.pickupPhoneNumber}</span>
                </address>
              </div>
              <div className="grid gap-3">
                <div className="font-semibold">Dropoff Information</div>
                <address className="grid gap-0.5 not-italic text-muted-foreground">
                  <span>{job.CourierJob.DropOff}</span>
                  <span>{job.CourierJob.districtDropOff}</span>
                  <span>Phone: {job.CourierJob.dropoffPhoneNumber}</span>
                  <span>Email: {job.CourierJob.dropOffEmail}</span>
                </address>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="grid gap-3">
              <div className="font-semibold">Client Information</div>
              <dl className="grid gap-3">
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Name</dt>
                  <dd>
                    {job.Client.firstName} {job.Client.lastName}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Email</dt>
                  <dd>
                    <a href={`mailto:${job.Client.email}`}>
                      {job.Client.email}
                    </a>
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Phone</dt>
                  <dd>
                    <a href={`tel:${job.Client.phoneNumber}`}>
                      {job.Client.phoneNumber}
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
            <Separator className="my-4" />
            <div className="grid gap-3">
              <div className="font-semibold">Driver Information</div>
              <dl className="grid gap-3">
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Name</dt>
                  <dd>
                    {job.Driver.firstName} {job.Driver.lastName}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Phone</dt>
                  <dd>
                    <a href={`tel:${job.Driver.phoneNumber}`}>
                      {job.Driver.phoneNumber}
                    </a>
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Vehicle Type</dt>
                  <dd>{job.Driver.vehicleType}</dd>
                </div>
              </dl>
            </div>
            <Separator className="my-4" />
            <div className="grid gap-3">
              <div className="font-semibold">Payment Information</div>
              <dl className="grid gap-3">
                <div className="flex items-center justify-between">
                  <dt className="flex items-center gap-1 text-muted-foreground">
                    <CreditCard className="h-4 w-4" />
                    Payment Status
                  </dt>
                  <dd>Pending</dd>
                </div>
              </dl>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
          <div className="text-xs text-muted-foreground">
            Collection Date:{" "}
            {new Date(job.CourierJob.collectionDate).toLocaleString()}
          </div>
          <Pagination className="ml-auto mr-0 w-auto">
            <PaginationContent>
              <PaginationItem>
                <Button size="icon" variant="outline" className="h-6 w-6">
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span className="sr-only">Previous Order</span>
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button size="icon" variant="outline" className="h-6 w-6">
                  <ChevronRight className="h-3.5 w-3.5" />
                  <span className="sr-only">Next Order</span>
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardFooter>
      </Card>
    </div>
  );
}
