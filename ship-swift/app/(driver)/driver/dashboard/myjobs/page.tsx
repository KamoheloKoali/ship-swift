import MyJobs from "@/screens/courier/dashboard/components/myjobs";

export default async function DriverJobs() {
    // const user = await currentUser();
    return (
      <div className="flex flex-row justify-center lg:justify-start">
        <MyJobs/>
      </div>
    );
  }
  