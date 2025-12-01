// NavbarAuth.tsx
import React, { useEffect, useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link as HeroLink,
  Button,
} from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { ThemeSwitcher } from "./ThemeSwitcher";

export const AcmeLogo: React.FC = () => (
  <img
    src="/LicxoIcon.png"
    alt="Licxo Logo"
    width={36}
    height={36}
  />
);

const NavbarAuth: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      return !!localStorage.getItem("token");
    } catch {
      return false;
    }
  });

  const navigate = useNavigate();

  // Sync login state across tabs
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "token") {
        setIsLoggedIn(!!e.newValue);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
    } catch (err) {
      console.error("Failed to remove token", err);
    }
    setIsLoggedIn(false);
    // Redirect to home or login page after logout
    navigate("/", { replace: true });
  };

  return (
    <Navbar position="static" className="border-b border-gray-200">
      <NavbarBrand className="flex items-center gap-3">
        <AcmeLogo />
        <p className="font-bold text-inherit">LicxoRental</p>
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <HeroLink
            href="/addroom"
            color="foreground"
            className="px-4 py-2 rounded-md bg-danger text-white"
          >
            Add your Room
          </HeroLink>
        </NavbarItem>

        <NavbarItem>
          <HeroLink aria-current="page" href="/contact">
            Contact Us
          </HeroLink>
        </NavbarItem>

        <NavbarItem>
          <HeroLink href="/feedback">Feedback</HeroLink>
        </NavbarItem>

        <NavbarItem>
          <HeroLink href="/about">About</HeroLink>
        </NavbarItem>

        <NavbarItem>
          <HeroLink color="foreground" href="/profile">
            Profile
          </HeroLink>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        {/* If logged in -> show Logout */}
        {isLoggedIn ? (
          <>
            <NavbarItem className="hidden lg:flex">
              <HeroLink href="/profile">My Profile</HeroLink>
            </NavbarItem>

            <NavbarItem>
              <Button
                onPress={handleLogout}
                color="danger"
                variant="flat"
              >
                Logout
              </Button>
            </NavbarItem>
          </>
        ) : (
          <>
            <NavbarItem className="hidden lg:flex">
              <HeroLink href="/login">Login</HeroLink>
            </NavbarItem>

            <NavbarItem>
              <Button as={HeroLink} color="primary" href="/login" variant="flat">
                Sign Up
              </Button>
            </NavbarItem>
          </>
        )}

        <NavbarItem>
          <ThemeSwitcher />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export default NavbarAuth;
