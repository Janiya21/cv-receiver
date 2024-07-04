"use client";
import React, { useState, useEffect } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Button, Pagination } from "@nextui-org/react";
import VacancyAlt from "../vacancy-alt/page";
import VacancyList from "../applicants-for-vacancy/page";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const columns = [
  {
    key: "title",
    label: "TITLE",
  },
  {
    key: "position",
    label: "POSITION",
  },
  {
    key: "status",
    label: "STATUS",
  },
  {
    key: "endDate",
    label: "END DATE",
  },
  {
    key: "applicants",
    label: "APPLICANTS",
  },
  {
    key: "data",
    label: "DETAILS",
  },
  {
    key: "actions",
    label: "ACTIONS",
  },
];

const TableVacancy = () => {
  const [rows, setRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const positionsRes = await fetch("http://localhost:3000/api/vacancy");
        if (!positionsRes.ok) {
          throw new Error(`HTTP error! status: ${positionsRes.status}`);
        }
        const positionsData = await positionsRes.json();
        console.log("Vacancy data:", positionsData);

        const formattedRows = positionsData.map((position, index) => ({
          key: `${index + 1}`, 
          title: position.title,
          applicants: position.applicants,
          endDate: position.endDate,
          status: position.status,
          createDate: position.createDate,
          position: position.position.name,
          location: position.location,
          description: position.description,
        }));

        setRows(formattedRows);
      } catch (error) {
        console.error('Error fetching Vacancy:', error);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (key) => {
    console.log("Edit row with key:", key);
    // Implement your edit logic here
  };

  const handleDelete = (key) => {
    console.log("Delete row with key:", key);
    // Implement your delete logic here
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedRows = rows.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div>
      <Table style={{ backgroundColor: "rgb(226 255 231)" }} aria-label="Example table with dynamic content">
        <TableHeader columns={columns}>
          {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
        </TableHeader>
        <TableBody items={selectedRows}>
          {(item) => (
            <TableRow key={item.key}>
              {(columnKey) => (
                <TableCell>
                  {columnKey === "data" ? (
                    <VacancyAlt item={item} />
                  ) : columnKey === "applicants" ? (
                    <VacancyList className="" item={item.applicants} />
                  ) : columnKey === "status" ? (
                    <Chip color='success'>{item[columnKey]}</Chip>
                  ) : columnKey === "actions" ? (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Button className="bg-transparent border-green-400 border-2" auto light onClick={() => handleEdit(item.key)} ><FontAwesomeIcon icon={faEdit} /></Button>
                      <Button className="bg-transparent border-red-300 border-2" auto light onClick={() => handleDelete(item.key)} ><FontAwesomeIcon icon={faTrashAlt} /></Button>
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

export default TableVacancy;
