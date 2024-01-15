import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@nextui-org/react";
import { FaGithubAlt } from "react-icons/fa6";
import { IoMdSunny } from "react-icons/io";
import { IoMdMoon } from "react-icons/io";
import { Sbiller } from "../App";

type Props = {
  dark: boolean;
  setDark: React.Dispatch<React.SetStateAction<Sbiller>>;
};

export default function NavbarCustom({ dark, setDark }: Props) {
  return (
    <Navbar shouldHideOnScroll>
      <NavbarBrand className="gap-1" as={Link} href={"/"}>
        <p className="font-bold text-lg text-success-600 dark:text-success-400">
          {"_<"}
        </p>
        <p className="font-bold text-lg text-gray-900 dark:text-gray-50">
          Biller
        </p>
      </NavbarBrand>
      <NavbarContent justify="end">
        <NavbarItem>
          <Button
            isIconOnly
            color="default"
            variant="light"
            aria-label="Toggle dark mode"
            onClick={() =>
              setDark((value) => ({ ...value, dark: !value.dark }))
            }
            className="text-gray-700 dark:text-gray-200"
          >
            {dark ? <IoMdSunny size={20} /> : <IoMdMoon size={20} />}
          </Button>
        </NavbarItem>
        <NavbarItem>
          <Button
            as={Link}
            href="https://www.github.com/jhagas/split-biller"
            variant="faded"
            className="font-bold text-success-700 dark:text-success-400"
          >
            <FaGithubAlt />
            GitHub
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
