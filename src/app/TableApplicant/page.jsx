"use client"
import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Button,
  Pagination,
} from "@nextui-org/react";
import { Spinner } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

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
    key: "url",
    label: "CV",
  },
  {
    key: "position",
    label: "APPLIED VACANCIES",
  },
  {
    key: "notice",
    label: "NOTICE PERIOD",
  },
];

const TableApplicanty = () => {
  const [rows, setRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const itemsPerPage = 4;

  useEffect(() => {
    const fetchData = async () => {
      setIsSubmitting(true);
      try {
        const applicantRes = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "api/applicant-alt");
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
          url: applicant.url, // Use applicant file buffer directly
          notice: applicant.noticePeriod + " months",
          position: applicant.position.name,
        }));

        console.log(formattedRows);
        setRows(formattedRows);
      } catch (error) {
        console.error("Error fetching Applicant:", error);
      } finally {
        setIsSubmitting(false); // Reset isSubmitting after submission attempt
      }
    };

    fetchData();
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedRows = rows.slice(startIndex, startIndex + itemsPerPage);

  const openPdfInNewWindow = (pdfUrl) => {
    console.log(pdfUrl);
    if (typeof window !== 'undefined') {
      window.open(pdfUrl, "_blank");
    }
    
  };

  return (
    <div>
      <Chip color="success" variant="dot" className="mb-4 text-xl px-3 py-4 font-bolder">
        ALL APPLICANTS
      </Chip>
      <Table style={{ backgroundColor: "rgb(226 255 231)" }} aria-label="Example table with dynamic content">
        <TableHeader columns={columns}>
          {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
        </TableHeader>
        <TableBody items={selectedRows}>
          {(item) => (
            <TableRow key={item.key}>
              {(columnKey) => (
                <TableCell>
                  {columnKey === "url" ? (
                    <Button
                      onClick={() => openPdfInNewWindow(item.url)}
                      variant="text"
                      color="success"
                    >
                      View CV
                    </Button>
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
        />
      </div>
      {isSubmitting && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <Spinner size="lg" label="fetching..." color="success" labelColor="success" />
        </div>
      )}
    </div>
  );
};

export default TableApplicanty;
