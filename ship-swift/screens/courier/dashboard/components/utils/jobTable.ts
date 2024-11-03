import { ReactNode } from "react";

// types.ts
export interface CourierJob {
    Id: string;
    Title: string;
    Description: string;
    PickUp: string;
    DropOff: string;
    Budget: number;
    dateCreated: string;
  }
  
  export interface Driver {
    Id: string;
    name: string;
  }
  
  export interface Client {
    lastName: ReactNode;
    firstName: ReactNode;
    Id: string;
    name: string;
  }
  
  export interface ActiveJob {
    Id: string;
    courierJobId: string;
    driverId: string;
    clientId: string;
    startDate: string;
    endDate: string;
    jobStatus: string;
    CourierJob: CourierJob;
    Driver: Driver;
    Client: Client;
  }

  export interface JobRequest {
    Id: string;
    isApproved: boolean;
    courierJobId: string;
    driverId: string;
    CourierJob: CourierJob;
    Driver: Driver;
  }
  
  // constants.ts
  export const JOB_STATUS = {
    Ongoing: 'ongoing',
    COLLECTED: 'collected',
    DELIVERED: 'delivered',

  } as const;
  
  export const STATUS_DESCRIPTIONS = {
    [JOB_STATUS.Ongoing]: "All scheduled deliveries awaiting pickup.",
    [JOB_STATUS.COLLECTED]: "Packages that have been picked up and are in transit.",
    [JOB_STATUS.DELIVERED]: "Successfully completed deliveries.",
  } as const;
  
  export const STATUS_ACTIONS = {
    [JOB_STATUS.Ongoing]: [
      { label: "Mark as Collected", status: JOB_STATUS.COLLECTED, icon: "Package" }
    ],
    [JOB_STATUS.COLLECTED]: [
      { label: "Mark as Delivered", status: JOB_STATUS.DELIVERED, icon: "Check" }
    ],
  } as const;
  
  export const STATUS_STYLES = {
    [JOB_STATUS.Ongoing]: "bg-yellow-100 text-yellow-800",
    [JOB_STATUS.COLLECTED]: "bg-blue-100 text-blue-800",
    [JOB_STATUS.DELIVERED]: "bg-green-100 text-green-800",
  } as const;
  
  // utils.ts
  export const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  export const filterJobsByStatus = (jobs: ActiveJob[] | undefined, status: string) => {
    return jobs?.filter(job => job.jobStatus === status) || [];
  };
  
  export const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };