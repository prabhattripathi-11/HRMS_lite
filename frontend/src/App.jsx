/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  UserPlus, 
  Users, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  LayoutDashboard, 
  Clock,
  Hash // Fixed: Hash icon added here
} from 'lucide-react';

// NOTE: Change this to your Render URL after deployment

const API_URL = "https://hrms-backend-prabhat.onrender.com/api";

function App() {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({ 
    empId: '', 
    name: '', 
    email: '', 
    department: '' 
  });
  const [loading, setLoading] = useState(false);

  // Load employees from database
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/employees`);
      setEmployees(res.data);
    } catch (err) {
      console.error("Connection Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Register new employee
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/employees`, formData);
      alert("Success: Employee has been registered successfully!");
      setFormData({ empId: '', name: '', email: '', department: '' });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Error: Database rejected the entry. Check if ID is unique.");
    }
  };

  // Update attendance status
  const markAttendance = async (id, status) => {
    try {
      await axios.post(`${API_URL}/attendance`, {
        employeeId: id,
        date: new Date().toLocaleDateString(),
        status: status
      });
      alert(`Success: Attendance marked as ${status}`);
    } catch (err) {
      alert("Error: Failed to update attendance record.");
    }
  };

  // Remove employee record
  const deleteEmployee = async (id) => {
    if (window.confirm("Are you sure you want to permanently remove this record?")) {
      try {
        await axios.delete(`${API_URL}/employees/${id}`);
        fetchData();
      } catch (err) {
        alert("Error: Operation failed.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg shadow-md shadow-indigo-200">
            <LayoutDashboard size={24} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800">
            HRMS<span className="text-indigo-600">Lite</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2 text-slate-500 text-sm font-semibold bg-slate-100 px-4 py-2 rounded-xl">
            <Clock size={16} />
            {new Date().toDateString()}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-8">
        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 transition-transform hover:scale-[1.02]">
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Workforce</p>
            <h2 className="text-3xl font-extrabold text-slate-800 mt-2">{employees.length}</h2>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Connectivity</p>
            <div className="flex items-center gap-2 mt-3">
              <span className="h-2.5 w-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="font-bold text-emerald-600 text-sm">LIVE DATABASE</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Session</p>
            <h2 className="text-lg font-bold text-slate-700 mt-2">Admin Dashboard</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Registration Section */}
          <div className="lg:col-span-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-28">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-800 border-b border-slate-50 pb-4">
                <UserPlus size={20} className="text-indigo-600" /> Registration
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter ml-1">Employee ID</label>
                  <input className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-300" 
                    placeholder="EMP-100" value={formData.empId} onChange={e => setFormData({...formData, empId: e.target.value})} required />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter ml-1">Full Name</label>
                  <input className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-300" 
                    placeholder="Enter full name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter ml-1">Official Email</label>
                  <input type="email" className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-300" 
                    placeholder="office@company.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter ml-1">Department</label>
                  <select className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all cursor-pointer"
                    value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} required>
                    <option value="">Select Category</option>
                    <option value="Development">Development</option>
                    <option value="Management">Management</option>
                    <option value="Design">UI/UX Design</option>
                    <option value="HR">Human Resources</option>
                  </select>
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 mt-2">
                  Confirm Data
                </button>
              </form>
            </div>
          </div>

          {/* Records Section */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-50 flex justify-between items-center bg-white">
                <h3 className="font-bold text-slate-800 flex items-center gap-2 uppercase text-sm tracking-wide">
                  <Users size={18} className="text-indigo-600"/> Employee Directory
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black tracking-widest">
                    <tr>
                      <th className="px-6 py-4">Profile</th>
                      <th className="px-6 py-4">Department</th>
                      <th className="px-6 py-4 text-center">Attendance Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {employees && employees.length > 0 ? employees.map(emp => (
                      <tr key={emp._id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-800">{emp.name}</div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-1 font-bold mt-0.5">
                            <Hash size={10} className="text-indigo-400" /> {emp.empId}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-md text-[11px] font-black uppercase">
                            {emp.department}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center gap-3">
                            <button 
                              onClick={() => markAttendance(emp._id, 'Present')}
                              className="p-2 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all border border-emerald-100"
                            >
                              <CheckCircle size={18}/>
                            </button>
                            <button 
                              onClick={() => markAttendance(emp._id, 'Absent')}
                              className="p-2 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all border border-rose-100"
                            >
                              <XCircle size={18}/>
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => deleteEmployee(emp._id)}
                            className="p-2 text-slate-200 hover:text-rose-600 transition-all rounded-lg hover:bg-rose-50"
                          >
                            <Trash2 size={20}/>
                          </button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="4" className="px-6 py-24 text-center">
                          <div className="flex flex-col items-center gap-2">
                            <Users size={40} className="text-slate-100" />
                            <p className="text-slate-400 font-semibold text-sm italic">Database is currently empty. Please register an employee.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;