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
  };
  dateCreated: string;
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
          <CardHeader className="px-7">
            <CardTitle>My Job Requests</CardTitle>
            <CardDescription>
              View and track the status of your job applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Pickup Location
                  </TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Dropoff Location
                  </TableHead>
                  <TableHead className="hidden md:table-cell">Client</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
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
                        <div className="font-medium">
                          {request.CourierJob.Title}
                        </div>
                        <div className="hidden text-sm text-muted-foreground md:inline">
                          {request.CourierJob.Description}
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {request.CourierJob.PickUp}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {request.CourierJob.DropOff}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {request.CourierJob.client.firstName}{" "}
                        {request.CourierJob.client.lastName}
                      </TableCell>
                      <TableCell className="text-right">
                        M {request.CourierJob.Budget}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No job requests found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default MyRequests;
