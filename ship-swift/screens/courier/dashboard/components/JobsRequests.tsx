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
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>
              <div className="flex flex-col lg:flex-row justify-between items-start w-full">
                {/* Left Section */}
                <div className="flex flex-col lg:flex-row gap-4 items-center w-full">
                  {/* Avatar and Name */}
                  <div className="flex items-center w-full lg:w-[30%]">
                    <Avatar className="h-16 w-16 border border-black rounded-full mr-4 flex-shrink-0">
                      <img
                        src={profilePhoto}
                        alt={name}
                        className="h-full w-full rounded-full object-cover"
                      />
                    </Avatar>
                    <div className="font-bold text-lg truncate">{name}</div>
                  </div>

                  {/* Locations */}
                  <div className="lg:col-span-2 flex flex-col w-full lg:w-[50%]">
                    <div className="text-md font-semibold text-gray-600 truncate">
                      Pick Up: {pickUpLocation}
                    </div>
                    <div className="text-md font-semibold text-gray-600 truncate">
                      Drop Off: {dropOffLocation}
                    </div>
                  </div>

                  {/* Amount Offered */}
                  <div className="text-sm font-semibold text-gray-900 lg:text-right w-full lg:w-auto">
                    Offer: {amount}
                  </div>
                </div>
              </div>
              <div className="flex flex-col lg:flex-row w-full justify-between mt-4 lg:mt-0">
                <div className="lg:mt-4">
                  {/* Job Date */}
                  <div className="text-md font-medium text-gray-600">
                    Job Date: {jobDate}
                  </div>
                </div>
                <div className="mt-2 lg:mt-4">
                  {/* Job Posting Date */}
                  <div className="text-sm text-gray-500">
                    Posted On {postDate}
                  </div>
                </div>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default JobsRequests;
