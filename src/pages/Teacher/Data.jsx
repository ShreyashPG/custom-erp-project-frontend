import React, { useState } from "react";
import Select from "react-select";
import TableData from "./../../components/TModule/Table Data/TableData";
import { useLocation, useNavigate } from "react-router-dom";

export default function Data() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialTableName =  "Book Publication";
  
  const [selectedOption, setSelectedOption] = useState(initialTableName);
  // const navigate = useNavigate();
  console.log('selected in data: ',selectedOption);
  const options = [
    { value: "Research", label: "Research" },
    // { value: "Magazine Publication", label: "Magazine Publication" },
    { value: "Book Publication", label: "Book Publication" },
    {
      value: "Faculty Conference Publication",
      label: "Faculty Conference Publication",
    },
    { value: "Grants", label: "Grants" },
    { value: "Consultancy Report", label: "Consultancy Report" },
    { value: "Patent Publication", label: "Patent Publication" },
    {
      value: "Conferences, Seminars, Workshops, FDP, STTP Organized /conducted",
      label: "Conferences, Seminars, Workshops, FDP, STTP Organized /conducted",
    },
    {
      value: "STTP/FDP/Workshop/Conference Attended",
      label: "STTP/FDP/Workshop/Conference Attended",
    },
    {
      value:
        "Webinar/Guest-Expert Lecture / Video conference /Invited talks organized /conducted",
      label:
        "Webinar/Guest-Expert Lecture / Video conference /Invited talks organized /conducted",
    },
    {
      value: "Number of MoUs, collaborations / linkages for Faculty exchange",
      label: "Number of MoUs, collaborations / linkages for Faculty exchange",
    },
    { value: "Certificate Courses", label: "Certificate Courses" },
    { value: "Professional Affiliations", label: "Professional Affiliations" },
    {
      value: "Faculty as Resource Person you",
      label: "Faculty as Resource Person you",
    },
    { value: "Extension Activity", label: "Extension Activity" },
    {
      value:
        "Technical Competitions / Tech Fest Organized/Extra & Co-curricular activities Organized",
      label:
        "Technical Competitions / Tech Fest Organized/Extra & Co-curricular activities Organized",
    },
    { value: "Faculty Achievement", label: "Faculty Achievement" },
    {
      value: "Industrial Visits / Tours / Field Trip",
      label: "Industrial Visits / Tours / Field Trip",
    },
    { value: "Contribution to BoS", label: "Contribution to BoS" },
  ];

  const optionComponents = {
    Research: TableData,
    // "Magazine Publication": TableData,
    "Book Publication": TableData,
    "Faculty Conference Publication": TableData,
    Grants: TableData,
    "Consultancy Report": TableData,
    "Patent Publication": TableData,
    "Conferences, Seminars, Workshops, FDP, STTP Organized /conducted":
      TableData,
    "STTP/FDP/Workshop/Conference Attended": TableData,
    "Webinar/Guest-Expert Lecture / Video conference /Invited talks organized /conducted":
      TableData,
    "Number of MoUs, collaborations / linkages for Faculty exchange": TableData,

    "Certificate Courses": TableData,
    "Professional Affiliations": TableData,
    "Faculty as Resource Person you": TableData,
    "Extension Activity": TableData,
    "Technical Competitions / Tech Fest Organized/Extra & Co-curricular activities Organized":
      TableData,
    "Faculty Achievement": TableData,
    "Industrial Visits / Tours / Field Trip": TableData,
    "Contribution to BoS": TableData,
  };

  const handleOptionChange = (selectedOption) => {
    setSelectedOption(selectedOption.value);

  };
  return (
    <>
      <div className="w-full mt-4 flex flex-col items-center justify-center gap-2 ">
        <h2 className="text-slate-900 text-xl font-bold">
          Select your choice:
        </h2>
        <Select
          value={options.find((option) => option.value === selectedOption)}
          onChange={handleOptionChange}
          options={options}
          className="w-2/3 "
        />
      </div>
      {selectedOption && optionComponents[selectedOption] ? (
        <div className="w-full mt-4 ">
          {React.createElement(optionComponents[selectedOption], {
            tableName: selectedOption,
          })}
        </div>
      ) : (
        <div>Component not found</div>
      )}
    </>
  );
}
