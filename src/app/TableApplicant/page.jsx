"use client";
import React, { useState, useEffect } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Button, Pagination } from "@nextui-org/react";
import VacancyForApplicant from "../vacancy-for-applicant/page";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import VacancyAlt from "../vacancy-alt/page";

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
  },
  {
    key: "cv",
    label: "CV",
  },
  {
    key: "vacancies",
    label: "APPLIED VACANCIES",
  }
];

const TableApplicanty = () => {
  const [rows, setRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

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
          vacancy: applicant.vacancy,
          cv: applicant.cv,
          vacancies: applicant.vacancies
        }));

        setRows(formattedRows);
      } catch (error) {
        console.error('Error fetching Applicant:', error);
      }
    };

    fetchData();
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedRows = rows.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div>
      <Chip color="success" variant="dot" className="mb-4 text-xl px-3 py-4 font-bolder">ALL APPLICANTS</Chip>
      <Table style={{ backgroundColor: "rgb(226 255 231)" }} aria-label="Example table with dynamic content">
        <TableHeader columns={columns}>
          {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
        </TableHeader>
        <TableBody items={selectedRows}>
          {(item) => (
            <TableRow key={item.key}>
              {(columnKey) => (
                <TableCell>
                  {columnKey === "action" ? (
                    <VacancyAlt item={item} />
                  ) : columnKey === "status" ? (
                    <Chip color='success'>{item[columnKey]}</Chip>
                  ) : columnKey === "cv" ? (
                    <a
                      href={`cvs/${item.cv}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <u>View CV</u>
                    </a>
                  ) : columnKey === "vacancies" ? (
                    <div>
                      <Dropdown>
                        <DropdownTrigger>
                          <Button
                            variant="bordered"
                          >
                            Vacancy List
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Dynamic Actions" items={item.vacancies}>
                          {item.vacancies.map((vacancy, index) => (
                            <DropdownItem key={index}>
                              <div className="flex">
                                <div className="ms-2 mt-2">{vacancy.title} | {vacancy.createDate}</div>
                              </div>
                            </DropdownItem>
                          ))}
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                  ) : (
                    item[columnKey]
                  )}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="mt-4 flex justify-end">
        <Pagination
          total={Math.ceil(rows.length / itemsPerPage)}
          initialPage={1}
          page={currentPage}
          onChange={handlePageChange}
        />...
      </div>
    </div>
  );
};

export default TableApplicanty;
