"use client"
import { useRouter } from 'next/navigation';
import { Button } from '@nextui-org/react';
import VacancyForm from '../vacancy-form/page';


export default function CreateVacancyForm() {
  const router = useRouter();

  return (
    <div>
      <VacancyForm />
      <Button onPress={() => router.push('/')} color="primary">
        Back to Vacancies
      </Button>
    </div>
  );
}
