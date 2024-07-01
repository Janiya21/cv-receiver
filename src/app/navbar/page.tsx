import React from "react";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button} from "@nextui-org/react";
import AuthButton from "../AuthButton.server";
import {Image} from "@nextui-org/image";
import {Avatar} from "@nextui-org/react";
import {User} from "@nextui-org/react";

export default function NavBarUI() {
  return (
    <Navbar style={{backgroundColor:"white", borderRadius:"20px"}} className="py-4 pb-10 border-1 z-50">
      <NavbarBrand>
      <Image
        className="mt-5"
        width={250}
        alt="NextUI hero Image"
        src="	https://www.senfin.com/images/header/logo-xs@2x.png"
        />
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
            <AuthButton />
        </NavbarItem>
        <div className="flex gap-3 items-center">
            <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
        </div>
      </NavbarContent>
    </Navbar>
  );
}
