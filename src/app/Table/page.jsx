"use client"
import React, { useState, useEffect } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip } from "@nextui-org/react";

const columns = [
  {
    key: "name",
    label: "NAME",
  },
  {
    key: "description",
    label: "DESCRIPTION",
  }
];

const TableUI = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const positionsRes = await fetch("http://localhost:3000/api/position");
        if (!positionsRes.ok) {
          throw new Error(`HTTP error! status: ${positionsRes.status}`);
        }
        const positionsData = await positionsRes.json();
        console.log("Positions data:", positionsData);

        // Format positions data into rows array
        const formattedRows = positionsData.map((position, index) => ({
          key: `${index + 1}`, // Assuming you want to use index + 1 as the key
          name: position.name,
          description: position.description,
        }));

        setRows(formattedRows);
      } catch (error) {
        console.error('Error fetching positions:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Table aria-label="Example table with dynamic content">
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody items={rows}>
        {(item) => (
          <TableRow key={item.key}>
            {(columnKey) => (
              <TableCell>
                {columnKey === "status" ? (
                  <Chip color={item[columnKey].toLowerCase()}>{item[columnKey]}</Chip>
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

export default TableUI;
