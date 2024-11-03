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
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { formatDate } from "@/screens/courier/dashboard/components/utils/jobTable";

// Define the JobRequest interface based on your Prisma schema
interface JobRequest {
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
  onRowClick: (job: any) => void;
}

const RequestStatusBadge: FC<{ isApproved: boolean }> = ({ isApproved }) => (
  <span
    className={`px-2 py-1 rounded-full text-xs font-medium ${
      isApproved
        ? "bg-green-100 text-green-800"
        : "bg-yellow-100 text-yellow-800"
    }`}
  >
    {isApproved ? "Approved" : "Pending"}
  </span>
);

const MyRequests: FC<MyRequestsProps> = ({ jobRequests, onRowClick }) => {
  return (
    <Tabs>
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
                  <TableHead className="hidden lg:table-cell">
                    Request Date
                  </TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobRequests && jobRequests.length > 0 ? (
                  jobRequests.map((request) => (
                    <TableRow
                      key={request.Id}
                      className="cursor-pointer hover:bg-accent"
                      onClick={() => onRowClick(request)}
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
                      <TableCell className="hidden lg:table-cell">
                        {formatDate(request.dateCreated)}
                      </TableCell>
                      <TableCell className="text-right">
                        M {request.CourierJob.Budget}
                      </TableCell>
                      <TableCell className="text-center">
                        <RequestStatusBadge isApproved={request.isApproved} />
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
