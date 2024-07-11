"use client";
import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input } from "@nextui-org/react";
import {Card, CardHeader, CardBody, CardFooter, Divider, Link, Image} from "@nextui-org/react";

interface VacancyItem {
  key: string;
  title: string;
  endDate: string;
  status: string;
  createDate: string;
  position: string;
  location: string[];
  description:string;
}

interface VacancyAltProps {
  item: VacancyItem; // Use the defined interface
}

const VacancyAlt: React.FC<VacancyAltProps> = ({ item }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div>
      <Button onPress={onOpen} color="primary" variant="bordered">View</Button>
      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        placement="top-center"
        className="min-w-[95vw] max-h-[95vh] overflow-scroll"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1"></ModalHeader>
              <ModalBody>
              <Card >
                <CardHeader className="flex gap-3">
                  <Image
                    alt="nextui logo"
                    height={40}
                    radius="sm"
                    src="https://static.thenounproject.com/png/2043816-200.png"
                    width={40}
                  />
                  <div className="grid grid-cols-2 gap-44 ms-5">
                    <div className="flex flex-col">
                      <p className="text-md"> {item.title}</p>
                      <p className="text-small text-default-500">
                        {item.location.map((loc, index) => (
                          <span key={index}>
                            {loc}
                            {index < item.location.length - 1 && ", "}
                          </span>
                        ))}
                      </p>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-md text-green-300"> {item.status}</p>
                      <p className="text-small text-default-500">{item.createDate} - {item.endDate}</p>
                    </div>
                  </div>
                </CardHeader>
                <Divider/>
                <CardBody>
                  <div dangerouslySetInnerHTML={{ __html: item.description }} />
                </CardBody>
                <Divider/>
                <CardFooter>
                  {/* <Link
                    isExternal
                    showAnchorIcon
                    href="https://careers.senfin.com/careers.html"
                  >
                    Visit to Site
                  </Link> */}
                </CardFooter>
              </Card>
              </ModalBody>
              <ModalFooter>
                <Button  className="p-4" color="success" variant="flat" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </ div>
  );
}

export default VacancyAlt;
