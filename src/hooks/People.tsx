import {
  createContext,
  useContext,
  useMemo,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { PersonType } from "@/types/PersonType";
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

  const fetchPeopleWithBrownHair = useCallback(async (): Promise<
    PersonType[]
  > => {
    let allPeopleWithBrownHair: PersonType[] = [];
    let url = "https://swapi.dev/api/people";

    while (url) {
      const response = await fetch(url);
      const data = await response.json();
      const { results, next } = data;

      const peopleWithBrownHair = results.filter((person: PersonType) =>
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

  const fetchHomeworlds = useCallback(async (homeworldUrls: string[]) => {
    const homeworlds = await Promise.all(
      homeworldUrls.map(async (url: string) => {
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
        (person: PersonType) => person.homeworld
      );

      const homeworlds = await fetchHomeworlds(homeworldsUrls);

      const peopleWithHomeworlds = peopleWithBrownHair.map(
        (person: PersonType) => {
          const homeworld = homeworlds.find(
            (homeworld: { url: string; name: string }) =>
              homeworld.url === person.homeworld
          );
          return {
            ...person,
            homeworld: homeworld?.name || "Unknown",
          };
        }
      );

      setPeople(peopleWithHomeworlds);
    } catch (e) {
      setPeople([]);
    } finally {
      setIsLoadingPeople(false);
    }
  }, [fetchPeopleWithBrownHair, fetchHomeworlds]);

  const providerValue = useMemo(
    () => ({
      isLoadingPeople,
      people,
      fetchPeopleHandler,
    }),
    [isLoadingPeople, people, fetchPeopleHandler]
  );

  return (
    <PeopleContext.Provider value={providerValue}>
      {children}
    </PeopleContext.Provider>
  );
};

export { PeopleProvider, usePeople };
