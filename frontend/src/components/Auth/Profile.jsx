import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCheck, FaRegUser, FaPlus, FaTrash } from "react-icons/fa";
import { MdOutlineMailOutline, MdPhone, MdOutlineWorkOutline } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { Context } from "../../main";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "../styles";
import StarsCanvas from "../utils/Stars";

const Profile = () => {
  const [profile, setProfile] = useState({
    _id: "",
    name: "",
    email: "",
    phone: "",
    role: "",
    keywords: [],
    myCompanies: [],
  });
  const [companyList, setCompanyList] = useState([]);
  const [newKeyword, setNewKeyword] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [editingMode, setEditingMode] = useState(false);
  const { isAuthorized } = useContext(Context);
  const navigateTo = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/user/getuser",
          { withCredentials: true }
        );
        console.log(data)
        setProfile(data.user);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchCompanyList = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/job/companyList"
        );
        setCompanyList(data.companies.map((company) => company.nameOfTheCompany));
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
    if (editingMode) {
      fetchCompanyList();
    }
  }, [editingMode]);

  if (!isAuthorized) {
    navigateTo("/login");
  }

  const handleEnableEdit = () => {
    setEditingMode(true);
  };

  const handleDisableEdit = () => {
    setEditingMode(false);
  };

  const handleUpdateProfile = async () => {
    try {
      const { data } = await axios.put(
        `http://localhost:4000/api/v1/user/update/${profile._id}`,
        profile,
        { withCredentials: true }
      );
      toast.success(data.message);
      setEditingMode(false);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleInputChange = (field, value) => {
    setProfile((prevProfile) => ({ ...prevProfile, [field]: value }));
  };

  const handleAddKeyword = () => {
    if (newKeyword.trim() !== "") {
      setProfile((prevProfile) => ({
        ...prevProfile,
        keywords: [...prevProfile.keywords, newKeyword.trim()],
      }));
      setNewKeyword("");
    }
  };

  const handleRemoveKeyword = (index) => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      keywords: prevProfile.keywords.filter((_, i) => i !== index),
    }));
  };

  const handleAddCompany = () => {
    if (newCompany.trim() !== "") {
      setProfile((prevProfile) => ({
        ...prevProfile,
        myCompanies: [...prevProfile.myCompanies, newCompany.trim()],
      }));
      setNewCompany("");
    }
  };

  const handleRemoveCompany = (index) => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      myCompanies: prevProfile.myCompanies.filter((_, i) => i !== index),
    }));
  };

  const availableCompanies = companyList.filter(
    (company) => !profile.myCompanies.includes(company)
  );

  return (
    <section
      className={`${styles.paddings} page py-8 min-h-screen`}
    >
      <div className="absolute inset-0 z-0">
        <StarsCanvas />
      </div>
      <motion.div
        initial="hidden"
        animate="show"
        className={`${styles.innerWidth} mx-auto flex lg:flex-row flex-col gap-8`}
      >
        <motion.div
          initial={{ x: "100vw" }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 50 }}
          className="flex-[0.75] flex justify-center flex-col bg-transparent p-8 border-[1px] border-gray-400 mx-auto rounded-lg shadow-2xl backdrop-blur-lg"
        >
          <div className="absolute w-[90%] inset-0 gradient-04" />
          <div className="header mb-4 text-center">
            <h1 className="text-2xl font-bold text-white">Your Profile</h1>
          </div>
          <div className="content space-y-4">
            <div className="flex mb-4 items-center">
              <div className="flex items-center justify-center w-[70px] h-[70px] rounded-[24px] bg-[#323F5D]">
                <FaRegUser className="text-white text-[20px]" />
              </div>
              <div className="flex-1 ml-[30px]">
                <label className="block mb-2 text-white">Name</label>
                {editingMode ? (
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full p-2 border border-gray-600 bg-transparent rounded-md text-white"
                  />
                ) : (
                  <div className="w-full p-2 border border-gray-600 bg-transparent rounded-md text-white">
                    {profile.name}
                  </div>
                )}
              </div>
            </div>
            <div className="flex mb-4 items-center">
              <div className="flex items-center justify-center w-[70px] h-[70px] rounded-[24px] bg-[#323F5D]">
                <MdOutlineMailOutline className="text-white text-[20px]" />
              </div>
              <div className="flex-1 ml-[30px]">
                <label className="block mb-2 text-white">Email</label>
                {editingMode ? (
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full p-2 border border-gray-600 bg-transparent rounded-md text-white"
                  />
                ) : (
                  <div className="w-full p-2 border border-gray-600 bg-transparent rounded-md text-white">
                    {profile.email}
                  </div>
                )}
              </div>
            </div>
            <div className="flex mb-4 items-center">
              <div className="flex items-center justify-center w-[70px] h-[70px] rounded-[24px] bg-[#323F5D]">
                <MdPhone className="text-white text-[20px]" />
              </div>
              <div className="flex-1 ml-[30px]">
                <label className="block mb-2 text-white">Phone</label>
                {editingMode ? (
                  <input
                    type="text"
                    value={profile.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="w-full p-2 border border-gray-600 bg-transparent rounded-md text-white"
                  />
                ) : (
                  <div className="w-full p-2 border border-gray-600 bg-transparent rounded-md text-white">
                    {profile.phone}
                  </div>
                )}
              </div>
            </div>
            <div className="flex mb-4 items-center">
              <div className="flex items-center justify-center w-[70px] h-[70px] rounded-[24px] bg-[#323F5D]">
                <MdOutlineWorkOutline className="text-white text-[20px]" />
              </div>
              <div className="flex-1 ml-[30px]">
                <label className="block mb-2 text-white">Role</label>
                <div className="w-full p-2 border border-gray-600 bg-transparent rounded-md text-white">
                  {profile.role}
                </div>
              </div>
            </div>
            <div className="flex mb-4 items-center">
              <div className="flex items-center justify-center w-[70px] h-[70px] rounded-[24px] bg-[#323F5D]">
                <MdOutlineMailOutline className="text-white text-[20px]" />
              </div>
              <div className="flex-1 ml-[30px]">
                <label className="block mb-2 text-white">Keywords</label>
                <ol className="list-decimal ml-6 text-white space-y-2">
                  {profile.keywords.map((keyword, index) => (
                    <li key={index} className="flex items-center justify-between">
                      {index+1}. {keyword}
                      {editingMode && (
                        <button
                          className="ml-2 text-red-500"
                          onClick={() => handleRemoveKeyword(index)}
                        >
                          <FaTrash />
                        </button>
                      )}
                    </li>
                  ))}
                </ol>
                {editingMode && (
                  <div className="flex items-center mt-2">
                    <input
                      type="text"
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      className="w-full p-2 border border-gray-600 bg-transparent rounded-md text-white"
                    />
                    <button
                      className="ml-2 text-green-500"
                      onClick={handleAddKeyword}
                    >
                      <FaPlus />
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="flex mb-4 items-center">
              <div className="flex items-center justify-center w-[70px] h-[70px] rounded-[24px] bg-[#323F5D]">
                <MdOutlineWorkOutline className="text-white text-[20px]" />
              </div>
              <div className="flex-1 ml-[30px]">
                <label className="block mb-2 text-white">Companies</label>
                <ol className="list-decimal ml-6 text-white space-y-2">
                  {profile.myCompanies.map((company, index) => (
                    <li key={index} className="flex items-center justify-between">
                      {index+1}. {company}
                      {editingMode && (
                        <button
                          className="ml-2 text-red-500"
                          onClick={() => handleRemoveCompany(index)}
                        >
                          <FaTrash />
                        </button>
                      )}
                    </li>
                  ))}
                </ol>
                {editingMode && availableCompanies.length > 0 && (
                  <div className="flex items-center mt-2">
                    <select
                      value={newCompany}
                      onChange={(e) => setNewCompany(e.target.value)}
                      className="w-full p-2 border border-gray-600 bg-transparent rounded-md text-white"
                    >
                      <option value="" className="text-gray-95">Select a company</option>
                      {availableCompanies.map((company, index) => (
                        <option key={index} value={company} className="text-gray-950">
                          {company}
                        </option>
                      ))}
                    </select>
                    <button
                      className="ml-2 text-green-500"
                      onClick={handleAddCompany}
                    >
                      <FaPlus />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            {editingMode ? (
              <>
                <button
                  onClick={handleUpdateProfile}
                  className="px-4 w-1/2 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  <FaCheck className="inline-block mr-1" />
                  Save
                </button>
                <button
                  onClick={handleDisableEdit}
                  className="px-4 w-1/2 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  <RxCross2 className="inline-block mr-1" />
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={handleEnableEdit}
                className="px-4 w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                <FaCheck className="inline-block mr-1" />
                Edit
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Profile;
