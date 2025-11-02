import React, { useState, useEffect } from 'react';
import { Users, DollarSign, TrendingUp, Calendar, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { getMembers, getAttendanceRecords } from '../mock';

const MonthlyReport = () => {
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    totalRevenue: 0,
    overdueAmount: 0,
    planDistribution: {},
    attendanceRate: 0
  });

  useEffect(() => {
    calculateStats();
  }, []);

  const calculateStats = () => {
    const members = getMembers();
    const attendanceRecords = getAttendanceRecords();

    const totalMembers = members.length;
    const activeMembers = members.filter(m => m.paymentStatus === 'paid').length;
    const totalRevenue = members.reduce((sum, m) => sum + m.fees, 0);
    const overdueAmount = members
      .filter(m => m.paymentStatus === 'overdue')
      .reduce((sum, m) => sum + m.fees, 0);

    // Plan distribution
    const planDistribution = {};
    members.forEach(m => {
      if (!planDistribution[m.plan]) {
        planDistribution[m.plan] = 0;
      }
      planDistribution[m.plan]++;
    });

    // Attendance rate (last 30 days)
    const attendanceRate = calculateAttendanceRate(members, attendanceRecords);

    setStats({
      totalMembers,
      activeMembers,
      totalRevenue,
      overdueAmount,
      planDistribution,
      attendanceRate
    });
  };

  const calculateAttendanceRate = (members, records) => {
    if (Object.keys(records).length === 0) return 0;
    
    const totalDays = Object.keys(records).length;
    const totalPossibleAttendance = members.length * totalDays;
    
    let totalPresent = 0;
    Object.values(records).forEach(dayRecord => {
      totalPresent += Object.values(dayRecord).filter(Boolean).length;
    });

    return totalPossibleAttendance > 0 
      ? Math.round((totalPresent / totalPossibleAttendance) * 100) 
      : 0;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Card className="shadow-lg bg-gradient-to-r from-orange-500 to-red-600 text-white border-0">
        <CardHeader>
          <CardTitle className="text-3xl">Monthly Report</CardTitle>
          <p className="text-orange-100 text-lg">Comprehensive overview of gym operations</p>
        </CardHeader>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-800/20 border-0 hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Members</CardTitle>
            <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.totalMembers}</div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {stats.activeMembers} active members
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-800/20 border-0 hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Revenue</CardTitle>
            <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              ₹{stats.totalRevenue.toLocaleString('en-IN')}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">From all memberships</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-800/20 border-0 hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Overdue Amount</CardTitle>
            <TrendingUp className="h-5 w-5 text-red-600 dark:text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600 dark:text-red-400">
              ₹{stats.overdueAmount.toLocaleString('en-IN')}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Pending payments</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-800/20 border-0 hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Attendance Rate</CardTitle>
            <Activity className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.attendanceRate}%</div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Overall attendance</p>
          </CardContent>
        </Card>
      </div>

      {/* Plan Distribution */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Membership Plan Distribution</CardTitle>
          <p className="text-gray-600 dark:text-gray-400">Breakdown of members by plan type</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(stats.planDistribution).map(([plan, count]) => {
              const percentage = stats.totalMembers > 0 ? (count / stats.totalMembers) * 100 : 0;
              return (
                <div key={plan} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900 dark:text-white">{plan}</span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {count} members ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-orange-500 to-red-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Financial Summary */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Financial Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-lg p-6 border border-green-200 dark:border-green-800">
              <Calendar className="h-8 w-8 text-green-600 dark:text-green-400 mb-3" />
              <h4 className="text-sm text-gray-600 dark:text-gray-400 mb-1">Collected Revenue</h4>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                ₹{(stats.totalRevenue - stats.overdueAmount).toLocaleString('en-IN')}
              </p>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/10 dark:to-orange-900/10 rounded-lg p-6 border border-red-200 dark:border-red-800">
              <DollarSign className="h-8 w-8 text-red-600 dark:text-red-400 mb-3" />
              <h4 className="text-sm text-gray-600 dark:text-gray-400 mb-1">Pending Collection</h4>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                ₹{stats.overdueAmount.toLocaleString('en-IN')}
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
              <TrendingUp className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-3" />
              <h4 className="text-sm text-gray-600 dark:text-gray-400 mb-1">Collection Rate</h4>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {stats.totalRevenue > 0 
                  ? ((stats.totalRevenue - stats.overdueAmount) / stats.totalRevenue * 100).toFixed(1)
                  : 0}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MonthlyReport;
