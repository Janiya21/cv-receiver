"use client";
import React, { useEffect, useState, useMemo } from "react";
import { Button, DateValue, Input } from "@nextui-org/react";
import ReactQuill from "react-quill";
import Select from 'react-select';
import "react-quill/dist/quill.snow.css";
import geoData from "../../../public/cities-by-district.json";
import {DatePicker} from "@nextui-org/react";
import {Chip} from "@nextui-org/react";

interface CityData {
  cities: string[];
}

interface Data {
  [key: string]: CityData;
}

const data: Data = geoData;

interface Option {
  value: string;
  label: string;
}

export default function VacancyForm() {
  const [district, setDistrict] = useState<Option | null>(null);
  const [city, setCity] = useState<Option | null>(null);
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState("active");
  const [startDate, setStartDate] = useState(getCurrentDate);
  const [endDate, setEndDate] = useState<DateValue | null>(null);
  const [endStr, setEdStr] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const districtOptions: Option[] = Object.keys(data).map(district => ({ value: district, label: district }));

  const cityOptions: Option[] = district ? data[district.value].cities.map(city => ({ value: city, label: city })) : [];

  const convertToStr = (dateValue: DateValue | null): string => {
    return dateValue?.month + "/" + dateValue?.day + "/" + dateValue?.year;
  };
  
  const handleSubmit = async () => {
    const positionData = {
      location: `${city?.label}, ${district?.label}`,
      description,
      title,
      position,
      status,
      startDate,
      endDate: convertToStr(endDate)
    };

    try {
      console.log(positionData);

      const response = await fetch("http://localhost:3000/api/vacancy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(positionData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log("Position created successfully:", await response.json());
    } catch (error) {
      console.error("Error creating position:", error);
    }
  };

  function getCurrentDate() {
    const date = new Date();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
  
    return `${month}/${day}/${year}`;
  }

  const modules = useMemo(() => {
    return {
      toolbar: {
        // Customize toolbar here
      }
    };
  }, []);

  return (
    <>
      <div style={{ borderRadius: "20px" }} className="mx-10 bg-white border-1 border-green-500">
        <div className="flex flex-col gap-2 mx-20 pb-10 pt-5">

          <Chip color="success" variant="dot" className="mb-4 text-xl font-bold px-3 py-4">ADD VACANCY</Chip>
          <Select
            className="z-40"
            placeholder="Select District"
            options={districtOptions}
            value={district}
            onChange={setDistrict}
          />
          <Select
            className="z-30"
            placeholder="Select City"
            options={cityOptions}
            value={city}
            onChange={setCity}
            isDisabled={!district}
          />
          <Input
            label="Title"
            placeholder="Enter Title"
            variant="bordered"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            label="Position"
            placeholder="Enter Position"
            variant="bordered"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          />
          {/* <DatePicker
            selected={endDate}
            onChange={(date: Date | null) => setEndDate(date)}
            dateFormat="MM/dd/yyyy"
          /> */}
          <DatePicker
            label="End Date"
            className="border-1"
            value={endDate}
            onChange={(date) => setEndDate(date)}
          />
          <ReactQuill
            placeholder="Description"
            className="min-h-20"
            modules={modules}
            theme="snow"
            value={description}
            onChange={setDescription}
          ></ReactQuill>
          <Button color="primary" onPress={handleSubmit}>
            Create
          </Button>
          <Button color="success" variant="flat">
            Close
          </Button>
        </div>
      </div>
    </>
  );
}
