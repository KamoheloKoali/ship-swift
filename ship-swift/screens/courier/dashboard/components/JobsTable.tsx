"use client";
import { getAllJobs } from "@/actions/courierJobsActions";
import { useEffect, useState } from "react";

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

const JobsTable: React.FC = () => {
  const [jobs, setJobs] = useState<any[] | undefined>([]); // Adjust the type as needed
  const [error, setError] = useState<string | null | undefined>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      const response = await getAllJobs();
      if (response.success) {
        setJobs(response.data);
      } else {
        setError(response.error);
      }
    };

    fetchJobs();
  }, []);

  return (
    <Tabs defaultValue="scheduled">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
          <TabsTrigger value="current">Current</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="scheduled">
        <Card x-chunk="dashboard-05-chunk-3">
          <CardHeader className="px-7">
            <CardTitle>Deliveries</CardTitle>
            <CardDescription>All sceduled deliveries.</CardDescription>
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
                    Date Create
                  </TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job.Id} className="bg-accent">
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
