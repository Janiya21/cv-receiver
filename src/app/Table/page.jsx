"use client";
import React, { useState, useEffect } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, useDisclosure, ModalContent, ModalHeader, ModalBody, ModalFooter, TableCell, Chip, Button, Pagination, Modal, ModalActions } from "@nextui-org/react";
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
    key: "status",
    label: "STATUS",
  },
  {
    key: "actions",
    label: "ACTIONS",
  }
];

const TableUI = () => {
  const [rows, setRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteKey, setDeleteKey] = useState(null); // State to store the key of the item to delete
  const itemsPerPage = 4;
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const positionsRes = await fetch("http://localhost:3000/api/position");
      if (!positionsRes.ok) {
        throw new Error(`HTTP error! status: ${positionsRes.status}`);
      }
      const positionsData = await positionsRes.json();
      console.log("Positions data:", positionsData);

      const formattedRows = positionsData
        .map((position, index) => ({
          key: position._id,
          name: position.name,
          description: position.description,
          status: position.status
        }));

      setRows(formattedRows);
    } catch (error) {
      console.error('Error fetching positions:', error);
    }
  };

  const handleEdit = (key) => {
    console.log("Edit row with key:", key);
    // Implement your edit logic here
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/position`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: deleteKey, status: 'inactive' })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await response.json();

      // After successful deletion, refetch data to update the table
      fetchData();
      
    } catch (error) {
      console.error('Error updating position:', error);
    } finally {
      onOpenChange(false); // Close the confirmation modal after deletion
      setDeleteKey(null); // Clear delete key
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleShowConfirmation = (key) => {
    onOpen();
    setDeleteKey(key);
  };

  const handleCancelDelete = () => {
    onOpenChange(false);
    setDeleteKey(null);
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
                    <div  style={{ display: item["status"] === "active" ? 'flex' : 'none', gap: '8px' }}>
                      <Button className="bg-transparent border-green-400 border-2" auto light onClick={() => handleEdit(item.key)} ><FontAwesomeIcon icon={faEdit} /></Button>
                      <Button className="bg-transparent border-red-300 border-2" auto light onClick={() => handleShowConfirmation(item.key)} ><FontAwesomeIcon icon={faTrashAlt} /></Button>
                    </div>
                  ) :  columnKey === "status" ? (    
                    <Chip style={{ backgroundColor: item[columnKey] === "active" ? '#8FFF94' : '#FF7C7C  ' }}>{item[columnKey]}</Chip>
                  ): (
                    item[columnKey]
                  )}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Confirmation Required</ModalHeader>
              <ModalBody>
                Are you sure you want to delete this record?
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={handleDelete}>
                  Yes
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

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
