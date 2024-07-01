// /app/components/ui/CreateVacancyButton.jsx
"use client";

import { Button } from "@nextui-org/react";

export default function CreateVacancyButton({ onClick }) {
  return (
    <Button color="primary" variant="bordered" onClick={onClick}>
      Create Vacancy
    </Button>
  );
}
