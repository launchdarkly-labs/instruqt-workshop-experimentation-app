//@ts-nocheck
import * as React from "react";
import { useRef, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PersonaContext } from "../PersonaContext";
import marketplaceVerticalLogo from "@/public/marketplace/galaxy_marketplace_logo_vertical.svg";

interface LoginComponentProps {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  loginUser: any;
  name: string;
}

export function LoginComponent({
  isLoggedIn,
  setIsLoggedIn,
  loginUser,
  name,
}: LoginComponentProps) {
  const inputRef = useRef();
  const [activeElement, setActiveElement] = useState(null);
  const [defaultEmail, setDefaultEmail] = useState("jenn@launchmail.io");
  const marketButtonColorClass =
    "bg-gradient-to-r from-marketblue text-black to-marketgreen text-black";

  const [newPersona, setNewPersona] = useState({ name: "", type: "", image: "", email: "" });
  const { personas, getPersonas } = useContext(PersonaContext);
  const [isAddUserDropdownOpen, setIsAddUserDropdownOpen] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleNewPersonaChange = (e) => {
    setNewPersona({ ...newPersona, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    getPersonas();
  }, [isLoading]);

  const showBackButton = () => {
    setIsAddUserDropdownOpen(false);
    setSubmitError(null);
  };

  function handleLogin(e) {
    setIsLoggedIn(true);
    let email;
    let name;
    const activePersona = personas.find((p) => p.personaname === activeElement);
    if (activePersona) {
      email = activePersona.personaemail;
      name = activePersona.personaname;
    } else {
      // email = 'jenn@launchmail.io';
      // name = 'Jenn';
      email = defaultEmail;
      name = email.split("@")[0];
      name = name.charAt(0).toUpperCase() + name.slice(1);
    }
    loginUser(name, email);
  }

  const handleSetActive = (personaname, personaemail) => {
    setActiveElement(personaname);
    setDefaultEmail(personaemail);
  };

  useEffect(() => {
    if (activeElement) {
      handleLogin();
    }
  }, [activeElement]);

  const toggleAddUserDropdown = () => {
    setIsAddUserDropdownOpen(!isAddUserDropdownOpen);
  };

  return (
    <div className="w-full  bg-white font-audimat shadow-xl mx-auto text-black p-4 sm:p-8 rounded-lg">
      <div className="flex flex-col justify-center mx-auto text-center">
        <img src={marketplaceVerticalLogo.src} className=" mx-auto pb-4" />
      </div>
      <div className="w-full ">
        <Input
          placeholder="Email"
          value={defaultEmail || "jenn@launchmail.io"}
          ref={inputRef}
          className=" outline-none border-0 border-b-2 text-xl"
          onChange={(e) => setDefaultEmail(e.target.value)}
        />
        <div className="my-4 flex flex-col gap-y-4">
          <Button
            onClick={handleLogin}
            className={` w-full h-full text-xl mx-auto font-audimat 
          rounded-none hover:bg-gradient-experimentation-grey hover:text-white bg-gradient-experimentation text-white`}
          >
            Login with SSO
          </Button>

          <Dialog
            onDismiss={() => {
              setIsAddUserDropdownOpen(false);
            }}
            className="z-10"
          >
            <DialogTrigger
              className={`w-full min-h-full p-1 font-shone rounded-none text-xl border-4
           marketbordergradient hover:h-full hover:bg-gradient-experimentation-grey hover:text-white  text-black`}
              style={{
                borderImage: "linear-gradient(225deg, #EBFF38 -7.08%, #3DD6F5 90.68%)",
                borderImageSlice: "2",
              }}
            >
              Switch SSO User
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Switch SSO User</DialogTitle>

                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <img src="loading-spinner.gif"></img>
                  </div>
                ) : (
                  <div className="overflow-y-auto h-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 justify-items-center mb-4 pt-6">
                      {personas.map((item: Persona, index: number) => (
                        <div className="flex flex-col items-center cursor-pointer " key={index}>
                          <img
                            src={item.personaimage}
                            className={`hover:brightness-125 w-24 rounded-full mb-4 ${activeElement === item.personaname ? "border-4 border-black" : ""
                              }`}
                            onClick={() => handleSetActive(item.personaname, item.personaemail)}
                            alt={item.personaname}
                          />
                          <p className="text-xs sm:text-sm md:text-base text-center font-bold font-sohnelight">
                            {item.personaname}
                          </p>
                          <p className="text-xs sm:text-sm md:text-base text-center font-bold font-sohnelight">
                            {item.personatype}
                          </p>
                        </div>
                      ))}


                    </div>
                  </div>
                )}
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="flex flex-col items-start sm:items-baseline font-sohnelight font-extralight sm:flex-row text-xs">
        <div className="pb-3">
          <p>Forgot Password?</p>
        </div>
        <div>
          <p className="text-right">
            Don't have an account?{" "}
            <a href={window.location.href} className="text-blue-600 ml-2">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
