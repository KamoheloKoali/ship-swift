"use client";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  Loader2,
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
import { useEffect, useState } from "react";
import DriverProfile from "./DriverProfile";
import { toast } from "@/hooks/use-toast";
import { getJobRequestById } from "@/actions/jobRequestActions";

interface SideCardProps {
  job: {
    Id: string;
    packageStatus: string;
    dateCreated: string;
    client?: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phoneNumber?: string;
    };
    approvedRequestId: string;
  };
  requests?: Array<any>;
}

export default function Details({ job, requests = [] }: SideCardProps) {
  const [isClaimed, setIsClaimed] = useState(false);
  const [driver, setDriver] = useState<any | null>({});
  const [isLoading, setIsLoading] = useState(false);

  // Move the status check to useEffect to avoid infinite re-renders
  useEffect(() => {
    const getDriverDetails = async () => {
      const jobRequest = await getJobRequestById(job.approvedRequestId);
      setDriver(jobRequest?.Driver);
      setIsLoading(false);
    };
    setIsClaimed(job.packageStatus === "claimed");
    if (job.packageStatus === "claimed") {
      setIsLoading(true);
      getDriverDetails();
    }
  }, [job.packageStatus]);

  const handleCopyId = () => {
    navigator.clipboard.writeText(job.Id);
    toast({
      description: `Copied: ${job.Id}`,
    });
  };

  const OrderDetails = () => (
    <div className="grid gap-3">
      <div className="font-semibold">Order Details</div>
      <ul className="grid gap-3">
        <li className="flex items-center justify-between">
          <span className="text-muted-foreground">
            Glimmer Lamps x <span>2</span>
          </span>
          <span>$250.00</span>
        </li>
        <li className="flex items-center justify-between">
          <span className="text-muted-foreground">
            Aqua Filters x <span>1</span>
          </span>
          <span>$49.00</span>
        </li>
      </ul>
    </div>
  );

  const PriceBreakdown = () => (
    <ul className="grid gap-3">
      <li className="flex items-center justify-between">
        <span className="text-muted-foreground">Subtotal</span>
        <span>$299.00</span>
      </li>
      <li className="flex items-center justify-between">
        <span className="text-muted-foreground">Shipping</span>
        <span>$5.00</span>
      </li>
      <li className="flex items-center justify-between">
        <span className="text-muted-foreground">Tax</span>
        <span>$25.00</span>
      </li>
      <li className="flex items-center justify-between font-semibold">
        <span className="text-muted-foreground">Total</span>
        <span>$329.00</span>
      </li>
    </ul>
  );

  const CustomerCourierInformation = () => (
    <>
      <div className="grid gap-3">
        <div className="font-semibold">Courier Information</div>
        <dl className="grid gap-3">
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Courier</dt>
            <dd>
              {driver?.firstName} {driver?.lastName}
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Email</dt>
            <dd>
              <a href={`mailto:${driver?.email}`}>{driver?.email}</a>
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Phone</dt>
            <dd>
              <a href={`tel:${driver?.phoneNumber}`}>{driver?.phoneNumber}</a>
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Vehicle</dt>
            <dd>{driver.vehicleType}</dd>
          </div>
        </dl>
      </div>
      <Separator className="my-2" />
      <div className="grid gap-3">
        <div className="font-semibold">Customer Information</div>
        <dl className="grid gap-3">
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Customer</dt>
            <dd>
              {job.client?.firstName} {job.client?.lastName}
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Email</dt>
            <dd>
              <a href={`mailto:${job.client?.email}`}>{job.client?.email}</a>
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Phone</dt>
            <dd>
              <a href={`tel:${job.client?.phoneNumber}`}>
                {job.client?.phoneNumber}
              </a>
            </dd>
          </div>
        </dl>
      </div>
    </>
  );

  const PaymentInformation = () => (
    <div className="grid gap-3">
      <div className="font-semibold">Payment Information</div>
      <dl className="grid gap-3">
        <div className="flex items-center justify-between">
          <dt className="flex items-center gap-1 text-muted-foreground">
            <CreditCard className="h-4 w-4" />
            EcoCash
          </dt>
          <dd>+266 6320 6421</dd>
        </div>
      </dl>
    </div>
  );

  return (
    <>
      {isLoading ? (
        <div className="w-full flex flex-col justify-center items-center h-full">
          <Truck className="animate-truck" width="100" height="100" />
          <p className="text-lg text-gray-700">____________________</p>
        </div>
      ) : (
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-start bg-muted/50">
            <div className="grid gap-0.5">
              <CardTitle className="group flex items-center gap-2 text-lg">
                Order: {job.Id}
                {!isClaimed && (
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-6 w-6 transition-opacity group-hover:opacity-100"
                    onClick={handleCopyId}
                  >
                    <Copy className="h-3 w-3" />
                    <span className="sr-only">Copy Order ID</span>
                  </Button>
                )}
              </CardTitle>
              <CardDescription>
                Date: {new Date(job.dateCreated).toLocaleString()}
              </CardDescription>
            </div>
            <div className="ml-auto flex items-center gap-1">
              {isClaimed && (
                <>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-6 w-6 transition-opacity group-hover:opacity-100"
                    onClick={handleCopyId}
                  >
                    <Copy className="h-3 w-3" />
                    <span className="sr-only">Copy Order ID</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 gap-1"
                    onClick={() => {
                      window.open(
                        `/track-delivery/${job.approvedRequestId}`,
                        "_blank"
                      );
                    }}
                  >
                    <Truck className="h-3.5 w-3.5" />
                    <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                      View Map
                    </span>
                  </Button>
                </>
              )}
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
                  <DropdownMenuItem>Trash</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>

          <CardContent className="p-6 text-sm">
            <div className="grid gap-3">
              <OrderDetails />
              <Separator className="my-2" />
              {isClaimed && (
                <>
                  {/* <PriceBreakdown /> */}
                  {/* <Separator className="my-4" /> */}
                  <CustomerCourierInformation />
                  <Separator className="my-4" />
                  <PaymentInformation />
                </>
              )}
              {!isClaimed && (
                <div className="">
                  {requests.length > 0 ? (
                    requests.map((driver: any) => (
                      <DriverProfile
                        key={driver.Id}
                        driver={driver}
                        job={job}
                      />
                    ))
                  ) : (
                    <div className="w-full text-center">No Applicants</div>
                  )}
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
            <div className="text-xs text-muted-foreground">
              Created{" "}
              <time dateTime={job.dateCreated}>
                {new Date(job.dateCreated).toLocaleString()}
              </time>
            </div>
          </CardFooter>
        </Card>
      )}
    </>
  );
}
