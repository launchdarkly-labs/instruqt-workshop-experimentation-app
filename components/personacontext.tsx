// PersonaContext.js
import React, { createContext, useState, ReactNode, useEffect } from 'react';
// import womanPersonaImage from '@/public/woman.svg';

interface PersonaContextProps {
  children: ReactNode;
}

interface Persona {
  personaname: string;
  personatype: string;
  personaimage: string;
  personaemail: string;
}

interface PersonaContextType {
  personas: Persona[];
  getPersonas: () => void;
}


export const PersonaContext = createContext<PersonaContextType | undefined>(undefined);

export const PersonaProvider: React.FC<PersonaContextProps> = ({ children }) => {
  const [personas, setPersonas] = useState<Persona[]>([]);

  const getPersonas = () => {
    const starterPersonas: Persona[] = [
      {
        personaname: "Cody",
        personatype: "Standard User",
        personaimage: "standard.jpg",
        personaemail: "cody@launchmail.io",
      },
      {
        personaname: "Alysha",
        personatype: "Beta User",
        personaimage: "beta.png",
        personaemail: "alysha@launchmail.io",
      },
      {
        personaname: "Jenn",
        personatype: "Developer",
        personaimage: "woman.svg",
        personaemail: "jenn@launchmail.io",
      },
    ];
    setPersonas(starterPersonas);
  };

  return (
    <PersonaContext.Provider value={{ personas, getPersonas }}>
      {children}
    </PersonaContext.Provider>
  );
};