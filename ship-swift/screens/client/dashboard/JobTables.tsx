"use client";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDateNoHrs } from "@/screens/courier/dashboard/components/utils/jobTable";
import { StatusBadge } from "@/screens/courier/dashboard/components/JobsTable";

interface TableProps {
  jobs: any[] | undefined;
  onRowClick: (job: any) => void;
  Clicked: any;
}

const JobsTable: FC<TableProps> = ({
  jobs,
  onRowClick,
  Clicked,
}: TableProps) => {
  // Define the mapping of tab values to packageStatus
  const statusMap: { [key: string]: string } = {
    unclaimed: "unclaimed",
    delivered: "delivered",
    ongoing: "claimed",
  };

  // Function to filter jobs based on the packageStatus
  const filterJobs = (status: string) => {
    if (status === "ongoing") {
      return jobs?.filter(
        (job) =>
          job.packageStatus === "claimed" || job.packageStatus === "collected"
      );
    }
    return jobs?.filter((job) => job.packageStatus === statusMap[status]);
  };

  // Filter for Unclaimed jobs
  const unclaimedJobs = filterJobs("unclaimed");
  const jobPosts = unclaimedJobs?.filter((job) => !job.isDirect) || [];
  const directRequests = unclaimedJobs?.filter((job) => job.isDirect) || [];

  // Table rendering logic
  const renderTable = (jobsList: any[], title: string, description: string) => (
    <Card
      x-chunk="dashboard-05-chunk-3"
      className="shadow-lg bg-white/50 border border-black/5"
    >
      <CardHeader className="px-7">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
      {jobsList && jobsList.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead className="hidden sm:table-cell">PickUp</TableHead>
              <TableHead className="hidden sm:table-cell">DropOff</TableHead>
              <TableHead className="hidden md:table-cell">End Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          
            
              <TableBody>
              {jobsList?.map((job) => (
                <TableRow
                  key={job.Id}
                  className={`cursor-pointer ${
                    Clicked?.Id === job.Id ? "bg-accent" : ""
                  }`}
                  onClick={() => onRowClick(job)}
                >
                  <TableCell>
                    <div className="font-medium">{job.Title}</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      {job.Description}
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {job.PickUp}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {job.DropOff}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {formatDateNoHrs(job.collectionDate)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-col items-end gap-1">
                      M{job.Budget}.00
                      <StatusBadge
                        status={
                          job.packageStatus === "claimed"
                            ? "ongoing"
                            : job.packageStatus === "unclaimed"
                            ? "unclaimed"
                            : "collected"
                        }
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              </TableBody>
        </Table>
        ) : (
          <div className="text-center text-xl p-10 font-extrabold text-primary/40 bg-slate-100 flex items-center justify-center flex-col">
            <p>Nothing to see Here</p>
            <img src="/assets/public/nothing.png" alt="Nothing" />
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Tabs defaultValue="unclaimed">
      <div className="flex flex-wrap justify-center lg:justify-start items-center border-b border-black/20 p-2">
        <TabsList className="flex flex-row gap-2 md:gap-4">
          <TabsTrigger
            className="flex gap-1 md:block bg-orange-400"
            value="unclaimed"
          >
            Unclaimed
            <span className="m-1 md:bg-white/60 md:p-2 px-2 rounded-full text-xs bg-white">
              {unclaimedJobs?.length}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="ongoing"
            className="flex gap-1 md:block bg-blue-400"
          >
            Ongoing
            <span className="m-1 md:bg-white/60 md:p-2 px-2 rounded-full text-xs bg-white">
              {filterJobs("ongoing")?.length}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="delivered"
            className="flex gap-1 md:block bg-green-400"
          >
            Delivered
            <span className="m-1 md:bg-white/60 md:p-2 px-2 my-1 rounded-full text-xs bg-white">
              {filterJobs("delivered")?.length}
            </span>
          </TabsTrigger>
        </TabsList>
      </div>

      {/* Ongoing Tab */}
      <TabsContent value="ongoing">
        {renderTable(
          filterJobs("ongoing") || [],
          "Deliveries",
          "All ongoing deliveries."
        )}
      </TabsContent>

      {/* Unclaimed Tab */}
      <TabsContent value="unclaimed">
        <div className="space-y-6">
          {jobPosts.length > 0 &&
            renderTable(jobPosts, "Job Posts", "All unclaimed job posts.")}
          {directRequests.length > 0 &&
            renderTable(
              directRequests,
              "Direct Requests",
              "All unapproved direct requests."
            )}
        </div>
      </TabsContent>

      {/* Delivered Tab */}
      <TabsContent value="delivered">
        {renderTable(
          filterJobs("delivered") || [],
          "Deliveries",
          "All delivered deliveries."
        )}
      </TabsContent>
    </Tabs>
  );
};

export default JobsTable;
