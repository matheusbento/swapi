import { PersonType } from "@/types/PersonType";
import {
  createContext,
  useContext,
  useMemo,
  useState,
  ReactNode,
  useCallback,
} from "react";

import { uniqBy } from "lodash";

export type PeopleHookType = {
  fetchPeopleHandler: () => Promise<void>;
  people: PersonType[] | null;
  isLoadingPeople: boolean;
};

export const PeopleContext = createContext<PeopleHookType | null>(null);

const usePeople = () => {
  const context = useContext(PeopleContext);
  if (!context) {
    throw new Error("usePeople must be within PeopleProvider");
  }

  return context;
};

interface PeopleProviderProps {
  children: ReactNode;
}

const PeopleProvider = ({ children }: PeopleProviderProps) => {
  const [isLoadingPeople, setIsLoadingPeople] = useState(false);
  const [people, setPeople] = useState<PersonType[] | null>(null);

  const fetchPeopleWithBrownHair = useCallback(async () => {
    let allPeopleWithBrownHair: PersonType[] = [];
    let url = "https://swapi.dev/api/people";

    while (url) {
      const response = await fetch(url);
      const data = await response.json();
      const { results, next } = data;

      const peopleWithBrownHair = results.filter((person: any) =>
        person.hair_color.includes("brown")
      );

      allPeopleWithBrownHair = [
        ...allPeopleWithBrownHair,
        ...peopleWithBrownHair,
      ];
      url = next; // set the next page URL or null if there are no more pages
    }

    return allPeopleWithBrownHair;
  }, []);

  const fetchHomeworlds = useCallback(async (homeworldUrls: any[]) => {
    const homeworlds = await Promise.all(
      homeworldUrls.map(async (url: any) => {
        const homeworldResponse = await fetch(url);
        const { name } = await homeworldResponse.json();
        return {
          url: url,
          name: name,
        };
      })
    );

    return homeworlds as { url: string; name: string }[];
  }, []);

  const fetchPeopleHandler = useCallback(async () => {
    try {
      setIsLoadingPeople(true);

      const peopleWithBrownHair = await fetchPeopleWithBrownHair();

      const homeworldsUrls = uniqBy(peopleWithBrownHair, "homeworld").map(
        (person: any) => person.homeworld
      );

      const homeworlds = await fetchHomeworlds(homeworldsUrls);

      const peopleWithHomeworlds = peopleWithBrownHair.map((person: any) => {
        const homeworld = homeworlds.find(
          (homeworld: any) => homeworld.url === person.homeworld
        );
        return {
          ...person,
          homeworld: homeworld?.name,
        };
      });

      setPeople(peopleWithHomeworlds);
    } catch (e) {
      setPeople([]);
    } finally {
      setIsLoadingPeople(false);
    }
  }, []);

  const providerValue = useMemo(
    () => ({
      isLoadingPeople,
      people,
      fetchPeopleHandler,
    }),
    [fetchPeopleHandler, people, isLoadingPeople]
  );

  return (
    <PeopleContext.Provider value={providerValue}>
      {children}
    </PeopleContext.Provider>
  );
};

export { PeopleProvider, usePeople };
