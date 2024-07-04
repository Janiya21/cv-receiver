// /components/ui/VacanciesContent.jsx
"use client";

import { useState } from 'react';
import VacancyForm from "../../app/vacancy-form/page"; 
import TableVacancy from "../../app/TableVacancy/page"; 
import { Button, Chip } from "@nextui-org/react";

export default function VacanciesContent() {
  const [showVacancyForm, setShowVacancyForm] = useState(false);

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
      <Chip color="success" variant="dot" className="mb-4 text-xl px-3 py-4 font-bolder">ALL VACANCIES</Chip>
      {showVacancyForm ? <VacancyForm /> : <TableVacancy />}
    </div>
  );
}
