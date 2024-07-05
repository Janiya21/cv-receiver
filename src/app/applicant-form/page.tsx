"use client";
import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input } from "@nextui-org/react";

export default function ApplicantForm() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    const positionData = {
      name,
      description,
    };

    try {
      const response = await fetch("http://localhost:3000/api/position", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(positionData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Handle successful response
      console.log("Position created successfully:", await response.json());
      // onOpenChange(false); // Close the modal
    } catch (error) {
      console.error("Error creating Applicant:", error);
    }
  };

  return (
    <>
      {/* <Button onPress={onOpen} color="primary" variant="bordered">Create Position</Button> */}
      <Button color="primary" variant="light" onPress={onOpen}>
          + Create Applicant
      </Button>
      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        placement="top-center"
      >
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
                />
                <Input
                  label="Description"
                  placeholder="Enter Description"
                  variant="bordered"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
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
