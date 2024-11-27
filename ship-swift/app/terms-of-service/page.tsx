"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button"; // Assuming shadcn button component
import { createUserRole } from "@/actions/roleAction";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Loader2, ChevronLeft } from "lucide-react";
import Link from "next/link";

const Page: React.FC = () => {
  const { userId } = useAuth();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const searchParams = useSearchParams();
  const role = searchParams.get("role");

  const handleAccept = async () => {
    if (userId) {
      setIsProcessing(true);
      try {
        if (role === "driver") {
          const createRole = await createUserRole({ userId, driver: true });
          if (createRole.driver) {
            router.push("/driver/dashboard/find-jobs");
          }
        } else if (role === "client") {
          const createRole = await createUserRole({
            userId,
            driver: false,
            client: true,
          });
          if (createRole.client) {
            router.push("/client");
          }
        }
      } catch (error) {
        console.error("Error creating/updating user role:", error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Ship Swift Terms of Service</h1>
      <p className="text-sm text-gray-600 mb-6">
        Effective Date: November 27, 2024
      </p>
      <p>
        Welcome to Ship Swift, a platform that connects individuals needing
        parcels delivered with drivers available to complete the delivery. By
        using the Ship Swift platform ("Service"), you agree to comply with and
        be bound by these Terms of Service and our Privacy Policy. If you do not
        agree with any part of these terms, you may not use our Service.
      </p>
      <br />
      <h2 className="font-bold">1. Acceptance of Terms</h2>
      <p>
        By registering for or using the Ship Swift platform, you agree to these
        Terms of Service, our Privacy Policy, and any other applicable policies
        or guidelines. These terms may be updated from time to time, and we will
        notify you of any significant changes.
      </p>
      <br />
      <h2 className="font-bold">2. Account Registration</h2>
      <p>
        To use Ship Swift, both clients and drivers must create an account. By
        creating an account, you agree to provide accurate, current, and
        complete information and maintain the accuracy of your account
        information. You are solely responsible for maintaining the
        confidentiality of your account and password and for all activities that
        occur under your account.
      </p>
      <br />
      <h2 className="font-bold">3. User Responsibilities</h2>
      <ul className="list-disc list-inside pl-5">
        <li>
          <strong>Clients:</strong> You agree to provide accurate delivery
          details (e.g., parcel description, pickup and drop-off locations) and
          ensure that all items are legal for transportation. You are
          responsible for ensuring that your parcel is ready for pickup at the
          agreed-upon time and location.
        </li>
        <br />
        <li>
          <strong>Drivers:</strong> You agree to maintain a valid driver’s
          license, ensure your vehicle is roadworthy, and provide timely and
          safe deliveries. You must treat clients and their property with
          respect and professionalism at all times.
        </li>
      </ul>
      <br />
      <h2 className="font-bold">4. Prohibited Activities</h2>
      You agree not to: <br />
      <ul className="list-disc list-inside pl-5">
        <li>
          Transport illegal, hazardous, or prohibited items (e.g., drugs,
          weapons, stolen goods).
        </li>
        <br />
        <li>
          Harass, discriminate against, or engage in abusive or inappropriate
          behavior towards other users.
        </li>
        <br />
        <li>
          Use the Ship Swift platform for any unlawful purposes, including but
          not limited to fraud, theft, or other illegal activities.
        </li>
      </ul>
      <br />
      <h2 className="font-bold">5. Payment and Escrow</h2>
      <ul className="list-disc list-inside pl-5">
        <li>
          <strong>Client Payment:</strong> Clients are required to pay for
          delivery services before the driver proceeds with the job. Payments
          will be held in an escrow account until the job is marked as complete.
        </li>
        <br />
        <li>
          {" "}
          <strong>Escrow and Completion:</strong> Upon job completion, the
          driver must mark the job as completed, and the client must confirm
          that the delivery was successfully completed. If the client does not
          confirm within 24 hours, the payment will be automatically released to
          the driver.
        </li>
        <br />
        <li>
          <strong>Transactions Outside the Platform:</strong> If users decide to
          carry out transactions outside of Ship Swift, we are not responsible
          for any issues that may arise. Ship Swift only guarantees the security
          of transactions carried out within the platform.
        </li>
      </ul>
      <br />
      <h2 className="font-bold">6. Theft or Damaged Goods</h2>
      <p>
        If an issue arises regarding theft or damaged goods, Ship Swift will
        assist in connecting both parties and may help take the matter to the
        appropriate legal authorities. However, Ship Swift is not responsible
        for the loss, damage, or theft of goods during transit.
      </p>
      <br />
      <h2 className="font-bold">7. Termination and Suspension of Accounts</h2>
      <p>
        Ship Swift reserves the right to suspend or terminate any account at its
        discretion, especially in cases of violation of these Terms of Service,
        fraudulent activity, or other misuse of the platform. You may also
        delete your account at any time, but this will not affect any
        outstanding obligations or payments.
      </p>
      <br />
      <h2 className="font-bold">8. Dispute Resolution</h2>
      <p>
        In case of disputes between clients and drivers, Ship Swift will assist
        in facilitating communication. However, Ship Swift is not responsible
        for resolving any disputes that may arise. Any disputes related to
        deliveries should be settled between the involved parties, and, if
        necessary, legal action may be pursued.
      </p>
      <br />
      <h2 className="font-bold">9. Limitation of Liability</h2>
      <p>
        Ship Swift provides the Service "as is," and we do not guarantee that
        the Service will be uninterrupted or error-free. We are not responsible
        for any damages arising from the use or inability to use the Service,
        including but not limited to, property damage, personal injury, or
        financial losses.
      </p>
      <br />
      <h2 className="font-bold">10. Indemnification</h2>
      <p>
        You agree to indemnify, defend, and hold harmless Ship Swift, its
        affiliates, employees, and partners from any claims, damages, losses, or
        liabilities arising out of your use of the Service or any violation of
        these Terms of Service.
      </p>
      <br />
      <h2 className="font-bold">11. Data Privacy and Security</h2>
      <p>
        Ship Swift respects your privacy. Personal data will be collected,
        stored, and used in accordance with our{" "}
        <Link href="/privacy-policy" className="text-blue-700 underline">Privacy Policy</Link>. By using the
        Service, you consent to the collection and use of your personal data as
        described in the Privacy Policy.
      </p>
      <br />
      <h2 className="font-bold">12. Governing Law</h2>
      <p>
        These Terms of Service are governed by the laws of Lesotho. Any disputes will be resolved in the appropriate courts
        located in Lesotho.
      </p>
      <br />
      <h2 className="font-bold">13. Changes to Terms</h2>
      <p>
        Ship Swift reserves the right to update or modify these Terms of Service
        at any time. You will be notified of any significant changes, and
        continued use of the Service after any such changes constitutes your
        acceptance of the updated terms.
      </p>
      <br />
      {/* Add other sections similarly */}
      <h2 className="font-bold">14. Contact Information</h2>
      <p>
        If you have any questions about these Terms of Service, please contact
        us at:
      </p>
      <p>Email: [Your Contact Email]</p>
      <p>Phone: [Your Contact Number]</p>
      <br />
      <div className="flex justify-between items-center mt-8">
        <Button
          className="flex items-center justify-center h-10 w-10 rounded-full"
          variant="outline"
          onClick={() => router.back()}
        >
          <ChevronLeft className="" />
        </Button>
        {role === null ? (
          ""
        ) : isProcessing ? (
          <div className="w-20 h-10 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-gray-500 animate-spin" />
          </div>
        ) : (
          <Button onClick={handleAccept} className="w-20 h-10">
            Accept
          </Button>
        )}
      </div>
    </div>
  );
};

export default Page;
