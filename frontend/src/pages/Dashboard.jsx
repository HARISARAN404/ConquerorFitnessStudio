import React, { useState, useEffect } from 'react';
import { Users, DollarSign, TrendingUp, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { getMembers } from '../mock';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalMembers: 0,
    activePlans: 0,
    overduePayments: 0,
    revenueThisMonth: 0
  });

  useEffect(() => {
    const members = getMembers();
    const totalMembers = members.length;
    const activePlans = members.filter(m => m.paymentStatus === 'paid').length;
    const overduePayments = members.filter(m => m.paymentStatus === 'overdue').length;
    const revenueThisMonth = members
      .filter(m => {
        const paymentDate = new Date(m.lastPayment);
        const currentDate = new Date();
        return paymentDate.getMonth() === currentDate.getMonth() && 
               paymentDate.getFullYear() === currentDate.getFullYear();
      })
      .reduce((sum, m) => sum + m.fees, 0);

    setStats({
      totalMembers,
      activePlans,
      overduePayments,
      revenueThisMonth
    });
  }, []);

  const statCards = [
    {
      title: 'Total Members',
      value: stats.totalMembers,
      icon: Users,
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20'
    },
    {
      title: 'Active Plans',
      value: stats.activePlans,
      icon: TrendingUp,
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20'
    },
    {
      title: 'Overdue Payments',
      value: stats.overduePayments,
      icon: DollarSign,
      gradient: 'from-red-500 to-red-600',
      bgGradient: 'from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20'
    },
    {
      title: 'Revenue This Month',
      value: `₹${stats.revenueThisMonth.toLocaleString('en-IN')}`,
      icon: Calendar,
      gradient: 'from-orange-500 to-red-600',
      bgGradient: 'from-orange-50 to-red-100 dark:from-orange-900/20 dark:to-red-800/20'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-8 shadow-xl">
        <h2 className="text-3xl font-bold text-white mb-2">Welcome to Conqueror Fitness Studio</h2>
        <p className="text-orange-100 text-lg">Manage your gym operations efficiently from this dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card 
              key={index} 
              className={`bg-gradient-to-br ${stat.bgGradient} border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {stat.title}
                </CardTitle>
                <div className={`bg-gradient-to-br ${stat.gradient} p-2 rounded-lg`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a href="/add-member" className="block">
              <div className="p-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/10 dark:to-red-900/10 rounded-xl border border-orange-200 dark:border-orange-800 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <Users className="h-8 w-8 text-orange-600 dark:text-orange-400 mb-3" />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Add New Member</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Register a new gym member</p>
              </div>
            </a>
            <a href="/attendance" className="block">
              <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-xl border border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <Calendar className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-3" />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Mark Attendance</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Record today's attendance</p>
              </div>
            </a>
            <a href="/due-updates" className="block">
              <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-xl border border-green-200 dark:border-green-800 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <DollarSign className="h-8 w-8 text-green-600 dark:text-green-400 mb-3" />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Update Payments</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Manage payment status</p>
              </div>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
