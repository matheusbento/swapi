"use client";
import Loading from "@/components/Loading";
import Person from "@/components/Person";
import { usePeople } from "@/hooks/People";
import { useEffect } from "react";
import { Else, If, Then } from "react-if";

export const PeopleList = () => {
  const { people, isLoadingPeople, fetchPeopleHandler } = usePeople();

  useEffect(() => {
    fetchPeopleHandler();
  }, []);

  return (
    <If condition={isLoadingPeople}>
      <Then>
        <Loading />
      </Then>
      <Else>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {people?.map((person, index) => (
            <Person key={index} person={person} />
          ))}
        </div>
      </Else>
    </If>
  );
};
