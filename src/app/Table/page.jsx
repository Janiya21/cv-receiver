"use client";
import React, { useState, useEffect } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Button, Pagination } from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const columns = [
  {
    key: "name",
    label: "NAME",
  },
  {
    key: "description",
    label: "DESCRIPTION",
  },
  {
    key: "actions",
    label: "ACTIONS",
  }
];

const TableUI = () => {
  const [rows, setRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

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
          status: position.status
        }));

        setRows(formattedRows);
      } catch (error) {
        console.error('Error fetching positions:', error);
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
      <Chip color="success" variant="dot" className="mb-4 text-xl px-3 py-4 font-bolder">ALL POSITIONS</Chip>
      <Table style={{ backgroundColor: "rgb(226 255 231)" }} aria-label="Example table with dynamic content">
        <TableHeader columns={columns}>
          {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
        </TableHeader>
        <TableBody items={selectedRows}>
          {(item) => (
            <TableRow key={item.key}>
              {(columnKey) => (
                <TableCell>
                  {columnKey === "actions" ? (
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
        />
      </div>
    </div>
  );
};

export default TableUI;
