import { HouseIcon, MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

export const useNavigation = () => {
  const pathname = usePathname();

  const paths = useMemo(
    () => [
      {
        name: "Home",
        href: "/",
        icon: <HouseIcon />,
      },
      {
        name: "Conversations",
        href: "/conversations",
        icon: <MessageCircle />,
        active: pathname.startsWith("/conversations"),
      },
    ],
    [pathname]
  );

  return paths;
};
