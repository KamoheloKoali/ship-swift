import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

interface DropdownMenuComponentProps {
  driverId: string;
}

const DropdownMenuComponent: React.FC<DropdownMenuComponentProps> = ({
  driverId,
}) => {
  const router = useRouter();

  const handleDirectRequestClick = () => {
    router.push(`/client/job-post?driverId=${driverId}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="p-1">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="bg-white border rounded-lg shadow-lg">
        <DropdownMenuItem onClick={handleDirectRequestClick}>
          Direct request
        </DropdownMenuItem>
        <DropdownMenuItem>Message</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownMenuComponent;
