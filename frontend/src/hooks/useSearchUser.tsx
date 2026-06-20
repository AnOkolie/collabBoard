import { useState, useEffect, useRef } from "react";
import { useFetcher } from "react-router-dom";
import { SearchResponse } from "../types/user";

import { TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";

export const useSearchUser = (delay: number) => {
  const [searchName, setSearchName] = useState("");
  const fetcher = useFetcher<SearchResponse>();
  const lastQueryRef = useRef("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchName.trim()) {
        const trimmed = searchName.trim();
        if (trimmed === lastQueryRef.current) return;
        fetcher.load(`/search?username=${encodeURIComponent(trimmed)}`);
        lastQueryRef.current = trimmed;
      }
    }, delay);

    return () => clearTimeout(timeout);
  }, [searchName, delay, fetcher]);

  useEffect(() => {
    if (!searchName.trim()) {
      lastQueryRef.current = "";
    }
  }, [searchName]);

  const usersByName = fetcher.data?.data ?? [];
  const isLoading = fetcher.state === "loading";
  return {
    searchName,
    setSearchName,
    usersByName,
    isLoading,
  };
};
type SearchUserInputProps = {
  searchName: string;
  setSearchName: React.Dispatch<React.SetStateAction<string>>;
};

export const SearchUserComponent = ({
  searchName,
  setSearchName,
}: SearchUserInputProps) => {
  return (
    <TextInput
      placeholder="Enter the username of the collaborator you would like to find..."
      radius="md"
      value={searchName}
      onChange={(e) => setSearchName(e.currentTarget.value)}
      rightSection={<IconSearch size={16} />}
    />
  );
};
