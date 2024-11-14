"use client";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  HandCoins,
  Loader2,
  MapPin,
  MessageSquareDot,
  MoreVertical,
  Truck,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useRouter } from "next/navigation";
import { updateJobStatus } from "@/actions/courierJobsActions";
import { getContactByDriverAndClientId } from "@/actions/contactsActions";
import MapComponent from "@/screens/global/PickUpDropOffLoc";
import Link from "next/link";
import DriverLocation from "./DriverLocation";
import { formatDateNoHrs } from "@/screens/courier/dashboard/components/utils/jobTable";
import { StatusBadge } from "@/screens/courier/dashboard/components/JobsTable";

interface SideCardProps {
  job: {
    Id: string;
    packageStatus: string;
    dateCreated: string;
    client?: {
      Id?: string;
      firstName?: string;
      lastName?: string;
      email?: string;
      phoneNumber?: string;
    };
    approvedRequestId: string;
    PickUp: string;
    DropOff: string;
    Title: string;
    Description: string;
    dimensions?: string;
    weight?: string;
    suitableVehicles?: string;
    parcelSize?: string;
    Budget?: string;
    collectionDate: string;
    isDirect?: boolean;
  };
  requests?: Array<any>;
  driver?: any;
  Open: boolean;
}

export default function Details({
  job,
  requests = [],
  driver,
  Open,
}: SideCardProps) {
  const [isClaimed, setIsClaimed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [jobIsDirect, setJobIsDirect] = useState(false);
  const router = useRouter();
  const [isJobCompleted, setIsJobCompleted] = useState(false);
  const [isGettingContact, setIsGettingContact] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [packageSize, setPackageSize] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(Open);
  // Move the status check to useEffect to avoid infinite re-renders

  useEffect(() => {
    setIsClaimed(
      job.packageStatus === "claimed" ||
        job.packageStatus === "collected" ||
        job.packageStatus === "delivered"
    );

    setIsJobCompleted(job.packageStatus === "delivered");
  }, [job.packageStatus]);

  const handleCopyId = () => {
    navigator.clipboard.writeText(job.Id);
    toast({
      description: `Copied: ${job.Id}`,
    });
  };

  const getContact = async () => {
    setIsGettingContact(true);
    const contact = await getContactByDriverAndClientId(
      driver.Id,
      job.client?.Id || ""
    );
    return contact.data;
  };

  const handleJobComplete = async (id: string) => {
    setIsCompleting(true);
    const updatedJob = await updateJobStatus(id, "delivered");
    if (updatedJob?.Id) {
      router.refresh();
      setIsCompleting(false);
    } else {
      toast({
        description: "An unexpected error occured, please try again later.",
        variant: "destructive",
      });
      setIsCompleting(false);
    }
  };

  const OrderDetails = () => {
    useEffect(() => {
      if (job.parcelSize === "smallpackages") {
        setPackageSize("Small Package");
      } else if (job.parcelSize === "mediumpackages") {
        setPackageSize("Medium Package");
      } else if (job.parcelSize === "largepackages") {
        setPackageSize("Large Package");
      } else if (job.parcelSize === "extralargepackages") {
        setPackageSize("Extra-Large Package");
      }
    }, [job.parcelSize]);
    return (
      <>
        <div className="grid gap-3">
          <div className="font-semibold">Order Details</div>
          <ul className="grid gap-3">
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Price</span>
              <span className="flex-wrap">M{job.Budget}.00</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Item(s)</span>
              <span className="flex-wrap">{job.Description}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Weight</span>
              <span className="flex-wrap">{job.weight}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Dimensions</span>
              <span className="flex-wrap">{job.dimensions}</span>
            </li>
            {/* <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Suitable Vehicles</span>
              <span className="flex-wrap">{job.suitableVehicles}</span>
            </li> */}
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Parcel Size</span>
              <span className="flex-wrap">{packageSize}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">End Date</span>
              <span className="flex-wrap">
                {formatDateNoHrs(job.collectionDate)}
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Pick Up</span>
              <span className="flex flex-wrap">
                {job.PickUp}
                <MapPin size={16} color="#3500f5" />
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Drop Off</span>
              <span className="flex flex-wrap">
                {job.DropOff}
                <MapPin size={16} color="#bd0a0a" />
              </span>
            </li>
          </ul>
          <MapComponent pickup={job.PickUp} dropoff={job.DropOff} />
        </div>
      </>
    );
  };

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
        <div className="font-semibold flex justify-between">
          <p>Driver Information</p>
          <Button
            className=""
            variant="outline"
            size="sm"
            onClick={async () => {
              const contact = await getContact();
              router.push(`/conversations/${contact?.Id}`);
              setIsGettingContact(false);
            }}
          >
            {isGettingContact ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <MessageSquareDot size={8} />
                Message
              </>
            )}
          </Button>
        </div>
        <dl className="grid gap-3">
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Courier</dt>
            <dd className="flex flex-wrap">
              {driver?.firstName} {driver?.lastName}
            </dd>
          </div>
          <div className="flex flex-wrap items-center justify-between">
            <dt className="text-muted-foreground">Email</dt>
            <dd>
              <a href={`mailto:${driver?.email}`} className="flex flex-wrap">
                {driver?.email}
              </a>
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Vehicle</dt>
            <dd className="flex flex-wrap">{driver.vehicleType}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Phone</dt>
            <dd>
              <a href={`tel:${driver.phoneNumber}`}>{driver.phoneNumber}</a>
            </dd>
          </div>
          <div>
            <Link href={`/driver-profile/${driver.Id}`} prefetch={true}>
              <Button className="w-full" variant="outline" size="sm">
                Courier Profile
              </Button>
            </Link>
          </div>
        </dl>
      </div>
      <Separator className="my-2" />
      <div className="grid gap-3">
        <div className="font-semibold">Client Information</div>
        <dl className="grid gap-3">
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Customer</dt>
            <dd className="flex flex-wrap">
              {job.client?.firstName} {job.client?.lastName}
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Email</dt>
            <dd>
              <a
                href={`mailto:${job.client?.email}`}
                className="flex flex-wrap"
              >
                {job.client?.email}
              </a>
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
          <div>
            <Link href={`/client-profile/${job.client?.Id}`} prefetch={true}>
              <Button className="w-full" variant="outline" size="sm">
                Client Profile
              </Button>
            </Link>
          </div>
        </dl>
      </div>
    </>
  );

  const PackageStatus = () => (
    <div className="grid gap-3">
      <div className="font-semibold">Package Status</div>
      <dl className="grid gap-3">
        <div className="flex items-center justify-between">
          <dt className="flex items-center gap-1 text-muted-foreground">
            Status
          </dt>
          <dd>
            {job.packageStatus === "collected"
              ? "Collected"
              : isJobCompleted
              ? "Delivered"
              : "Not yet collected"}
          </dd>
        </div>
      </dl>
    </div>
  );

  const PaymentMethod = () => (
    <div className="grid gap-3">
      <div
        className={`font-semibold ${isJobCompleted && "flex justify-between"}`}
      >
        <p>Payment Method</p>
        {isJobCompleted && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              toast({
                title: "Feature not yet implemented",
                description: "This feature is not yet implemented",
              });
            }}
          >
            <HandCoins className="h-4 w-4" /> Release payment
          </Button>
        )}
      </div>
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
        <div
          className={`fixed inset-0 z-50 md:relative md:inset-auto ${
            isOpen ? "block" : "hidden"
          }`}
        >
          <div
            className="absolute inset-0 bg-black/50 md:hidden"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative h-full w-full md:h-auto md:w-auto">
            <Card className="h-full overflow-auto md:h-auto md:overflow-hidden flex flex-col">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 md:hidden z-50"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
              <CardHeader className="flex flex-row items-start bg-muted/50">
                <div className="grid gap-0.5">
                  <CardTitle className="group flex flex-col gap-2 text-lg">
                    <div className="text-xl flex flex-wrap gap-1">
                      {job.Title}{" "}
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

                    <div>
                      Order Id: {job.Id}
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
                    </div>
                  </CardTitle>
                  <CardDescription>
                    Date: {new Date(job.dateCreated).toLocaleString()}
                  </CardDescription>
                  {!isJobCompleted && isClaimed && (
                    <>
                      <p className="text-sm text-muted-foreground">
                        Driver's location:
                      </p>
                      <Link
                        prefetch={true}
                        href={`/track-delivery/${job.approvedRequestId}`}
                        target="_blank"
                      >
                        <DriverLocation
                          params={{ deliveryId: job.Id }}
                          job={job}
                        />
                      </Link>
                    </>
                  )}
                </div>
                <div className="ml-auto flex flex-wrap md:flex-nowrap items-center gap-1">
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
                    </>
                  )}
                  {job.packageStatus === "collected" && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                        >
                          {isCompleting ? (
                            <Loader2 className="animate-spin h-4 w-4" />
                          ) : (
                            <>
                              <MoreVertical className="h-3.5 w-3.5" />
                              <span className="sr-only">More</span>
                            </>
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            handleJobComplete(job.Id);
                          }}
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Mark as completed
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
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
                      <PackageStatus />
                      <Separator className="my-4" />
                      <PaymentMethod />
                    </>
                  )}
                  {!isClaimed && (
                    <div className="">
                      {requests.length > 0 ? (
                        requests.map((driver: any) => (
                          <>
                            <DriverProfile
                              key={driver.Id}
                              driver={driver}
                              job={job}
                            />
                            <Separator className="my-2" />
                          </>
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
          </div>
        </div>
      )}
    </>
  );
}
