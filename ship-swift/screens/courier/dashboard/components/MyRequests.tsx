import React, { FC } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export interface JobRequest {
  Id: string;
  isApproved: boolean;
  CourierJob: {
    Id: string;
    Title: string;
    Description: string;
    Budget: string;
    PickUp: string;
    DropOff: string;
    client: {
      firstName: string;
      lastName: string;
    };
    dateCreated: string;
    collectionDate: string;
  };
}

interface MyRequestsProps {
  jobRequests: JobRequest[];
  onRequestClick: (jobRequest: any) => void;
}

const MyRequests: FC<MyRequestsProps> = ({ jobRequests, onRequestClick }) => {
  return (
    <Tabs defaultValue="my-requests" className="w-full">
      <TabsContent value="my-requests">
        <Card>
          <CardHeader className="px-4 md:px-7">
            <CardTitle>My Job Requests</CardTitle>
            <CardDescription className="text-sm">
              View and track the status of your job applications
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2 md:px-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Title</TableHead>
                    <TableHead className="hidden min-w-[140px] sm:table-cell">
                      Pickup Location
                    </TableHead>
                    <TableHead className="hidden min-w-[140px] sm:table-cell">
                      Dropoff Location
                    </TableHead>
                    <TableHead className="hidden min-w-[150px] md:table-cell">
                      Client
                    </TableHead>
                    <TableHead className="text-right min-w-[100px]">
                      Amount
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobRequests && jobRequests.length > 0 ? (
                    jobRequests.map((request) => (
                      <TableRow
                        key={request.Id}
                        className="cursor-pointer hover:bg-accent"
                        onClick={() => onRequestClick(request)}
                      >
                        <TableCell>
                          <div className="font-medium line-clamp-1">
                            {request.CourierJob.Title}
                          </div>
                          <div className="hidden text-sm text-muted-foreground md:block line-clamp-2">
                            {request.CourierJob.Description}
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <div className="line-clamp-1">
                            {request.CourierJob.PickUp}
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <div className="line-clamp-1">
                            {request.CourierJob.DropOff}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="line-clamp-1">
                            {request.CourierJob.client.firstName}{" "}
                            {request.CourierJob.client.lastName}
                          </div>
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap">
                          M {request.CourierJob.Budget}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="h-24 text-center text-muted-foreground"
                      >
                        No job requests found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default MyRequests;
