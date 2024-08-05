"use client";
import React, { useState, useEffect } from "react";
import { Button, DateValue, Input, DatePicker, Chip } from "@nextui-org/react";
import Select, { MultiValue, SingleValue } from 'react-select';
import "react-quill/dist/quill.snow.css";
import geoData from "../../../public/cities-by-district.json";
import { useRouter } from "next/navigation"; 
import { useToast } from "@/components/ui/use-toast";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface Option {
  value: string;
  label: string;
}

const locationsData: Option[] = Object.values(geoData).flatMap((district: { cities: string[] }) =>
  district.cities.map((city) => ({ value: city, label: city }))
);

export default function VacancyForm() {
  const router = useRouter();
  
  const [locations, setLocations] = useState<MultiValue<Option>>([]);
  const [positions, setPositions] = useState<Option[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<SingleValue<Option>>(null);
  const [status, setStatus] = useState("active");
  const [createDate, setCreateDate] = useState(getCurrentDate());
  const [endDate, setEndDate] = useState<DateValue | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();

  // State for form validation errors
  const [formErrors, setFormErrors] = useState({
    title: "",
    selectedPosition: "",
    endDate: "",
    description: "",
    locations: "",
  });

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL+"api/position");
        const data = await response.json();
        const activePositions = data.filter((position: { status: string }) => position.status === 'active');
        const positionOptions = activePositions.map((position: { _id: string; name: string }) => ({
          value: position._id,
          label: position.name,
        }));
        setPositions(positionOptions);
      } catch (error) {
        console.error("Error fetching positions:", error);
      }
    };

    fetchPositions();
  }, []);

  const convertToStr = (dateValue: DateValue | null): string => {
    return dateValue ? `${dateValue.month}/${dateValue.day}/${dateValue.year}` : "";
  };

  const handleSubmit = async () => {
    const positionData = {
      location: locations.map(loc => loc.label),
      description,
      title,
      position: selectedPosition?.value || "",
      status,
      createDate,
      endDate: convertToStr(endDate)
    };

    // Perform validation
    const errors: any = {};
    if (!title) {
      errors.title = "Title is required";
    }
    if (!selectedPosition) {
      errors.selectedPosition = "Position is required";
    }
    if (!endDate) {
      errors.endDate = "End Date is required";
    }
    if (!description.trim()) {
      errors.description = "Description is required";
    }
    if (locations.length === 0) {
      errors.locations = "Location(s) are required";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      console.log(positionData);

      const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL+"api/vacancy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(positionData),
      });

      if (!response.ok) {
        toast({
          description: "Error Creating Vacancy!",
          variant: "destructive",
        });
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log("Vacancy created successfully:", await response.json());
      toast({
        description: "Vacancy Created Successful!",
        variant: "default",
      });
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
      
    } catch (error) {
      toast({
        description: "Error Creating Vacancy!",
        variant: "destructive",
      });
      console.error("Error creating Vacancy:", error);
    }
  };

  function getCurrentDate() {
    const date = new Date();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }
  
  const modules = {
    toolbar: [
      [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
      [{size: []}],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, 
       {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image', 'video'],
      ['clean']                                  
    ],
  };

  return (
    <>
      <div style={{ borderRadius: "20px" }} className="mx-10 bg-white border-1 border-green-500">
        <div className="flex flex-col gap-2 mx-20 pb-10 pt-5">
          <Chip color="success" variant="dot" className="mb-4 text-xl px-3 py-4 font-bolder">ADD VACANCY</Chip>
          <Input
            label="Title"
            placeholder="Enter Title"
            variant="bordered"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={formErrors.title ? "border-red-500" : ""}
          />
          {formErrors.title && <span className="text-red-600">{formErrors.title}</span>}
          <Select
            isMulti
            className={`z-40 ${formErrors.locations ? "border-red-500" : ""}`}
            placeholder="Select Locations"
            options={locationsData}
            value={locations}
            onChange={(newValue) => setLocations(newValue)}
          />
          {formErrors.locations && <span className="text-red-600">{formErrors.locations}</span>}
          <Select
            placeholder="Select Position"
            options={positions}
            value={selectedPosition}
            onChange={(newValue) => setSelectedPosition(newValue)}
            className={formErrors.selectedPosition ? "border-red-500" : ""}
          />
          {formErrors.selectedPosition && <span className="text-red-600">{formErrors.selectedPosition}</span>}
          <DatePicker
            label="End Date"
            className={formErrors.endDate ? "border-red-500" : ""}
            value={endDate}
            onChange={(date) => setEndDate(date)}
          />
          {formErrors.endDate && <span className="text-red-600">{formErrors.endDate}</span>}
          <ReactQuill
            placeholder="Description"
            className={`min-h-20 ${formErrors.description ? "border-red-500" : ""}`}
            modules={modules}
            theme="snow"
            value={description}
            onChange={setDescription}
          />
          {formErrors.description && <span className="text-red-600">{formErrors.description}</span>}
          <div className="flex justify-center mt-4">
            <Button className="w-1/3 text-white font-bold" color="success" onPress={handleSubmit}>
              Create
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
