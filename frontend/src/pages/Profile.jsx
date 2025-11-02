import React, { useState, useEffect } from 'react';
import { Search, User, Phone, Calendar, CreditCard, Mail, Filter, Grid } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { getMembers } from '../mock';

const Profile = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [allMembers, setAllMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [cardsPerRow, setCardsPerRow] = useState(3);
  const [filter, setFilter] = useState({ gender: 'all', payment: 'all' });

  useEffect(() => {
    const members = getMembers();
    setAllMembers(members);
    setFilteredMembers(members);
  }, []);

  const handleSearch = () => {
    const results = allMembers.filter(m =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredMembers(results);
  };

  const handleFilter = (type, value) => {
    const newFilter = { ...filter, [type]: value };
    setFilter(newFilter);

    let filtered = [...allMembers];

    if (newFilter.gender !== 'all') {
      filtered = filtered.filter(m => m.gender === newFilter.gender);
    }
    if (newFilter.payment !== 'all') {
      filtered = filtered.filter(m => m.paymentStatus === newFilter.payment);
    }

    setFilteredMembers(filtered);
  };

  const handleCardsPerRow = (num) => setCardsPerRow(num);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* 🔍 Search Bar */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Member Profiles</CardTitle>
          <p className="text-gray-600 dark:text-gray-400">
            View all members or search by name / ID
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-3 items-center">
            <div className="relative flex-1 w-full">
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

            {/* ⚙️ Filter Dropdown */}
            <div className="flex items-center gap-2">
              <Filter className="text-gray-500" />
              <select
                onChange={(e) => handleFilter('gender', e.target.value)}
                className="border border-gray-300 dark:border-gray-700 rounded-lg p-2 bg-transparent"
              >
                <option value="all">All Genders</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              <select
                onChange={(e) => handleFilter('payment', e.target.value)}
                className="border border-gray-300 dark:border-gray-700 rounded-lg p-2 bg-transparent"
              >
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>

            {/* 🧩 Cards per Row */}
            <div className="flex items-center gap-2">
              <Grid className="text-gray-500" />
              <select
                onChange={(e) => handleCardsPerRow(Number(e.target.value))}
                className="border border-gray-300 dark:border-gray-700 rounded-lg p-2 bg-transparent"
              >
                <option value={2}>2 / row</option>
                <option value={3}>3 / row</option>
                <option value={4}>4 / row</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 👥 Member Cards Grid */}
      <div
        className={`grid gap-6`}
        style={{
          gridTemplateColumns: `repeat(${cardsPerRow}, minmax(0, 1fr))`,
        }}
      >
        {filteredMembers.length > 0 ? (
          filteredMembers.map((member) => (
            <Card
              key={member.id}
              className="shadow-xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300"
            >
              <CardHeader className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-t-lg p-4">
                <div className="flex items-center space-x-4">
                  {member.photo ? (
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-white"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                      <User className="h-8 w-8 text-white" />
                    </div>
                  )}
                  <div>
                    <CardTitle className="text-xl">{member.name}</CardTitle>
                    <p className="text-orange-100 text-sm">ID: {member.id}</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-5 space-y-3">
                {member.email && (
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    <p className="text-sm text-gray-700 dark:text-gray-300">{member.email}</p>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  <p className="text-sm text-gray-700 dark:text-gray-300">{member.contact}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <CreditCard className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{member.plan}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Joined: {formatDate(member.joinDate)}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      member.paymentStatus === 'paid'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}
                  >
                    {member.paymentStatus === 'paid' ? 'Paid' : 'Overdue'}
                  </span>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    ₹{member.fees.toLocaleString('en-IN')}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-600 dark:text-gray-400">
            No members found.
          </p>
        )}
      </div>
    </div>
  );
};

export default Profile;
