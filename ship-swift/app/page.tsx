import { auth } from "@clerk/nextjs/server";
import { checkRoles } from "@/actions/protectActions";
import { redirect } from "next/navigation";
import Landing from "./(public)/public/page";

export default async function Home() {
  const { userId } = auth();
  if (userId === null) {
    redirect("/public");
  }

  const role = await checkRoles(userId);

  if (role.success) {
    if (role.data === "client") {
      redirect("/client");
    } else if (role.data === "driver") {
      redirect("/driver/dashboard/find-jobs");
    }
  }
  return (
    <>
      <Landing/>
    </>
  );
}
