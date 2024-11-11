import { Knock } from "@knocklabs/node";

export const knock = new Knock(String(process.env.KNOCK_API_SECRET));

export default async function notifyAboutJob (recipient: any, job: any, driverName: string = "", clientName: string = "") {
    const approved = job.approvedRequestId?.length > 0 ? "approved" : "pending";
   await knock.workflows.trigger("job-notifications", {
    data: {
        driverName,
        clientName,
        job,
        approved,
    },
    recipients: [
      {
        id: recipient.Id || "",
        name: recipient.firstName || "" + recipient.lastName || "",
        email: recipient.email || "",
      },
    ],
  });
};
