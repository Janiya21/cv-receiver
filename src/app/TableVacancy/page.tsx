"use client";
import React, { useState, useEffect } from "react";
import { Table, TableHeader, DatePicker, TableColumn, TableBody, TableRow, TableCell, Chip, Button, Pagination, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, useDisclosure } from "@nextui-org/react";
import VacancyAlt from "../vacancy-alt/page";
import VacancyList from "../applicants-for-vacancy/page";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { useToast } from "@/components/ui/use-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Spinner } from "@nextui-org/react";

const columns = [
  { key: "title", label: "TITLE" },
  { key: "position", label: "POSITION" },
  { key: "status", label: "STATUS" },
  { key: "endDate", label: "END DATE" },
  { key: "applicants", label: "APPLICANTS" },
  { key: "data", label: "DETAILS" },
  { key: "actions", label: "ACTIONS" },
];

const TableVacancy = () => {
  const [rows, setRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [deleteKey, setDeleteKey] = useState(null);
  const [positions, setPositions] = useState<any[]>([]);
  const [filters, setFilters] = useState({ title: "", location: "", position: "" });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState<any>({ key: "", title: "", description: "", endDate: "" });
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const itemsPerPage = 4;

  useEffect(() => {
    fetchData();
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "api/position");
      const data = await response.json();
      const positionOptions = data.map((position: { _id: string; name: string }) => ({
        value: position._id,
        label: position.name,
      }));
      setPositions(positionOptions);
    } catch (error) {
      console.error("Error fetching positions:", error);
    } finally {
      setIsSubmitting(false); // Reset isSubmitting after submission attempt
    }
  };

  const fetchData = async () => {
    try {
      const vacancyRes = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "api/vacancy");
      if (!vacancyRes.ok) {
        throw new Error(`HTTP error! status: ${vacancyRes.status}`);
      }
      const vacancyData = await vacancyRes.json();
      console.log("Vacancy data:", vacancyData);

      const formattedRows = vacancyData.map((vacancy: any) => ({
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

  const handleEdit = (key: any) => {
    const rowData = rows.find((row: any) => row.key === key);
    setEditData(rowData);
    setIsEditModalOpen(true);
  };

  const handleEditChange = (value: any, name: any) => {
    if (name === 'endDate') {
      let parsedDate;
      if (typeof value === 'string') {
        parsedDate = new Date(value);
      } else if (value instanceof Date) {
        parsedDate = value;
      }
  
      if (parsedDate instanceof Date && !isNaN(parsedDate.getTime())) {
        const month = parsedDate.getMonth() + 1;
        const day = parsedDate.getDate();
        const year = parsedDate.getFullYear();
        value = `${month}/${day}/${year}`;
      } else {
        console.error('Invalid date:', value);
        return;
      }
    }
  
    setEditData((prevState: any) => ({ ...prevState, [name]: value }));
  };

  const handleEditSubmit = async () => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + `api/vacancy`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: editData.key, title: editData.title, description: editData.description, endDate: editData.endDate }),
      });

      if (!response.ok) {
        toast({
          description: "Vacancy Edit Unsuccessful!",
          variant: "destructive",
        });
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await response.json();
      toast({
        description: "Vacancy Successfully Inactivated!",
        variant: "default",
      });
      fetchData();
      setIsEditModalOpen(false);
    } catch (error) {
      toast({
        description: "Vacancy Edit Unsuccessful!",
        variant: "destructive",
      });
      console.error('Error updating position:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + `api/vacancy`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: deleteKey, status: "inactive" }),
      });

      if (!response.ok) {
        toast({
          description: "Error Deleting Vacancy!",
          variant: "destructive",
        });
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast({
        description: "Vacancy Successfully Inactivated!",
        variant: "default",
      });

      await response.json();

      fetchData();
    } catch (error) {
      toast({
        description: "Error Deleting Vacancy!",
        variant: "destructive",
      });
      console.error("Error updating vacancy:", error);
    } finally {
      setShowConfirmation(false);
      setDeleteKey(null);
    }
  };

  const handlePageChange = (page: any) => {
    setCurrentPage(page);
  };

  const handleShowConfirmation = (key: any) => {
    setShowConfirmation(true);
    setDeleteKey(key);
  };

  const handleCancelDelete = () => {
    setShowConfirmation(false);
    setDeleteKey(null);
  };

  const handleFilterChange = (e: any) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const filteredRows = rows.filter((row: any) => {
    const matchesTitle = row.title.toLowerCase().includes(filters.title.toLowerCase());
    const matchesLocation = row.location.some((loc: any) => loc.toLowerCase().includes(filters.location.toLowerCase()));
    const matchesPosition = row.position.toLowerCase().includes(filters.position.toLowerCase());
    return matchesTitle && matchesLocation && matchesPosition;
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedRows = filteredRows.slice(startIndex, startIndex + itemsPerPage);

  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  return (
    <div>
      <Chip color="success" variant="dot" className="mb-4 text-xl px-3 py-4 font-bolder">
        ALL VACANCIES
      </Chip>
      <div className="mb-4 flex gap-4 w-1/2">
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
        {/* <Input
          placeholder="Filter by Location"
          name="location"
          value={filters.location}
          onChange={handleFilterChange}
        /> */}
      </div>
      <Table style={{ backgroundColor: "rgb(226 255 231)" }} aria-label="Example table with dynamic content">
        <TableHeader columns={columns}>
          {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
        </TableHeader>
        <TableBody items={selectedRows}>
          {(item: any) => (
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
                      <Button style={{ display: item["applicants"].length == 0 ? "flex" : "none", gap: "8px" }} className="bg-transparent border-green-400 border-2" onClick={() => handleEdit(item.key)}>
                        <FontAwesomeIcon icon={faEdit} />
                      </Button>
                      <Button className="bg-transparent border-red-300 border-2" onClick={() => handleShowConfirmation(item.key)}>
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
            <Button variant="light" color="secondary" onClick={handleCancelDelete}>
              Cancel
            </Button>
            <Button variant="ghost" color="danger" onClick={handleDelete}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <div className="mt-4 flex justify-end">
        <Pagination total={Math.ceil(filteredRows.length / itemsPerPage)} initialPage={1} page={currentPage} onChange={handlePageChange} />
      </div>

      <Modal className="min-w-[80vw] max-h-[96vh] overflow-scroll" isOpen={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Edit Vacancy</ModalHeader>
              <ModalBody>
                <Input
                  label="Title"
                  name="title"
                  value={editData.title}
                  onChange={(e) => handleEditChange(e.target.value, "title")}
                />
                <ReactQuill
                  placeholder="Description"
                  className="min-h-20"
                  // name="description"
                  modules={modules}
                  theme="snow"
                  value={editData.description}
                  onChange={(content) => handleEditChange(content, "description")}
                />
                <Input
                  label="End Date"
                  name="endDate"
                  value={editData.endDate}
                  onSelect={(date) => handleEditChange(date, "endDate")}
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
      </Modal>{isSubmitting && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <Spinner size="lg" label="fetching..." color="success" labelColor="success" />
        </div>
      )}
    </div>
  );
};

export default TableVacancy;
