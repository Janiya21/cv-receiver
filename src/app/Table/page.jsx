"use client";
import React, { useState, useEffect } from "react";
import { Table, TableHeader, useDisclosure, TableColumn, ModalContent, TableBody, ModalHeader, ModalBody, ModalFooter, TableRow, TableCell, Chip, Button, Pagination, Modal, Input } from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { useToast } from "@/components/ui/use-toast";
import { Spinner } from "@nextui-org/react";

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
  const [filteredRows, setFilteredRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteKey, setDeleteKey] = useState(null);
  const [editData, setEditData] = useState({ key: "", name: "", description: "" });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const itemsPerPage = 4;
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false); 

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsSubmitting(true);
    try {
      const positionsRes = await fetch(process.env.NEXT_PUBLIC_BASE_URL+"api/position");
      if (!positionsRes.ok) {
        throw new Error(`HTTP error! status: ${positionsRes.status}`);
      }
      const positionsData = await positionsRes.json();
      console.log("Positions data:", positionsData);

      const formattedRows = positionsData.map((position) => ({
        key: position._id,
        name: position.name,
        description: position.description,
        status: position.status
      }));

      setRows(formattedRows);
      setFilteredRows(formattedRows); // Initially set filtered rows to all rows
    } catch (error) {
      console.error('Error fetching positions:', error);
    }finally {
      setIsSubmitting(false); // Reset isSubmitting after submission attempt
    }
  };

  const handleEdit = (key) => {
    const rowData = rows.find(row => row.key === key);
    setEditData(rowData);
    setIsEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleEditSubmit = async () => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL+`api/position`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: editData.key, name: editData.name, description: editData.description })
      });

      if (!response.ok) {
        toast({
          description: "Error Updating Vacancy!",
          variant: "destructive",
        });
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await response.json();

      // After successful update, refetch data to update the table
      fetchData();
      setIsEditModalOpen(false);
      toast({
        description: "Vacancy Updated Successful!",
        variant: "default",
      });
    } catch (error) {
      toast({
        description: "Error Updating Vacancy!",
        variant: "destructive",
      });
      console.error('Error updating position:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL+`api/position`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: deleteKey, status: 'inactive' })
      });

      if (!response.ok) {
        toast({
          description: "Error Updating Status!",
          variant: "destructive",
        });
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await response.json();
      toast({
        description: "Status Successfully Updated!",
        variant: "default",
      });
      // After successful deletion, refetch data to update the table
      fetchData();
    } catch (error) {
      toast({
        description: "Error Updating Status!",
        variant: "destructive",
      });
      console.error('Error updating Status:', error);
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

  const handleFilterChange = (e) => {
    const { value } = e.target;
    setFilter(value);
    const filteredData = rows.filter(row => 
      row.name.toLowerCase().includes(value.toLowerCase()) || 
      row.description.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredRows(filteredData);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedRows = filteredRows.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div>
      <Input
        placeholder="Filter by name or description"
        value={filter}
        onChange={handleFilterChange}
        className="mb-4"
      />
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
                    <div style={{ display: item["status"] === "active" ? 'flex' : 'none', gap: '8px' }}>
                      <Button className="bg-transparent border-green-400 border-2" auto light onClick={() => handleEdit(item.key)} ><FontAwesomeIcon icon={faEdit} /></Button>
                      <Button className="bg-transparent border-red-300 border-2" auto light onClick={() => handleShowConfirmation(item.key)} ><FontAwesomeIcon icon={faTrashAlt} /></Button>
                    </div>
                  ) : columnKey === "status" ? (
                    <Chip style={{ backgroundColor: item[columnKey] === "active" ? '#8FFF94' : '#FF7C7C  ' }}>{item[columnKey]}</Chip>
                  ) : (
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

      <Modal isOpen={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Edit Position</ModalHeader>
              <ModalBody>
                <Input
                  label="Name"
                  name="name"
                  value={editData.name}
                  onChange={handleEditChange}
                />
                <Input
                  label="Description"
                  name="description"
                  value={editData.description}
                  onChange={handleEditChange}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={handleEditSubmit}>
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <div className="mt-4 flex justify-end">
        <Pagination
          total={Math.ceil(filteredRows.length / itemsPerPage)}
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

export default TableUI;
