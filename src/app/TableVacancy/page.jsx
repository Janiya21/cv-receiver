import React, { useState, useEffect } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Button, Pagination, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input } from "@nextui-org/react";
import VacancyAlt from "../vacancy-alt/page";
import VacancyList from "../applicants-for-vacancy/page";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { useToast } from "@/components/ui/use-toast";


const positions = [
  "Addalaichenai",
  "Akkaraipattu",
  "Ampara",
  "Bakmitiyawa",
  "Central Camp",
  "Dadayamtalawa",
  "Damana",
  "Damanewela",
  "Deegawapiya",
  "Dehiattakandiya",
  "Devalahinda"
];

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
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [deleteKey, setDeleteKey] = useState(null);
  const [filters, setFilters] = useState({ title: "", location: "", position: "" });
  const { toast } = useToast();
  const itemsPerPage = 4;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const vacancyRes = await fetch("http://localhost:3000/api/vacancy");
      if (!vacancyRes.ok) {
        throw new Error(`HTTP error! status: ${vacancyRes.status}`);
      }
      const vacancyData = await vacancyRes.json();
      console.log("Vacancy data:", vacancyData);

      const formattedRows = vacancyData.map((vacancy) => ({
        key: vacancy._id,
        title: vacancy.title,
        applicants: vacancy.applicants,
        endDate: vacancy.endDate,
        status: vacancy.status,
        createDate: vacancy.createDate,
        position: vacancy.position.name,
        location: vacancy.location,
        description: vacancy.description,
      }));

      setRows(formattedRows);
    } catch (error) {
      console.error("Error fetching Vacancy:", error);
    }
  };

  const handleEdit = (key) => {
    console.log("Edit row with key:", key);
    // Implement your edit logic here
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/vacancy`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: deleteKey, status: "inactive" }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast({
        description: "Vacancy Successfully Inactivated!",
        variant: "default",
      });

      await response.json();

      fetchData();
    } catch (error) {
      console.error("Error updating vacancy:", error);
    } finally {
      setShowConfirmation(false);
      setDeleteKey(null);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleShowConfirmation = (key) => {
    setShowConfirmation(true);
    setDeleteKey(key);
  };

  const handleCancelDelete = () => {
    setShowConfirmation(false);
    setDeleteKey(null);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const filteredRows = rows.filter((row) => {
    const matchesTitle = row.title.toLowerCase().includes(filters.title.toLowerCase());
    const matchesLocation = row.location.some(loc => loc.toLowerCase().includes(filters.location.toLowerCase()));
    const matchesPosition = row.position.toLowerCase().includes(filters.position.toLowerCase());
    return matchesTitle && matchesLocation && matchesPosition;
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedRows = filteredRows.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div>
      <Chip color="success" variant="dot" className="mb-4 text-xl px-3 py-4 font-bolder">
        ALL VACANCIES
      </Chip>
      <div className="mb-4 flex gap-4">
        <Input
          placeholder="Filter by Title"
          name="title"
          value={filters.title}
          onChange={handleFilterChange}
        />
         <Input
          placeholder="Filter by Position"
          name="position"
          value={filters.position}
          onChange={handleFilterChange}
        />
        <Input
          placeholder="Filter by Location"
          name="location"
          value={filters.location}
          onChange={handleFilterChange}
        />
       
      </div>
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
                    <VacancyList item={item.applicants} />
                  ) : columnKey === "status" ? (
                    <Chip style={{ backgroundColor: item[columnKey] === "active" ? "#8FFF94" : "#FF7C7C" }}>
                      {item[columnKey]}
                    </Chip>
                  ) : columnKey === "actions" ? (
                    <div style={{ display: item["status"] === "active" ? "flex" : "none", gap: "8px" }}>
                      <Button className="bg-transparent border-green-400 border-2" auto light onClick={() => handleEdit(item.key)}>
                        <FontAwesomeIcon icon={faEdit} />
                      </Button>
                      <Button className="bg-transparent border-red-300 border-2" auto light onClick={() => handleShowConfirmation(item.key)}>
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </Button>
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

      <Modal isOpen={showConfirmation} onOpenChange={setShowConfirmation}>
        <ModalContent>
          <ModalHeader>Confirmation Required</ModalHeader>
          <ModalBody>Are you sure you want to delete this record?</ModalBody>
          <ModalFooter>
            <Button variant="text" color="secondary" onClick={handleCancelDelete}>
              Cancel
            </Button>
            <Button variant="text" color="error" onClick={handleDelete}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <div className="mt-4 flex justify-end">
        <Pagination total={Math.ceil(filteredRows.length / itemsPerPage)} initialPage={1} page={currentPage} onChange={handlePageChange} />
      </div>
    </div>
  );
};

export default TableVacancy;
