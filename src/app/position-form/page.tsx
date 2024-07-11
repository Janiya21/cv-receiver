"use client";
import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, useDisclosure } from "@nextui-org/react";
import { useToast } from "@/components/ui/use-toast";

export default function PositionForm() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();

  // State for form validation errors
  const [formErrors, setFormErrors] = useState({
    name: "",
    description: "",
  });

  const handleSubmit = async () => {
    // Perform validation
    const errors: any = {};
    if (!name) {
      errors.name = "Name is required";
    }
    if (!description.trim()) {
      errors.description = "Description is required";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const positionData = {
      name,
      description,
    };

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL+"api/position", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(positionData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast({
        description: "Position Created Successfully!",
        variant: "default",
      });
      console.log("Position created successfully:", await response.json());
      onOpenChange(); // Close the modal
      window.location.reload();
    } catch (error) {
      toast({
        description: "Error Creating Positions!",
        variant: "destructive",
      });
      console.error("Error creating position:", error);
    }
  };

  return (
    <>
      <Button color="primary" variant="light" onPress={onOpen}>
        + Create Position
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">New Position</ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  label="Name"
                  placeholder="Enter Name"
                  variant="bordered"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={formErrors.name ? "border-red-500" : ""}
                />
                {formErrors.name && <span className="text-red-600">{formErrors.name}</span>}
                <Input
                  label="Description"
                  placeholder="Enter Description"
                  variant="bordered"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={formErrors.description ? "border-red-500" : ""}
                />
                {formErrors.description && <span className="text-red-600">{formErrors.description}</span>}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={handleSubmit}>
                  Create
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
