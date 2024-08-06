// /components/ui/VacanciesContent.jsx
"use client";

import { useState } from 'react';
import VacancyForm from "../../app/vacancy-form/page"; 
import { Button, Chip } from "@nextui-org/react";
import TableVacancy from '@/app/TableVacancy/page';
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function VacanciesContent() {
  const [showVacancyForm, setShowVacancyForm] = useState(false);
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    
    if (!session) {
      console.log("not authenticated!");
      
      router.push(`/auth/signIn?callbackUrl=${encodeURIComponent(window.location.href)}`);
    }else{
      console.log("authenticated!");
    }
  }, [session, status, router]);

  const handleCreateVacancyClick = () => {
    if(showVacancyForm){
        setShowVacancyForm(false);
    }else{
        setShowVacancyForm(true);
    }
  };

  return (
    <div>
      <div className="flex justify-end my-2 me-10">
        <Button color="primary" variant="light" onClick={handleCreateVacancyClick}>
            {showVacancyForm ? "<< Back" : "+ Create Vacancy"}
        </Button>
      </div>
      
      {showVacancyForm ? <VacancyForm /> : <TableVacancy />}
    </div>
  );
}
