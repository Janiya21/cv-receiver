"use client";

import React, { useEffect, useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import { Avatar } from "@nextui-org/avatar";

interface VacancyItem {
  key: number;
  email: string;
  firstName: string;
  lastName: string;
  location: string;
  phoneNo: string;
  vacancies: string;
  url: any;
}

interface ApplicantsForVacancyProps {
  item: VacancyItem[];
}

const ApplicantsForVacancy: React.FC<ApplicantsForVacancyProps> = ({ item }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [applicants, setApplicants] = useState(item);

  useEffect(() => {
    console.log(item);
    setApplicants(item);
  }, [item]);

  const convertBufferToBlobUrl = (buffer:any) => {
    const binaryData = base64ToBuffer(buffer);
    const byteArray = new Uint8Array(buffer);
    const blob = new Blob([byteArray], { type: "application/pdf" }); // Adjust type as needed
    return URL.createObjectURL(blob);
  };

  const base64ToBuffer = (base64: string): Buffer | null => {
    try {
      // Decode base64 string to binary data
      const binaryData = Buffer.from(base64, 'base64');
      
      return binaryData;
    } catch (error) {
      console.error('Error converting base64 to Buffer:', error);
      return null;
    }
  };

  const openPdfInNewWindow = (pdfUrl:any) => {
    console.log(pdfUrl);
    window.open(pdfUrl, "_blank");
  };

  return (
    <div>
      <Button className="bg-transparent w-20" onPress={onOpen} isIconOnly>
        <Avatar className="" src="https://www.svgrepo.com/show/192244/man-user.svg" />
        <span className="ms-3"> {applicants.length}</span>
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
              <ModalBody className=" overflow-y-scroll min-h-max max-h-[90vh]">
                {applicants.map((vacancy, index) => (
                  <div key={vacancy.key}>
                    <span>
                      <div className="max-h-max w-full px-16 flex items-center justify-center dark:bg-gray-900">
                        <div
                          className="relative w-full px-10 my-2 md:my-2 flex flex-col items-start space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6 py-8 border-2 border-dashed border-gray-400 dark:border-gray-400 shadow-lg rounded-lg"
                        >
                          <span className="absolute text-xs font-medium top-0 left-0 rounded-br-lg rounded-tl-lg px-2 py-1 bg-green-100 dark:bg-green-300 dark:text-gray-300 border-green-400 dark:border-gray-400 border-b-2 border-r-2 border-dashed ">
                            Applicant {index + 1}
                          </span>
                          <div className="w-full flex justify-center sm:justify-start sm:w-auto">
                            <img
                              className="object-cover w-14 h-14 mt-3 mr-3 rounded-full"
                              src="https://images.freeimages.com/fic/images/icons/2463/glossy/512/user_male.png"
                            />
                          </div>
                          <div className="w-full sm:w-auto flex flex-col items-center sm:items-start">
                            <p className="font-display mb-2 text-xl font-semibold dark:text-gray-200">
                              {vacancy.firstName} {vacancy.lastName}
                            </p>
                            <div className="mb-4 md:text-xl text-gray-400">
                              <p className="text-medium">
                                <b className="text-medium">Mobile:</b> {vacancy.phoneNo}{" "}
                                <b className="text-medium ms-4">Email:</b> {vacancy.email}{" "}
                                <b className="text-medium ms-4">Location:</b> {vacancy.location}
                              </p>
                              <a
                                onClick={() => openPdfInNewWindow(vacancy.url)}
                                color="success"
                                className="cursor-pointer text-sm underline text-green-500"
                              >
                                View CV
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

export default ApplicantsForVacancy;
