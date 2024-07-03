"use client";
import React, { useState, useEffect } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Button } from "@nextui-org/react";
// import VacancyAlt from "../vacancy-alt/page";

const columns = [
  {
    key: "email",
    label: "EMAIL",
  },
  {
    key: "firstName",
    label: "FIRST NAME",
  },
  {
    key: "lastName",
    label: "LAST NAME",
  },
  {
    key: "location",
    label: "LOCATION",
  },
  {
    key: "phoneNo",
    label: "MOBILE",
  }
];

const TableApplicanty = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const applicantRes = await fetch("http://localhost:3000/api/applicant");
        if (!applicantRes.ok) {
          throw new Error(`HTTP error! status: ${applicantRes.status}`);
        }
        const applicationData = await applicantRes.json();
        console.log("Application data:", applicationData);

        const formattedRows = applicationData.map((applicant, index) => ({
          key: `${index + 1}`, 
          email: applicant.email,
          firstName: applicant.firstName,
          lastName: applicant.lastName,
          location: applicant.location,
          phoneNo: applicant.phoneNo,
          vacancy:applicant.vacancy
        }));

        setRows(formattedRows);
      } catch (error) {
        console.error('Error fetching Applicant:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Table style={{backgroundColor:"rgb(226 255 231)"}} aria-label="Example table with dynamic content">
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody items={rows}>
        {(item) => (
          <TableRow key={item.key}>
            {(columnKey) => (
              <TableCell>
                {columnKey === "action" ? (
                  // <Button style={{color:"green", backgroundColor:"#BCF3C8"}} onClick={() => handleActionClick(item)}>Show More</Button>
                  <VacancyAlt item={item} />
                ) : columnKey === "status" ? (
                  <Chip color='success'>{item[columnKey]}</Chip>
                ) : (
                  item[columnKey]
                )}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default TableApplicanty;
