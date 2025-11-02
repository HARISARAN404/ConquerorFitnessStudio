import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, CheckCircle, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Checkbox } from '../components/ui/checkbox';
import { getMembers, saveAttendance, getAttendanceRecords } from '../mock';
import { useToast } from '../hooks/use-toast';

const Attendance = () => {
  const [members, setMembers] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [lastSavedDate, setLastSavedDate] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const data = getMembers();
    setMembers(data);
    
    // Load existing attendance for today
    const records = getAttendanceRecords();
    if (records[selectedDate]) {
      setAttendance(records[selectedDate]);
    }
    
    // Get last saved date
    const dates = Object.keys(records).sort().reverse();
    if (dates.length > 0) {
      setLastSavedDate(dates[0]);
    }
  }, [selectedDate]);

  const handleAttendanceToggle = (memberId) => {
    setAttendance(prev => ({
      ...prev,
      [memberId]: !prev[memberId]
    }));
  };

  const handleSaveAttendance = () => {
    saveAttendance(selectedDate, attendance);
    setLastSavedDate(selectedDate);
    toast({
      title: 'Attendance Saved',
      description: `Attendance for ${formatDate(selectedDate)} has been saved successfully.`,
      duration: 3000
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const presentCount = Object.values(attendance).filter(Boolean).length;
  const absentCount = members.length - presentCount;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-800/20 border-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Members</CardTitle>
            <CalendarIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{members.length}</div>
          </CardContent>
        </Card>

        <Card className="shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-800/20 border-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Present Today</CardTitle>
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">{presentCount}</div>
          </CardContent>
        </Card>

        <Card className="shadow-lg bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-800/20 border-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Absent Today</CardTitle>
            <CalendarIcon className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{absentCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-2xl">Daily Attendance</CardTitle>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Mark attendance for {formatDate(selectedDate)}</p>
              {lastSavedDate && (
                <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                  Last saved: {formatDate(lastSavedDate)}
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
              />
              <Button
                onClick={handleSaveAttendance}
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white transition-all duration-300"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Attendance
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center space-x-4">
                  <Checkbox
                    id={member.id}
                    checked={attendance[member.id] || false}
                    onCheckedChange={() => handleAttendanceToggle(member.id)}
                    className="h-5 w-5"
                  />
                  <label
                    htmlFor={member.id}
                    className="cursor-pointer flex-1"
                  >
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{member.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">ID: {member.id} | {member.plan}</p>
                    </div>
                  </label>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  attendance[member.id]
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                }`}>
                  {attendance[member.id] ? 'Present' : 'Absent'}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Attendance;
