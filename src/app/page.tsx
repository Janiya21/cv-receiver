// /app/page.jsx
import TableUI from "./Table/page";
import TableApplicant from "./TableApplicant/page";
import NavBarUI from "./navbar/page";
import PositionForm from "./position-form/page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VacanciesContent from "../components/ui/VacanciesContent";
import ApplicantForm from "./applicant-form/page";

export default function Home() {
  return (
    <main style={{ backgroundColor: "rgb(241 241 241);", backgroundImage: "url('fgg.png')", backgroundRepeat: "no-repeat", backgroundSize: "cover" }} className="min-h-screen py-8 px-32">
      <div className="bg-gray-50 px-10 py-5 border-1" style={{borderRadius: "20px" }}>
        <NavBarUI />
        {/* <hr className="custom-hr ms-5" /> */}
        <div className="py-6">
          <div className="mt-5">
            <div className="flex w-full flex-col">
              <Tabs defaultValue="positions" className="w-full">
                <TabsList>
                  <TabsTrigger value="positions">POSITIONS</TabsTrigger>
                  <TabsTrigger value="vacancies">VACANCIES</TabsTrigger>
                  <TabsTrigger value="applicants">APPLICANTS</TabsTrigger>
                </TabsList>
                <TabsContent value="positions">
                  <div className="flex justify-end my-4">
                    <PositionForm />
                  </div>
                  <TableUI />
                </TabsContent>
                <TabsContent value="vacancies">
                  <VacanciesContent />
                </TabsContent>
                <TabsContent value="applicants">
                  <div className="flex justify-end my-4">
                    {/* <ApplicantForm /> */}
                  </div>
                  <TableApplicant />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
