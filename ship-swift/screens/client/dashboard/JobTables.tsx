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

interface TableProps {
  jobs: any[] | undefined;
  onRowClick: (job: any) => void;
}

const JobsTable: FC<TableProps> = ({ jobs, onRowClick }: TableProps) => {
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

  return (
    <Tabs defaultValue="ongoing">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
          <TabsTrigger value="unclaimed">Unclaimed</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="ongoing">
        <Card x-chunk="dashboard-05-chunk-3">
          <CardHeader className="px-7">
            <CardTitle>Deliveries</CardTitle>
            <CardDescription>All ongoing deliveries.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden sm:table-cell">PickUp</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    DropOff
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Date Created
                  </TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filterJobs("ongoing")?.map((job) => (
                  <TableRow
                    key={job.Id}
                    className="bg-accent cursor-pointer"
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
                      {new Date(job.dateCreated).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">M {job.Budget}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="unclaimed">
        <Card x-chunk="dashboard-05-chunk-3">
          <CardHeader className="px-7">
            <CardTitle>Deliveries</CardTitle>
            <CardDescription>All unclaimed deliveries.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden sm:table-cell">PickUp</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    DropOff
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Date Created
                  </TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filterJobs("unclaimed")?.map((job) => (
                  <TableRow
                    key={job.Id}
                    className="bg-accent cursor-pointer"
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
                      {new Date(job.dateCreated).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">M {job.Budget}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="delivered">
        <Card x-chunk="dashboard-05-chunk-3">
          <CardHeader className="px-7">
            <CardTitle>Deliveries</CardTitle>
            <CardDescription>All delivered deliveries.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden sm:table-cell">PickUp</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    DropOff
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Date Created
                  </TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filterJobs("delivered")?.map((job) => (
                  <TableRow
                    key={job.Id}
                    className="bg-accent cursor-pointer"
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
                      {new Date(job.dateCreated).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">M {job.Budget}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
export default JobsTable;
