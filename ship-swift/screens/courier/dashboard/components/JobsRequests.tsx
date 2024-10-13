import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface JobRequestProps {
  profilePhoto: string;
  name: string;
  pickUpLocation: string;
  dropOffLocation: string;
  jobDate: string;
  amount: string;
  postDate: string;
}

const JobsRequests: React.FC<JobRequestProps> = ({
  profilePhoto,
  name,
  pickUpLocation,
  dropOffLocation,
  jobDate,
  amount,
  postDate,
}) => {
  return (
    <div className="w-full border-t border-gray-200">
      <Table className="">
        <TableBody>
          <TableRow>
            <TableCell>
              <div className="flex flex-row justify-between items-start">
                {/* Left Section */}
                <div className="flex items-center">
                  {/* Avatar */}
                  <Avatar className="h-16 w-16 border border-black rounded-full mr-4">
                    <img
                      src={profilePhoto}
                      alt={name}
                      className="h-full w-full rounded-full object-cover"
                    />
                  </Avatar>
                  {/* Name, Pickup & Dropoff */}
                  <div className="font-bold text-lg">{name}</div>
                  <div>
                    <div className="text-md font-semibold text-gray-600">
                      Pick Up: {pickUpLocation}
                    </div>
                    <div className="text-md font-semibold text-gray-600">
                      Drop Off: {dropOffLocation}
                    </div>
                  </div>
                  {/* Amount Offered */}
                  <div className="text-sm font-semibold text-gray-900">
                    Offer: {amount}
                  </div>
                </div>

                {/* Job Posting Date */}
                <div className="text-sm text-gray-500">
                  {" "}
                  Posted On {postDate}
                </div>
              </div>

              <div className="flex justify-between mt-4">
                {/* Job Date */}
                <div className="text-sm text-gray-600">Job Date: {jobDate}</div>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default JobsRequests;
