import React from "react";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button} from "@nextui-org/react";
import AuthButton from "../AuthButton.server";
import {Image} from "@nextui-org/image";
import {Avatar} from "@nextui-org/react";
import {User} from "@nextui-org/react";

export default function NavBarUI() {
  return (
    <Navbar>
      <NavbarBrand>
      <Image
        width={300}
        alt="NextUI hero Image"
        src="https://lh3.googleusercontent.com/proxy/kRAjJUyrHHE4Ir324W9-zeGDV6kd5Et7vnQaciI6xblV5ys2TKZTRtF9dN53RrGS_0TaV5OUtnogH7S-ALG-z_fjt8cwm3Sug3-Hp8A0xQaPKMev-PObnCRs1fUb73Jv-ZtY"
        />
        {/* <p className="font-bold text-inherit">ACME</p> */}
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {/* <NavbarItem>
          <Link color="foreground" href="#">
            Features
          </Link>
        </NavbarItem>
         */}
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
            <AuthButton />
        </NavbarItem>
        <div className="flex gap-3 items-center">
            <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
            {/* <User   
                name="Jane Doe"
                description="Product Designer"
                avatarProps={{
                    src: "https://i.pravatar.cc/150?u=a04258114e29026702d"
                }}
                /> */}
        </div>
      </NavbarContent>
    </Navbar>
  );
}
