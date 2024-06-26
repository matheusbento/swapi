import { PersonType } from "@/types/PersonType";
import React from "react";

interface PersonProps {
  person: PersonType;
}

const Person: React.FC<PersonProps> = ({ person }) => {
  return (
    <>
      <div className="bg-white shadow-md rounded-lg p-6 transition transform hover:scale-105">
        <h2 className="text-2xl font-semibold mb-2 text-center text-gray-700">
          {person.name}
        </h2>
        <p className="text-gray-700 text-center mb-2">
          Eye Color: {person.eye_color}
        </p>
        <p className="text-gray-700 text-center">
          Homeworld: {person.homeworld}
        </p>
      </div>
    </>
  );
};

export default Person;
