import { auth } from "@/auth";
import AuthButton from "./AuthButton.server";
import TableUI from "./Table/page";
import NavBarUI from "./navbar/page";
import PositionForm from "./position-form/page";


export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col justify-between py-8 px-16">
      <NavBarUI />
      <hr className="text-white bg-white"></hr>
      <div className="grid grid-cols-2">
        <h1 className="text-xl">VACANCIES</h1>
        <div className="flex justify-end">
          <PositionForm />
        </div>
      </div>
      <div className="mt-5">
         <TableUI  />
      </div>
      {/* <pre>{JSON.stringify(session, null, 2)}</pre> */}
    </main>
  );
}


