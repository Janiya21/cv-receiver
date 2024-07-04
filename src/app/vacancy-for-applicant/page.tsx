"use client";
import React, { useEffect, useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input } from "@nextui-org/react";
import { Avatar } from "@nextui-org/avatar";

interface VacancyItem {
  key: number;
  email: string;
  firstName: string;
  lastName: string;
  location: string;
  phoneNo: string;
  vacancies: string;
}

function VacancyForApplicant({ item }: { item: VacancyItem[] }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [applicants, setApplicants] = useState(item);

  useEffect(() => {
    console.log(item);
    setApplicants(item);
  }, []);

  return (
    <div>
      <Button className="bg-white" onPress={onOpen} isIconOnly>
        <Avatar src="https://i.pinimg.com/736x/90/0a/42/900a420973d57fa420190a65b467a177.jpg" />
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="top-center"
        className="min-w-[80vw] max-h-[95vh]"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1"></ModalHeader>
              <ModalBody>
                {item.map((vacancy, index) => (
                  <div key={vacancy.key}>
                    <span>
                      <div className="max-h-max w-full px-16 flex items-center justify-center dark:bg-gray-900">
                        <div
                          className="relative w-full px-10 my-8 md:my-16 flex flex-col items-start space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6 py-8 border-2 border-dashed border-gray-400 dark:border-gray-400 shadow-lg rounded-lg"
                        >
                          <span className="absolute text-xs font-medium top-0 left-0 rounded-br-lg rounded-tl-lg px-2 py-1 bg-primary-100 dark:bg-gray-900 dark:text-gray-300 border-gray-400 dark:border-gray-400 border-b-2 border-r-2 border-dashed ">
                            Vacancy {index + 1}
                          </span>
                          <div className="w-full flex justify-center sm:justify-start sm:w-auto">
                            <img
                              className="object-cover w-20 h-20 mt-3 mr-3 rounded-full"
                              src="https://images.vexels.com/content/136485/preview/office-bag-icon-f8139a.png"
                            />
                          </div>
                          <div className="w-full sm:w-auto flex flex-col items-center sm:items-start">
                            <p className="font-display mb-2 text-2xl font-semibold dark:text-gray-200">
                              {vacancy.firstName} {vacancy.lastName}
                            </p>
                            <div className="mb-4 md:text-lg text-gray-400">
                              <p>
                                <b>Mobile:</b> {vacancy.phoneNo}{" "}
                                <b className="ms-4">Email:</b> {vacancy.email}{" "}
                                <b className="ms-4">Location:</b> {vacancy.location}
                              </p>
                              <a
                                href={`cvs/example.pdf`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <u>View CV</u>
                              </a>
                            </div>
                            <div className="flex gap-4"></div>
                          </div>
                        </div>
                      </div>
                    </span>
                  </div>
                ))}
              </ModalBody>
              <ModalFooter>
                <Button color="success" variant="flat" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

export default VacancyForApplicant;
