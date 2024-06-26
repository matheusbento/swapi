"use client";
import { PeopleProvider } from "@/hooks/People";
import { PeopleList } from "./PeopleList";

export const PeopleListContainer = () => {
  return (
    <PeopleProvider>
      <div className="p-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          Star Wars Characters with Brown Hair
        </h1>
        <PeopleList />
      </div>
    </PeopleProvider>
  );
};
