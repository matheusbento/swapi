import { PersonType } from "@/types/PersonType";
import {
  createContext,
  useContext,
  useMemo,
  useState,
  ReactNode,
  useCallback,
} from "react";

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

  const fetchHomeworlds = useCallback(async (people: any[]) => {
    const peopleWithHomeworlds = await Promise.all(
      people.map(async (person: any) => {
        const homeworldResponse = await fetch(person.homeworld);
        const { name } = await homeworldResponse.json();
        return {
          name: person.name,
          eye_color: person.eye_color,
          homeworld: name,
        };
      })
    );

    return peopleWithHomeworlds;
  }, []);

  const fetchPeopleHandler = useCallback(async () => {
    try {
      setIsLoadingPeople(true);

      const peopleWithBrownHair = await fetchPeopleWithBrownHair();
      const peopleWithHomeworlds = await fetchHomeworlds(peopleWithBrownHair);

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
