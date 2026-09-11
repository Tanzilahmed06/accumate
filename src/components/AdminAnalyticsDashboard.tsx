import React, { useState } from 'react';
import {
  Search,
  Download,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import type { AnalyticsStats, AuditLog } from '../types';

interface AdminAnalyticsDashboardProps {
  stats: AnalyticsStats;
  auditLogs: AuditLog[];
  onViewCertificate?: (certNo: string) => void;
}

const MONTHLY_TREND_DATA = [
  { month: 'Apr', applications: 120, approved: 112, revenue: 240000 },
  { month: 'May', applications: 145, approved: 138, revenue: 290000 },
  { month: 'Jun', applications: 160, approved: 152, revenue: 320000 },
  { month: 'Jul', applications: 185, approved: 175, revenue: 370000 },
  { month: 'Aug', applications: 210, approved: 198, revenue: 420000 },
  { month: 'Sep', applications: 240, approved: 228, revenue: 490000 },
];

const CATEGORY_DISTRIBUTION = [
  { name: 'Weighing Scale', count: 420, fill: '#3b82f6' },
  { name: 'Weighbridge', count: 180, fill: '#6366f1' },
  { name: 'Fuel Dispenser', count: 290, fill: '#f59e0b' },
  { name: 'Electricity Meter', count: 350, fill: '#10b981' },
  { name: 'Water Meter', count: 210, fill: '#06b6d4' },
];

const REGIONAL_COMPLIANCE = [
  { state: 'Delhi NCT', compliance: 94.2, instruments: 520 },
  { state: 'Haryana', compliance: 91.8, instruments: 410 },
  { state: 'Uttar Pradesh', compliance: 88.5, instruments: 680 },
  { state: 'Maharashtra', compliance: 95.1, instruments: 790 },
  { state: 'Gujarat', compliance: 93.4, instruments: 620 },
];

const OFFICERS_MONITOR = [
  { id: 'USR-OFFICER-102', name: 'Inspector Vikramaditya Roy', circle: 'Delhi Circle-IV', assigned: 14, completed: 12, passRate: '96%' },
  { id: 'USR-OFFICER-105', name: 'Inspector Kavita Sharma', circle: 'Gurugram Circle-I', assigned: 18, completed: 17, passRate: '94%' },
  { id: 'USR-OFFICER-109', name: 'Inspector Rajesh Varma', circle: 'Noida Circle-II', assigned: 11, completed: 10, passRate: '91%' },
  { id: 'USR-GATC-204', name: 'National Metrology Lab (GATC-089)', circle: 'Central NABL Facility', assigned: 25, completed: 24, passRate: '98%' },
];

export const AdminAnalyticsDashboard: React.FC<AdminAnalyticsDashboardProps> = ({
  stats,
  auditLogs,
}) => {
  const [logSearch, setLogSearch] = useState('');
  const [logRoleFilter, setLogRoleFilter] = useState('ALL');

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.userName.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.details.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.targetId.toLowerCase().includes(logSearch.toLowerCase());
    const matchesRole = logRoleFilter === 'ALL' || log.userRole === logRoleFilter;
    return matchesSearch && matchesRole;
  });

  const pieData = [
    { name: 'Approved (PASS)', value: stats.completedVerifications || 12, fill: '#10b981' },
    { name: 'Pending Review', value: stats.pendingApplications || 4, fill: '#f59e0b' },
    { name: 'Rejected (FAIL)', value: stats.rejectedApplications || 2, fill: '#f43f5e' },
  ];

  return (
    <div className="space-y-6">
      {/* Admin Central Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              CENTRAL EXECUTIVE ANALYTICS & COMPLIANCE MONITOR
            </div>
            <h2 className="text-2xl font-bold font-heading">Controller of Legal Metrology</h2>
            <p className="text-xs text-slate-400 mt-1">
              Ministry of Consumer Affairs, Food & Public Distribution, Government of India
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(stats));
                const downloadAnchor = document.createElement('a');
                downloadAnchor.setAttribute("href", jsonStr);
                downloadAnchor.setAttribute("download", "e_metro_compliance_report.json");
                document.body.appendChild(downloadAnchor);
                downloadAnchor.click();
                downloadAnchor.remove();
              }}
              className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-700 shadow-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Export Compliance Audit Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Overview Strip (8 Stats items) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <AdminMiniKpi label="Total Registered" value={stats.totalInstruments} color="text-slate-900 bg-white" />
        <AdminMiniKpi label="Total Apps" value={stats.totalApplications} color="text-blue-600 bg-white" />
        <AdminMiniKpi label="Pending Review" value={stats.pendingApplications} color="text-amber-600 bg-white" />
        <AdminMiniKpi label="Approved" value={stats.completedVerifications} color="text-emerald-600 bg-white" />
        <AdminMiniKpi label="Rejected" value={stats.rejectedApplications} color="text-rose-600 bg-white" />
        <AdminMiniKpi label="Expiring Soon" value={stats.expiringCertificates} color="text-orange-600 bg-white" />
        <AdminMiniKpi label="Expired Certs" value={stats.expiredCertificates} color="text-red-700 bg-white" />
        <AdminMiniKpi label="Revenue (₹)" value={`₹${stats.totalRevenue}`} color="text-indigo-600 bg-white" fontMono />
      </div>

      {/* Recharts Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Application Volume & Revenue Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm font-heading">Application Volume & Revenue Growth</h3>
              <p className="text-xs text-slate-500">Monthly verification applications & statutory fee collection trend.</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
              +22.4% YoY Growth
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorApp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} style={{ fontSize: '11px', fill: '#64748b' }} />
                <YAxis tickLine={false} axisLine={false} style={{ fontSize: '11px', fill: '#64748b' }} />
                <Tooltip />
                <Area type="monotone" dataKey="applications" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorApp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Verification PASS vs FAIL Pie Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm font-heading">Pass / Fail Ratio</h3>
            <p className="text-xs text-slate-500 font-heading">Field inspection decision outcome distribution.</p>
          </div>

          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-xs border-t border-slate-100 pt-3">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-slate-700 font-medium">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.fill }}></span>
                  <span>{item.name}</span>
                </div>
                <span className="font-bold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Breakdown & State Compliance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category Breakdown Bar Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm font-heading">Instrument Category Distribution</h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CATEGORY_DISTRIBUTION} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} style={{ fontSize: '10px', fill: '#64748b' }} />
                <YAxis tickLine={false} axisLine={false} style={{ fontSize: '10px', fill: '#64748b' }} />
                <Tooltip />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {CATEGORY_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* State Compliance Rates */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm font-heading">Regional Compliance Matrix</h3>
          <div className="space-y-3">
            {REGIONAL_COMPLIANCE.map((st) => (
              <div key={st.state} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-800">
                  <span>{st.state}</span>
                  <span className="text-emerald-600">{st.compliance}% Compliance</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${st.compliance}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Officers & GATC Workload Monitor */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 px-6 py-4 bg-slate-50/50">
          <h3 className="font-bold text-slate-900 text-sm font-heading">Officers & GATC Performance Monitor</h3>
          <p className="text-xs text-slate-500">Track inspector load, throughput, and accuracy ratios.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-100/70 text-slate-700 font-semibold border-b border-slate-200 uppercase text-[11px] tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Officer / Facility Name</th>
                <th className="px-6 py-3.5">Circle Jurisdiction</th>
                <th className="px-6 py-3.5">Assigned Apps</th>
                <th className="px-6 py-3.5">Completed</th>
                <th className="px-6 py-3.5 text-right">Pass Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {OFFICERS_MONITOR.map((off) => (
                <tr key={off.id} className="hover:bg-slate-50/80">
                  <td className="px-6 py-3.5 font-bold text-slate-900">{off.name}</td>
                  <td className="px-6 py-3.5 text-slate-600">{off.circle}</td>
                  <td className="px-6 py-3.5 font-semibold text-slate-800">{off.assigned}</td>
                  <td className="px-6 py-3.5 font-semibold text-emerald-700">{off.completed}</td>
                  <td className="px-6 py-3.5 text-right font-extrabold text-blue-700 font-mono">{off.passRate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Trail Logs */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
          <div>
            <h3 className="font-bold text-slate-900 text-sm font-heading">System Security & Audit Trail</h3>
            <p className="text-xs text-slate-500">Immutable digital record of every transaction, certificate, and login.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search audit action, user, ID..."
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
                className="pl-9 pr-4 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 w-48 sm:w-64"
              />
            </div>
            <select
              value={logRoleFilter}
              onChange={(e) => setLogRoleFilter(e.target.value)}
              className="py-1.5 px-3 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 cursor-pointer"
            >
              <option value="ALL">All Roles</option>
              <option value="trader">Trader</option>
              <option value="officer">Officer</option>
              <option value="gatc">GATC</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-100/70 text-slate-700 font-semibold border-b border-slate-200 uppercase text-[11px] tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Timestamp</th>
                <th className="px-6 py-3.5">User & Role</th>
                <th className="px-6 py-3.5">Action Event</th>
                <th className="px-6 py-3.5">Target ID</th>
                <th className="px-6 py-3.5">Audit Log Details</th>
                <th className="px-6 py-3.5 text-right">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80">
                  <td className="px-6 py-3 text-slate-500">{log.timestamp}</td>
                  <td className="px-6 py-3 font-semibold text-slate-900 font-sans">
                    {log.userName}
                    <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded bg-slate-100 border text-slate-600 uppercase font-mono">
                      {log.userRole}
                    </span>
                  </td>
                  <td className="px-6 py-3 font-bold text-blue-700">{log.action}</td>
                  <td className="px-6 py-3 font-bold text-amber-600">{log.targetId}</td>
                  <td className="px-6 py-3 text-slate-700 font-sans">{log.details}</td>
                  <td className="px-6 py-3 text-right text-slate-400">{log.ipAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const AdminMiniKpi: React.FC<{ label: string; value: number | string; color: string; fontMono?: boolean }> = ({
  label,
  value,
  color,
  fontMono,
}) => (
  <div className={`p-3 rounded-2xl border border-slate-200 shadow-xs text-center ${color}`}>
    <div className="text-[10px] font-semibold text-slate-500 truncate">{label}</div>
    <div className={`text-lg font-extrabold font-heading mt-0.5 ${fontMono ? 'font-mono' : ''}`}>{value}</div>
  </div>
);
