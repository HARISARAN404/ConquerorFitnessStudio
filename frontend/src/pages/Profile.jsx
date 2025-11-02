import React, { useState } from 'react';
import { Search, User, Phone, Calendar, CreditCard, CheckCircle, XCircle, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { getMembers } from '../mock';

const Profile = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = () => {
    const members = getMembers();
    const results = members.filter(m =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(results);
    if (results.length === 1) {
      setSelectedMember(results[0]);
    } else {
      setSelectedMember(null);
    }
  };

  const selectMember = (member) => {
    setSelectedMember(member);
    setSearchResults([]);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Individual Profile</CardTitle>
          <p className="text-gray-600 dark:text-gray-400">Search for a member by name or ID</p>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Enter member name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10 h-12 text-lg"
              />
            </div>
            <Button
              onClick={handleSearch}
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-8 h-12 transition-all duration-300"
            >
              Search
            </Button>
          </div>

          {/* Search Results Dropdown */}
          {searchResults.length > 1 && (
            <div className="mt-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {searchResults.map((member) => (
                <div
                  key={member.id}
                  onClick={() => selectMember(member)}
                  className="p-4 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-200 dark:border-gray-700 last:border-b-0 transition-colors duration-200"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{member.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">ID: {member.id}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      member.paymentStatus === 'paid'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {member.paymentStatus === 'paid' ? 'Active' : 'Overdue'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Member Profile Card */}
      {selectedMember && (
        <Card className="shadow-xl border-2 border-orange-200 dark:border-orange-800 animate-in fade-in duration-500">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-t-lg">
            <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
              {/* 🖼️ Photo as a rectangular card */}
              {selectedMember.photo ? (
                <div className="bg-white rounded-xl overflow-hidden shadow-lg w-full md:w-64 h-64">
                  <img
                    src={selectedMember.photo}
                    alt={selectedMember.name}
                    className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                  />
                </div>
              ) : (
                <div className="bg-white/20 backdrop-blur-sm p-6 rounded-xl flex items-center justify-center w-full md:w-64 h-64">
                  <User className="h-24 w-24 text-white" />
                </div>
              )}

              <div className="mt-4 md:mt-0">
                <CardTitle className="text-3xl">{selectedMember.name}</CardTitle>
                <p className="text-orange-100 text-lg mt-1">Member ID: {selectedMember.id}</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <User className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Age</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedMember.age} years</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Contact</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedMember.contact}</p>
                  </div>
                </div>

                {/* ✅ Email Section */}
                {selectedMember.email && (
                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedMember.email}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start space-x-3">
                  <CreditCard className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Plan</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedMember.plan}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Joining Date</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatDate(selectedMember.joinDate)}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Due Date</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatDate(selectedMember.dueDate)}</p>
                    {getDaysUntilDue(selectedMember.dueDate) > 0 ? (
                      <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                        {getDaysUntilDue(selectedMember.dueDate)} days remaining
                      </p>
                    ) : (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                        {Math.abs(getDaysUntilDue(selectedMember.dueDate))} days overdue
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  {selectedMember.paymentStatus === 'paid' ? (
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-1" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-1" />
                  )}
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Payment Status</p>
                    <p className={`text-lg font-semibold ${
                      selectedMember.paymentStatus === 'paid'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {selectedMember.paymentStatus === 'paid' ? 'Paid' : 'Overdue'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Membership Fees</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{selectedMember.fees.toLocaleString('en-IN')}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Last Payment: {formatDate(selectedMember.lastPayment)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {searchResults.length === 0 && searchQuery && (
        <Card className="shadow-lg">
          <CardContent className="py-12 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-lg">No members found matching "{searchQuery}"</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Profile;
