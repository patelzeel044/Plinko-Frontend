"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardStats } from "../../store/Slices/AdminSlice/adminDashboardSlice";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, Wallet, Activity, Dice1 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { stats, loading } = useSelector(s => s.adminDashboard);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  if (loading || !stats) {
    return (
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className="h-32 bg-gray-800 rounded-xl" />
        ))}
      </div>
    );
  }

  const { users, wallets, transactions, plinko } = stats;
  const inrWallet = wallets.currencies.find(c => c.currency === "INR");
  
  // Chart Data
  const userActivityData = [
    { name: 'Active', value: users.active },
    { name: 'Inactive', value: users.inactive }
  ];
  
  const totalBet = plinko.statuses.completed.bet;
  const totalPayout = plinko.statuses.completed.payout;
  const rtp = (totalPayout / totalBet * 100).toFixed(1);
  const rtpData = [
    { name: 'RTP', value: parseFloat(rtp) },
    { name: 'House Edge', value: 100 - parseFloat(rtp) }
  ];

  const COLORS = ['#10b981', '#ef4444', '#3b82f6', '#f59e0b'];

  const PieChartCard = ({ title, children, className }) => (
    <Card className={`border-gray-800 bg-gray-900 ${className}`}>
      <CardHeader>
        <CardTitle className="text-white text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        {children}
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-6 bg-gray-950 min-h-screen text-white">
      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard 
          icon={Users} 
          title="Users" 
          values={[
            `Total: ${users.total}`,
            `Active: ${users.active}`,
            `Inactive: ${users.inactive}`
          ]}
          badge={Object.entries(users.roles).map(([k,v]) => `${k}: ${v}`).join(', ')}
        />

        <StatCard 
          icon={Activity} 
          title="Transactions" 
          values={[
            `Total Deposit: ₹${transactions.types.deposit.statuses.completed.amount}`,
            `Total Withdrawal: ₹${transactions.types.withdrawal.statuses.completed.amount}`,
            `Available Balance: ₹${(inrWallet?.balance + inrWallet?.locked).toFixed(2)}`,
          ]}
        />

        <StatCard 
          icon={Dice1} 
          title="Plinko Rounds" 
          values={[
            `Completed: ${plinko.statuses.completed.count}`,
            `Total Bet: ₹${plinko.statuses.completed.bet.toFixed(2)}`,
            `Total Payout: ₹${plinko.statuses.completed.payout.toFixed(2)}`
          ]}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PieChartCard title="User Activity">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={userActivityData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {userActivityData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#ffffff', border: 'none' }}
                formatter={(value) => [`${value} Users`, '']}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </PieChartCard>

        <PieChartCard title="Return to Player (RTP)">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={rtpData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name }) => `${name}`}
              >
                {rtpData.map((_, index) => (
                  <Cell key={index} fill={COLORS[(index + 1) % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#ffffff', border: 'none' }}
                formatter={(value) => [`${value}%`, '']}
              />
              <Legend 
                payload={[
                  { value: `RTP: ${rtp}%`, type: 'circle', color: COLORS[1] },
                  { value: `House Edge: ${(100 - rtp).toFixed(1)}%`, type: 'circle', color: COLORS[2] }
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </PieChartCard>
      </div>
      {/* Plinko Details */}
            <Card className="border-gray-800 bg-gray-900">
              <CardHeader className="flex items-center gap-2">
                <Dice1 className="w-5 h-5 text-orange-400" />
                <CardTitle className="text-white">Plinko Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 text-white">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Risk Levels</h3>
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="text-white">Risk Level</TableHead>
                        <TableHead className="text-white">Count</TableHead>
                        <TableHead className="text-white">Total Bet</TableHead>
                        <TableHead className="text-white">Total Payout</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.values(plinko.riskLevels).map(risk => (
                        <TableRow key={risk.level} className="hover:bg-gray-800">
                          <TableCell className="text-white">{risk.level}</TableCell>
                          <TableCell className="text-white">{risk.count}</TableCell>
                          <TableCell className="text-white">₹{risk.bet.toFixed(2)}</TableCell>
                          <TableCell className="text-white">₹{risk.payout.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
      
                <div>
                  <h3 className="text-lg font-semibold mb-4">Rows Statistics</h3>
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="text-white">Rows</TableHead>
                        <TableHead className="text-white">Count</TableHead>
                        <TableHead className="text-white">Total Bet</TableHead>
                        <TableHead className="text-white">Total Payout</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.values(plinko.rows).map(row => (
                        <TableRow key={row.rows} className="hover:bg-gray-800">
                          <TableCell className="text-white">{row.rows-2}</TableCell>
                          <TableCell className="text-white">{row.count}</TableCell>
                          <TableCell className="text-white">₹{row.bet.toFixed(2)}</TableCell>
                          <TableCell className="text-white">₹{row.payout.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
      
                {/* <div>
                  <h3 className="text-lg font-semibold mb-4">Row-Risk Combinations</h3>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent">
                          <TableHead className="text-white">Combination</TableHead>
                          <TableHead className="text-white">Count</TableHead>
                          <TableHead className="text-white">Bet</TableHead>
                          <TableHead className="text-white">Payout</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.values(plinko.rowsRisk).map(row => (
                          <TableRow key={row.key} className="hover:bg-gray-800">
                            <TableCell className="font-mono text-white">{row.key}</TableCell>
                            <TableCell className="text-white">{row.count}</TableCell>
                            <TableCell className="text-white">₹{row.bet.toFixed(2)}</TableCell>
                            <TableCell className="text-white">₹{row.payout.toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div> */}
              </CardContent>
            </Card>
    </div>
  );
}

const StatCard = ({ icon: Icon, title, values, badge }) => (
  <Card className="border-gray-800 bg-gray-900 hover:border-gray-700 transition-colors">
    <CardHeader className="flex items-center gap-2 pb-2">
      <Icon className="w-5 h-5 text-white" />
      <CardTitle className="text-2xl text-white">{title}</CardTitle>
    </CardHeader>
    <CardContent className="space-y-1 text-white">
      {values.map((value, i) => (
        <p key={i} className="text-lg">{value}</p>
      ))}
      {badge && <Badge variant="outline" className="mt-2 text-white border-gray-600">{badge}</Badge>}
    </CardContent>
  </Card>
);