"use client";
import React, { useState, useEffect } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Button } from "@nextui-org/react";
import VacancyAlt from "../vacancy-alt/page";

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
    key: "action",
    label: "ACTION",
  }
];

const TableVacancy = () => {
  const [rows, setRows] = useState([]);

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
          endDate: position.endDate,
          status: position.status,
          createDate: position.createDate,
          position: position.position,
          location: position.location,
          description: position.description
        }));

        setRows(formattedRows);
      } catch (error) {
        console.error('Error fetching Vacancy:', error);
      }
    };

    fetchData();
  }, []);

  const handleActionClick = (item) => {
    // Implement your logic here for handling the action click
    console.log("Action clicked for item:", item);
    // Example: Redirect to vacancy details page
    // router.push(`/vacancy/${item.key}`);
  };

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

export default TableVacancy;
