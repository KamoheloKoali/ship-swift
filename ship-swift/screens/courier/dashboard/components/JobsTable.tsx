import React, { FC } from "react";
import { MoreVertical, Check, Package } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  ActiveJob,
  JOB_STATUS,
  STATUS_DESCRIPTIONS,
  STATUS_ACTIONS,
  STATUS_STYLES,
  formatDate,
  filterJobsByStatus,
  capitalizeFirstLetter,
} from "@/screens/courier/dashboard/components/utils/jobTable";

interface TableProps {
  jobs: ActiveJob[] | undefined;
  onRowClick: (job: ActiveJob) => void;
  onStatusChange: (jobId: string, newStatus: string) => Promise<void>;
  isLoading?: boolean;
}

const StatusBadge: FC<{ status: string }> = ({ status }) => (
  <span
    className={`px-2 py-1 rounded-full text-xs font-medium ${
      STATUS_STYLES[status as keyof typeof STATUS_STYLES]
    }`}
  >
    {capitalizeFirstLetter(status)}
  </span>
);

const StatusActions: FC<{ job: ActiveJob; onStatusChange: (jobId: string, newStatus: string) => Promise<void> }> = ({ job, onStatusChange }) => {
  const currentActions =
    STATUS_ACTIONS[job.jobStatus as keyof typeof STATUS_ACTIONS] || [];

  // if (currentActions.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="h-8 w-8 p-0">
        <span className="sr-only">Open menu</span>
        <MoreVertical className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {currentActions.map((action) => (
          <DropdownMenuItem
            key={action.status}
            onClick={(e) => {
              e.stopPropagation();
              onStatusChange(job.Id, action.status);
            }}
            className="flex items-center gap-2"
          >
            {action.icon === "Package" ? (
              <Package className="h-4 w-4" />
            ) : action.icon === "Check" ? (
              <Check className="h-4 w-4" />
            ) : null}
            <span>{action.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const LoadingState: FC = () => (
  <Card>
    <CardContent className="p-6">
      <div className="h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    </CardContent>
  </Card>
);

const JobsTable: FC<TableProps> = ({
  jobs,
  onRowClick,
  onStatusChange,
  isLoading = false,
}) => {
  if (isLoading) return <LoadingState />;

  return (
    <Tabs defaultValue={JOB_STATUS.Ongoing}>
      <div className="flex items-center">
        <TabsList>
          {Object.values(JOB_STATUS).map((status) => (
            <TabsTrigger key={status} value={status}>
              {capitalizeFirstLetter(status)}
              {filterJobsByStatus(jobs, status).length > 0 && (
                <span className="ml-2 bg-primary/20 px-2 py-0.5 rounded-full text-xs">
                  {filterJobsByStatus(jobs, status).length}
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {Object.values(JOB_STATUS).map((status) => (
        <TabsContent key={status} value={status}>
          <Card>
            <CardHeader className="px-7">
              <CardTitle>Deliveries</CardTitle>
              <CardDescription>
                {
                  STATUS_DESCRIPTIONS[
                    status as keyof typeof STATUS_DESCRIPTIONS
                  ]
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Pickup
                    </TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Dropoff
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Client
                    </TableHead>
                    <TableHead className="hidden lg:table-cell">
                      Start Date
                    </TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filterJobsByStatus(jobs, status).map((job) => (
                    <TableRow
                      key={job.Id}
                      className="cursor-pointer hover:bg-accent"
                      onClick={() => onRowClick(job)}
                    >
                      <TableCell>
                        <div className="font-medium">
                          {job.CourierJob.Title}
                        </div>
                        <div className="hidden text-sm text-muted-foreground md:inline">
                          {job.CourierJob.Description}
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {job.CourierJob.PickUp}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {job.CourierJob.DropOff}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {job.Client.name}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {formatDate(job.startDate)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div>M {job.CourierJob.Budget}</div>
                        <StatusBadge status={job.jobStatus} />
                      </TableCell>
                      <TableCell>
                        <StatusActions
                          job={job}
                          onStatusChange={onStatusChange}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                  {filterJobsByStatus(jobs, status).length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No {status} deliveries found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default JobsTable;
