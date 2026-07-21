import React, { useState, useEffect } from 'react';
import { 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  Database, 
  Search, 
  Calendar, 
  Clock, 
  AlertTriangle 
} from 'lucide-react';
import { AuditLog } from '../types';

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/audit-logs');
      if (!response.ok) {
        throw new Error(`Chyba při komunikaci se serverem: ${response.status}`);
      }
      const data = await response.json();
      setLogs(data);
    } catch (err: any) {
      console.error('Failed to fetch audit logs:', err);
      setError(err.message || 'Nepodařilo se načíst kontrolní protokoly.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(log => {
    const query = searchQuery.toLowerCase();
    return (
      log.action.toLowerCase().includes(query) ||
      log.details.toLowerCase().includes(query) ||
      (log.errorMessage && log.errorMessage.toLowerCase().includes(query))
    );
  });

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('cs-CZ', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  const formatTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString('cs-CZ', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="space-y-6" id="admin-audit-logs">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-[#EBE7E0]/60 shadow-3xs">
        <div>
          <h2 className="text-lg font-bold text-slate-850 font-display flex items-center gap-2">
            <Database className="w-5 h-5 text-rose-500" />
            Kontrolní protokol (Audit Log)
          </h2>
          <p className="text-xs text-slate-500 font-sans mt-1">
            Záznamy o úspěšných i neúspěšných zápisech do databáze v reálném čase.
          </p>
        </div>
        <button
          onClick={fetchLogs}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white font-bold rounded-xl text-xs transition-colors shadow-3xs cursor-pointer select-none"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Obnovit logy
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-3xs flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Vyhledat v protokolech (akce, detaily, chyby)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-rose-500 focus:bg-white transition-colors"
          />
        </div>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 shrink-0 cursor-pointer"
          >
            Zrušit filtr
          </button>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
          <div>
            <h4 className="text-xs font-bold font-sans">Nepodařilo se načíst kontrolní protokoly</h4>
            <p className="text-[11px] text-red-600 mt-1 font-mono">{error}</p>
          </div>
        </div>
      )}

      {/* Table & List View */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-3xs overflow-hidden">
        {loading && logs.length === 0 ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-8 h-8 animate-spin text-rose-500" />
            <p className="text-xs font-medium font-sans">Načítám kontrolní logy ze serveru...</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-slate-400 font-sans">
            <Database className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="text-xs font-medium">Nebyly nalezeny žádné záznamy v kontrolním protokolu.</p>
            {searchQuery && <p className="text-[11px] text-slate-400 mt-1">Zkuste upravit nebo vymazat filtr vyhledávání.</p>}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] uppercase tracking-wider font-bold text-slate-400 font-mono">
                  <th className="py-3.5 px-4 font-semibold">Čas / Datum</th>
                  <th className="py-3.5 px-4 font-semibold">Akce / Operace</th>
                  <th className="py-3.5 px-4 font-semibold">Stav</th>
                  <th className="py-3.5 px-4 font-semibold">Detaily</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-sans">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4 font-sans whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {formatDate(log.timestamp)}
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400 text-[10px] mt-0.5">
                        <Clock className="w-3.5 h-3.5" />
                        {formatTime(log.timestamp)}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">
                      {log.action}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {log.status === 'SUCCESS' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                          <CheckCircle2 className="w-3 h-3" />
                          Zapsáno
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200/50">
                          <XCircle className="w-3 h-3" />
                          Chyba / Nezapsáno
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 max-w-md">
                      <p className="text-slate-600 font-medium leading-relaxed">{log.details}</p>
                      {log.errorMessage && (
                        <div className="mt-1.5 p-2 bg-red-50/70 border border-red-100 rounded-lg text-[10px] font-mono text-red-600 leading-normal break-all">
                          <strong>Chyba:</strong> {log.errorMessage}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
