import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { getMembers, updateMemberPayment } from '../mock';
import { useToast } from '../hooks/use-toast';

const DueUpdates = () => {
  const [members, setMembers] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = () => {
    const data = getMembers();
    setMembers(data);
  };

  const handlePaymentUpdate = (memberId, status) => {
    updateMemberPayment(memberId, status);
    loadMembers();
    toast({
      title: 'Payment Updated',
      description: `Payment status has been marked as ${status}.`,
      duration: 3000
    });
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

  const overdueMembers = members.filter(m => m.paymentStatus === 'overdue').length;
  const paidMembers = members.filter(m => m.paymentStatus === 'paid').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-800/20 border-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Paid Members</CardTitle>
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">{paidMembers}</div>
          </CardContent>
        </Card>

        <Card className="shadow-lg bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-800/20 border-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Overdue Payments</CardTitle>
            <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600 dark:text-red-400">{overdueMembers}</div>
          </CardContent>
        </Card>

        <Card className="shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-800/20 border-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Members</CardTitle>
            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{members.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Payment Status</CardTitle>
          <p className="text-gray-600 dark:text-gray-400">Manage member payments and due dates</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                  <th className="text-left py-4 px-4 font-semibold text-gray-700 dark:text-gray-300">Member ID</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700 dark:text-gray-300">Name</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700 dark:text-gray-300">Plan</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700 dark:text-gray-300">Due Date</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700 dark:text-gray-300">Status</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700 dark:text-gray-300">Action</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => {
                  const daysUntilDue = getDaysUntilDue(member.dueDate);
                  const isOverdue = daysUntilDue < 0;
                  
                  return (
                    <tr 
                      key={member.id} 
                      className={`border-b border-gray-200 dark:border-gray-700 transition-colors duration-200 ${
                        isOverdue ? 'bg-red-50 dark:bg-red-900/10' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      <td className="py-4 px-4 text-gray-900 dark:text-white font-medium">{member.id}</td>
                      <td className="py-4 px-4 text-gray-900 dark:text-white">{member.name}</td>
                      <td className="py-4 px-4 text-gray-700 dark:text-gray-300">{member.plan}</td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="text-gray-900 dark:text-white">{formatDate(member.dueDate)}</p>
                          {daysUntilDue > 0 && daysUntilDue <= 7 && (
                            <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                              {daysUntilDue} days left
                            </p>
                          )}
                          {isOverdue && (
                            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                              {Math.abs(daysUntilDue)} days overdue
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          member.paymentStatus === 'paid'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {member.paymentStatus === 'paid' ? (
                            <><CheckCircle className="h-4 w-4 mr-1" /> Paid</>
                          ) : (
                            <><XCircle className="h-4 w-4 mr-1" /> Overdue</>
                          )}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        {member.paymentStatus === 'overdue' ? (
                          <Button
                            size="sm"
                            onClick={() => handlePaymentUpdate(member.id, 'paid')}
                            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transition-all duration-300"
                          >
                            Mark as Paid
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handlePaymentUpdate(member.id, 'overdue')}
                            className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20 transition-all duration-300"
                          >
                            Mark as Overdue
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DueUpdates;
