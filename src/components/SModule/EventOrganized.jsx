import { useState } from "react";
import {
  Card,
  Select,
  Option,
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { addRecordsOrganized, uploadRecordsOrganized } from "./API_Routes";

export default function EventOrganized() {
  const navigate = useNavigate();

  const [isFinancialSupport, setIsFinancialSupport] = useState(false);
  const [uploadedFilePaths, setUploadedFilePaths] = useState({});

  const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    S_ID: null,
    Username: currentUser?.Username,
    Academic_Year: "",
    Student_Name: currentUser?.Name,
    Roll_No: null,
    Department: "",
    Class: "",
    Email_ID: currentUser?.Username,
    Mobile_No: "",
    Extension_Activity_Name: "",
    Name_of_Sub_Activity: "",
    Organized_by: "",
    Organizer_Name: "",
    Organizer_Type: "",
    Place: "",
    Organization_Name: "",
    Start_Date: "",
    End_Date: "",
    Financial_Support_given_by_Institute_in_INR: "",
    Award: "",
    Remarks: "",
    Geo_Tag_Photos: "",
    Upload_Certificate_or_Letter_of_Appreciation: null,
    Upload_Evidence: null,
  });

  const generateAcademicYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const Options = [];

    for (let year = 2023; year <= currentYear; year++) {
      const academicYearStart = `${year}-${year + 1}`;
      Options.push(
        <Option key={academicYearStart} value={academicYearStart}>
          {academicYearStart}
        </Option>
      );
    }

    return Options;
  };

  const handleOnChange = (e) => {
    const { id, value, type, files } = e.target;

    setFormData({
      ...formData,
      [id]:
        type === "file" ? (files && files.length > 0 ? files[0] : null) : value,
    });
  };

  const handleFileUpload = async (files) => {

    console.log("file as:", files);
    try {

      const queryParams = new URLSearchParams();

      queryParams.append("username", currentUser?.Username);
      queryParams.append("role", currentUser?.Role);
      queryParams.append("tableName", "student_event_organized");

      const formDataForFile = new FormData();
      const columnNames = [];
      if (formData.Upload_Certificate_or_Letter_of_Appreciation) {
        formDataForFile.append("files", formData.Upload_Certificate_or_Letter_of_Appreciation);
        columnNames.push("Upload_Certificate_or_Letter_of_Appreciation");
      }
      if (formData.Upload_Evidence) {
        formDataForFile.append("files", formData.Upload_Evidence);
        columnNames.push("Upload_Evidence");
      }

      queryParams.append("columnNames", columnNames.join(","));
      console.log("query = ", queryParams);

      const url = `${uploadRecordsOrganized}?${queryParams.toString()}`;
      console.log("formdata = ", formData);

      const response = await axios.post(url, formDataForFile, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(response?.data);
      return response?.data?.uploadResults;

    } catch (error) {
      console.error("Error uploading file:", error);
      // Handle error as needed
      toast.error(error?.response?.data?.message, {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  //add new record
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    // Check if evidence upload is required
    if (isFinancialSupport && formData.Upload_Evidence === null) {
      alert("Upload Evidence document");
      return;
    }

    try {

      const filesToUpload = [];

      if (isFinancialSupport) {
        filesToUpload.push(formData.Upload_Evidence);
      }
      if (formData.Upload_Certificate_or_Letter_of_Appreciation !== null) {
        filesToUpload.push(formData.Upload_Certificate_or_Letter_of_Appreciation);
      }
      else {
        toast.error("Please select a file for upload", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        return;
      }

      const uploadResults = await handleFileUpload(filesToUpload);

      const updatedUploadedFilePaths = { ...uploadedFilePaths };

      uploadResults.forEach((result) => {
        updatedUploadedFilePaths[result.columnName] = result.filePath;
      });

      setUploadedFilePaths(updatedUploadedFilePaths);

      const formDataWithFilePath = {
        ...formData,
        ...updatedUploadedFilePaths,
      };

      console.log("Final data:", formDataWithFilePath);

      // Send a POST request to the addRecordsBook API endpoint
      await axios.post(addRecordsOrganized, formDataWithFilePath);

      // Display a success toast
      toast.success("Record Added Successfully", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      // Navigate to "/t/data" after successful submission
      navigate("/s/data");
    } catch (error) {
      // Handle file upload error
      // console.error("File upload error:", error);

      // Display an error toast
      toast.error(error?.response?.data?.message, {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  return (
    <>
      <Card
        color="transparent"
        shadow={false}
        className="border border-gray-300 w-85 mx-auto p-2 my-2 rounded-md"
      >
        <Typography
          variant="h4"
          color="blue-gray"
          className="mx-auto underline underline-offset-2"
        >
          Event Organized
        </Typography>

        <form className="mt-8 mb-2" onSubmit={handleSubmit}>
          <div className="mb-4 flex flex-wrap -mx-4">
            <div className="w-full md:w-1/2 px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Department
              </Typography>
              <Select
                id="Department"
                size="lg"
                label="Department"
                value={formData.Department}
                onChange={(value) =>
                  handleOnChange({
                    target: { id: "Department", value },
                  })
                }
              >
                <Option value="CS">CS</Option>
                <Option value="IT">IT</Option>
                <Option value="EnTC">EnTC</Option>
                <Option value="FE">FE</Option>
              </Select>
            </div>
            <div className="w-full md:w-1/2 px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Academic Year
              </Typography>
              <Select
                size="lg"
                id="Academic_Year"
                value={formData.Academic_Year}
                label="Academic Year"
                onChange={(value) =>
                  handleOnChange({
                    target: { id: "Academic_Year", value },
                  })
                }
              >
                {generateAcademicYearOptions()}
              </Select>
            </div>
          </div>

          <div className="mb-4 flex flex-wrap -mx-4">
            <div className="w-full md:w-1/2 px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Year of Study
              </Typography>
              <Select
                id="Class"
                size="lg"
                label="Class"
                value={formData.Year}
                onChange={(value) =>
                  handleOnChange({
                    target: { id: "Class", value },
                  })
                }
              >
                <Option value="FE">FE</Option>
                <Option value="SE">SE</Option>
                <Option value="TE">TE</Option>
                <Option value="BE">BE</Option>
              </Select>
            </div>
            <div className="w-full md:w-1/2 px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Roll No
              </Typography>
              <Input
                id="Roll_No"
                size="lg"
                type="number"
                label="Roll No"
                value={formData.Roll_No}
                onChange={handleOnChange}
              />
            </div>
          </div>

          <div className="mb-4 flex flex-wrap -mx-4">
            <div className="w-full md:w-1/2 px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Extension Activity Name
              </Typography>
              <Input
                id="Extension_Activity_Name"
                size="lg"
                label="Extension Activity Name"
                value={formData.Extension_Activity_Name}
                onChange={handleOnChange}
              />
            </div>
            <div className="w-full md:w-1/2 px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Organized by
              </Typography>
              <Input
                id="Organized_by"
                size="lg"
                label="Organized by"
                value={formData.Organized_by}
                onChange={handleOnChange}
              />
            </div>
          </div>

          <div className="mb-4 flex flex-wrap -mx-4">
            <div className="w-full md:w-1/2 px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Mobile no
              </Typography>
              <Input
                id="Mobile_No"
                size="lg"
                label="Mobile No"
                value={formData.Mobile_No}
                onChange={handleOnChange}
              />
            </div>
            <div className="w-full md:w-1/2 px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Name of Sub Activity
              </Typography>
              <Input
                id="Name_of_Sub_Activity"
                size="lg"
                label="Name of Sub Activity"
                value={formData.Name_of_Sub_Activity}
                onChange={handleOnChange}
              />
            </div>
          </div>

          <div className="mb-4 flex flex-wrap -mx-4">
            <div className="w-full px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Organizer Name
              </Typography>
              <Input
                id="Organizer_Name"
                size="lg"
                label="Organizer_Name"
                value={formData.Organizer_Name}
                onChange={handleOnChange}
              />
            </div>
          </div>

          <div className="mb-4 flex flex-wrap -mx-4">
            <div className="w-full md:w-1/2 px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Organizer Type
              </Typography>
              <Select
                id="Organizer_Type"
                size="lg"
                label="Select Organizer Type"
                value={formData.Organizer_Type}
                onChange={(value) =>
                  handleOnChange({
                    target: { id: "Organizer_Type", value },
                  })
                }
              >
                <Option value="National">National</Option>
                <Option value="International">International</Option>
                <Option value="University">University</Option>
                <Option value="State">Others</Option>
              </Select>
            </div>
            <div className="w-full md:w-1/2 px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Place
              </Typography>
              <Input
                id="Place"
                size="lg"
                label="Place"
                value={formData.Place}
                onChange={handleOnChange}
              />
            </div>
          </div>

          <div className="mb-4 flex flex-wrap -mx-4">
            <div className="w-full md:w-1/2 px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Start Date
              </Typography>
              <Input
                id="Start_Date"
                size="lg"
                label="Start Date"
                type="date"
                value={formData.Start_Date}
                onChange={handleOnChange}
              />
            </div>
            <div className="w-full md:w-1/2 px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                End Date
              </Typography>
              <Input
                id="End_Date"
                size="lg"
                label="End Date"
                type="date"
                value={formData.End_Date}
                onChange={handleOnChange}
              />
            </div>
          </div>

          <div className="mb-4 flex flex-wrap -mx-4">
            <div className="w-full">
              <div className="px-4 mb-4 flex justify-start items-center gap-4">
                <Typography variant="h6" color="blue-gray" className="mb-3">
                  Financial support from institute in INR
                </Typography>
                <div className="flex gap-3">
                  <label className="mx-2">
                    <input
                      type="radio"
                      name="financialSupport"
                      value="yes"
                      checked={isFinancialSupport}
                      onChange={() => setIsFinancialSupport(true)}
                    />
                    Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="financialSupport"
                      value="no"
                      checked={!isFinancialSupport}
                      onChange={() => setIsFinancialSupport(false)}
                    />
                    No
                  </label>
                </div>
              </div>
              <div className="flex justify-between  flex-col md:flex-row">
                <div className="w-full md:w-1/2 px-4 mb-4">
                  <Input
                    size="lg"
                    label="Amount in INR"
                    id="Financial_Support_given_by_Institute_in_INR"
                    type="number"
                    value={formData.Financial_Support_given_by_Institute_in_INR}
                    onChange={handleOnChange}
                    disabled={!isFinancialSupport}
                  />
                </div>
                <div className="w-full md:w-1/2 px-4 mb-4">
                  <Input
                    size="lg"
                    label="Evidence Document"
                    id="Upload_Evidence"
                    type="file"
                    onChange={handleOnChange}
                    disabled={!isFinancialSupport}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4 flex flex-wrap -mx-4">
            <div className="w-full  px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Award
              </Typography>
              <Input
                id="Award"
                size="lg"
                label="Award"
                value={formData.Award}
                onChange={handleOnChange}
              />
            </div>


          </div>

          <div className="mb-4 flex flex-wrap -mx-4">
            <div className="w-full md:w-1/2 px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Upload Completion Certificate (Only Pdf)
              </Typography>
              <Input
                id="Upload_Certificate_or_Letter_of_Appreciation"
                size="lg"
                label="Completion Certificate"
                type="file"
                onChange={handleOnChange}
              />
            </div>
            <div className="w-full md:w-1/2 px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Geo Tag Photos
              </Typography>
              <Input
                id="Geo_Tag_Photos"
                size="lg"
                label="Geo Tag Photos"
                value={formData.Geo_Tag_Photos}
                onChange={handleOnChange}
              />
            </div>
          </div>

          <div className="mb-4 flex flex-wrap -mx-4">
            <div className="w-full  px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Remarks
              </Typography>
              <Input
                id="Remarks"
                size="lg"
                label="Remarks"
                value={formData.Remarks}
                onChange={handleOnChange}
              />
            </div>
          </div>

          <Button type="submit" className="mt-4" fullWidth>
            Submit
          </Button>
        </form>
      </Card>
    </>
  );
}
