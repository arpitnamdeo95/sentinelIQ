import React, { useState, useEffect } from "react";
import { FaUserPlus, FaEnvelope, FaUserShield } from "react-icons/fa";
import { IoPeople, IoShieldCheckmark } from "react-icons/io5";
import axios from "axios";
import Header from "../components/common/Header";
import { Player } from "@lottiefiles/react-lottie-player";

const ContentWithLottie = () => {
  return (
    <div className="flex items-center justify-center mb-8 space-x-8">
      {/* Lottie Animation */}
      <Player
        autoplay
        loop
        src="CustomerSupport.json" // Replace with the actual path to your Lottie JSON file
        className="w-34 h-32"
      />

      {/* Content */}
      <div className="flex flex-col items-center text-center">


        {/* Paragraph */}
        <p className="text-gray-300 text-lg max-w-2xl mt-1">
          The Notify Service uses NodeMailer API, which sends Instantaneous Mail Alert to the concerned Authorities and Residents in the affected Locality.
        </p>
      </div>
    </div>
  );
};


const AddUserModal = ({ userType, setShowModal }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [locality, setLocality] = useState("");

  const handleSubmit = async () => {
    try {
      const user = { name, email, locality };
      const endpoint =
        userType === "resident" ? "/api/residents/add-resident" : "/api/authorities/add-authority";

      const response = await axios.post(`http://localhost:5000${endpoint}`, user);
      if (response.status === 200) {
        alert(`${userType === "resident" ? "Resident" : "Authority"} added successfully!`);
        setShowModal(false);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to add user.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#18181b] border border-white/10 text-white rounded-2xl p-8 w-[400px] shadow-xl">
        <h3 className="text-xl font-bold mb-6 text-center text-white">
          Add {userType === "resident" ? "Resident" : "Authority"} User
        </h3>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-zinc-400">Name</label>
          <input
            type="text"
            className="w-full p-3 border border-zinc-800 rounded-lg bg-zinc-900 text-white focus:outline-none focus:border-indigo-500 transition-colors"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-zinc-400">Email</label>
          <input
            type="email"
            className="w-full p-3 border border-zinc-800 rounded-lg bg-zinc-900 text-white focus:outline-none focus:border-indigo-500 transition-colors"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-zinc-400">Locality</label>
          <input
            type="text"
            className="w-full p-3 border border-zinc-800 rounded-lg bg-zinc-900 text-white focus:outline-none focus:border-indigo-500 transition-colors"
            value={locality}
            onChange={(e) => setLocality(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-4">
          <button
            className="bg-zinc-800 hover:bg-zinc-700 text-white px-5 py-2.5 rounded-lg border border-white/5 transition-all w-full text-sm font-medium"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </button>
          <button
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg shadow-sm transition-all w-full text-sm font-medium"
            onClick={handleSubmit}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

const UserTable = ({ users, userType }) => {
  const isResident = userType === "resident";
  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center gap-3 border-b border-white/5 pb-4">
        <div className={`p-2 rounded-lg ${isResident ? 'bg-indigo-500/10' : 'bg-emerald-500/10'}`}>
          {isResident ? <IoPeople className="w-5 h-5 text-indigo-400" /> : <IoShieldCheckmark className="w-5 h-5 text-emerald-400" />}
        </div>
        <h3 className="text-xl font-semibold text-white tracking-tight">
          {isResident ? "Resident Directory" : "Authority Directory"}
        </h3>
        <span className="ml-auto bg-zinc-800 text-zinc-300 text-xs font-bold px-2.5 py-1 rounded-full">{users.length}</span>
      </div>
      
      {users.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center border border-dashed border-white/5 rounded-xl bg-zinc-900/30">
          <p className="text-zinc-500 text-sm">No {isResident ? "residents" : "authorities"} registered yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user, idx) => (
            <div key={idx} className="bg-[#18181b] p-5 rounded-xl border border-white/5 shadow-sm hover:border-zinc-700 transition-colors group">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${isResident ? 'bg-indigo-900/50 text-indigo-300' : 'bg-emerald-900/50 text-emerald-300'}`}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-base font-medium text-zinc-100 group-hover:text-white transition-colors">{user.name}</h4>
                  <p className="text-zinc-500 text-xs truncate max-w-[150px]">{user.email}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-widest text-zinc-600">Location</span>
                <span className="text-xs font-medium text-zinc-400">{user.locality}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const NotifyPage = () => {
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [userType, setUserType] = useState("");
  const [residentUsers, setResidentUsers] = useState([]);
  const [authorityUsers, setAuthorityUsers] = useState([]);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/residents/get-residents`)
      .then((response) => setResidentUsers(response.data))
      .catch((error) => console.error(error));

    axios
      .get(`${BACKEND_URL}/api/authorities/get-authorities`)
      .then((response) => setAuthorityUsers(response.data))
      .catch((error) => console.error(error));
  }, [BACKEND_URL]);

  const handleAddUserClick = (type) => {
    setUserType(type);
    setShowAddUserModal(true);
  };

  const handleSendEmail = (type) => {
    const endpoint =
      type === "resident" ? "/api/mail/send-resident-alert" : "/api/mail/send-authority-alert";

    axios
      .post(`${BACKEND_URL}${endpoint}`)
      .then((response) => alert(response.data.message))
      .catch(() => alert(`Failed to send email to ${type}s.`));
  };

  return (
    <div className="flex-1 overflow-auto bg-[#0a0a0a] text-zinc-100 min-h-screen relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      <div className="relative z-10">
        <Header title="Notification Hub" />
        <main className="max-w-7xl mx-auto py-8 px-4 lg:px-8 space-y-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lottie & Info Box */}
            <div className="lg:col-span-1 flex flex-col items-center justify-center p-8 bg-[#18181b] border border-white/5 rounded-2xl shadow-sm text-center">
              <Player
                autoplay
                loop
                src="CustomerSupport.json"
                className="w-48 h-48 mb-6"
              />
              <h2 className="text-xl font-bold text-white mb-3">Broadcast Center</h2>
              <p className="text-zinc-400 text-sm leading-relaxed">
                The Notify module interfaces with the NodeMailer API to dispatch instantaneous digital alerts to the concerned Authorities and aligned Residents within the affected zoning grids.
              </p>
            </div>

            {/* Actions Grid */}
            <div className="lg:col-span-2 flex flex-col justify-center gap-6">
              <div className="flex flex-col sm:flex-row gap-6">
                <button
                  className="flex-1 group relative p-6 bg-[#18181b] hover:bg-zinc-900 border border-white/5 hover:border-indigo-500/30 rounded-2xl flex flex-col items-center justify-center gap-4 transition-all overflow-hidden"
                  onClick={() => handleAddUserClick("resident")}
                >
                  <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="p-4 bg-indigo-500/10 rounded-full text-indigo-400 relative z-10">
                    <FaUserPlus className="w-6 h-6" />
                  </div>
                  <span className="font-semibold text-white tracking-wide relative z-10">Onboard Resident</span>
                </button>
                <button
                  className="flex-1 group relative p-6 bg-[#18181b] hover:bg-zinc-900 border border-white/5 hover:border-emerald-500/30 rounded-2xl flex flex-col items-center justify-center gap-4 transition-all overflow-hidden"
                  onClick={() => handleAddUserClick("authority")}
                >
                  <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="p-4 bg-emerald-500/10 rounded-full text-emerald-400 relative z-10">
                    <FaUserShield className="w-6 h-6" />
                  </div>
                  <span className="font-semibold text-white tracking-wide relative z-10">Register Authority</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
            {/* Resident Table Panel */}
            <div className="flex flex-col bg-[#18181b] p-6 rounded-2xl border border-white/5 shadow-sm h-full">
              <UserTable users={residentUsers} userType="resident" />
              <div className="mt-8 pt-6 border-t border-white/5 mt-auto">
                <button
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3.5 rounded-xl shadow-sm transition-all flex justify-center items-center gap-3 font-semibold text-sm"
                  onClick={() => handleSendEmail("resident")}
                >
                  <FaEnvelope className="w-4 h-4" /> Dispatch Resident Broadcast
                </button>
              </div>
            </div>

            {/* Authority Table Panel */}
            <div className="flex flex-col bg-[#18181b] p-6 rounded-2xl border border-white/5 shadow-sm h-full">
              <UserTable users={authorityUsers} userType="authority" />
              <div className="mt-8 pt-6 border-t border-white/5 mt-auto">
                <button
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3.5 rounded-xl shadow-sm transition-all flex justify-center items-center gap-3 font-semibold text-sm"
                  onClick={() => handleSendEmail("authority")}
                >
                  <FaEnvelope className="w-4 h-4" /> Issue Authority Dispatch
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
      {showAddUserModal && <AddUserModal userType={userType} setShowModal={setShowAddUserModal} />}
    </div>
  );
};

export default NotifyPage;
