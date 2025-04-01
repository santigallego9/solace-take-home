"use client";

import type { Advocate } from "@custom-types/advocate";
import { useEffect, useState, ChangeEvent } from "react";
import { AdvocatesTable } from "@components/advocates/AdvocatesTable";

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);

  useEffect(() => {
    console.log("fetching advocates...");
    fetch("/api/advocates").then((response) => {
      response.json().then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
      });
    });
  }, []);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;

    const searchElement = document.getElementById("search-term");
    if (searchElement) {
      searchElement.innerHTML = searchTerm;
    }

    console.log("filtering advocates...");
    const filteredAdvocates = advocates.filter((advocate) => {
      return (
        advocate.firstName.includes(searchTerm) ||
        advocate.lastName.includes(searchTerm) ||
        advocate.city.includes(searchTerm) ||
        advocate.degree.includes(searchTerm) ||
        advocate.specialties.includes(searchTerm) ||
        advocate.yearsOfExperience.includes(searchTerm)
      );
    });

    setFilteredAdvocates(filteredAdvocates);
  };

  const onClick = () => {
    console.log(advocates);
    setFilteredAdvocates(advocates);
  };

  return (
    <main style={{ margin: "24px" }}>
      <h1 className="text-3xl font-bold text-gray-800">Solace Advocates</h1>

      <div className="my-6">
        <p className="text-lg font-medium">Search</p>
        <p className="mb-2">
          Searching for:{" "}
          <span id="search-term" className="font-semibold"></span>
        </p>
        <div className="flex gap-2">
          <input
            className="search-input"
            onChange={onChange}
            placeholder="Search advocates..."
          />
          <button className="button-primary" onClick={onClick}>
            Reset Search
          </button>
        </div>
      </div>

      <AdvocatesTable advocates={filteredAdvocates} />

      <div className="overflow-x-auto rounded-lg shadow"></div>
    </main>
  );
}
