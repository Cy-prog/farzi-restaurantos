import React, { useState, useEffect } from 'react';
import { CalendarCheck, Clock, Users, Phone, Mail, Check, X, Table, Search, RefreshCw } from 'lucide-react';
import { Reservation, ReservationStatus } from '../../types';
import { api } from '../../services/api';
import { StatusBadge } from '../../components/ui/Badge';

export const AdminReservationsPage: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadReservations = async () => {
    try {
      const data = await api.getAdminReservations();
      setReservations(data);
    } catch (err) {
      console.error('Failed to load reservations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const handleUpdate = async (id: number, status: ReservationStatus, tableNumber?: string) => {
    try {
      await api.updateReservationStatus(id, status, tableNumber);
      loadReservations();
    } catch (err) {
      alert('Failed to update reservation. Please verify backend connection.');
      console.error('Failed to update reservation:', err);
    }
  };

  const filtered = reservations.filter(r => {
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        r.name.toLowerCase().includes(q) ||
        r.phone.includes(q) ||
        r.email.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="p-6 sm:p-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-charcoal-800">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400 font-semibold">
            Concierge Desk
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-ivory-50 mt-0.5">
            Table Reservations Management
          </h1>
        </div>

        <button
          onClick={loadReservations}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-charcoal-900 border border-charcoal-700 text-xs text-ivory-300 hover:text-white"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Bookings</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-500" />
          <input
            type="text"
            placeholder="Search by guest name or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-charcoal-900 border border-charcoal-800 text-xs text-ivory-100 placeholder-charcoal-500 focus:outline-none focus:border-gold-500/50"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto scrollbar-none pb-1">
          {['ALL', 'PENDING', 'CONFIRMED', 'SEATED', 'COMPLETED', 'REJECTED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all ${
                statusFilter === st
                  ? 'bg-gold-500 text-charcoal-950 font-bold'
                  : 'bg-charcoal-900 text-ivory-300 border border-charcoal-800 hover:bg-charcoal-800'
              }`}
            >
              {st} ({reservations.filter(r => st === 'ALL' || r.status === st).length})
            </button>
          ))}
        </div>
      </div>

      {/* Reservations List */}
      {isLoading ? (
        <div className="p-12 text-center text-charcoal-400 font-mono text-xs">
          Loading reservations...
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-16 text-center bg-charcoal-900 border border-charcoal-800 rounded-2xl text-charcoal-400">
          <CalendarCheck className="w-12 h-12 mx-auto mb-3 text-charcoal-600" />
          <p className="text-sm font-serif text-ivory-300">No reservations matching this query.</p>
        </div>
      ) : (
        <div className="bg-charcoal-900 border border-charcoal-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-charcoal-950 text-charcoal-400 uppercase font-mono tracking-wider border-b border-charcoal-800">
                <tr>
                  <th className="p-4">Guest Info</th>
                  <th className="p-4">Date & Time</th>
                  <th className="p-4">Party Size</th>
                  <th className="p-4">Table Station</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Special Requests</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-800/80">
                {filtered.map((res) => (
                  <tr key={res.id} className="hover:bg-charcoal-850/50 transition-colors">
                    {/* Guest */}
                    <td className="p-4">
                      <div>
                        <p className="font-semibold text-ivory-100 text-sm">{res.name}</p>
                        <div className="flex items-center gap-2 text-charcoal-400 text-[11px] mt-0.5">
                          <span className="flex items-center gap-1 font-mono">
                            <Phone className="w-3 h-3 text-gold-400" />
                            {res.phone}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Date/Time */}
                    <td className="p-4 font-mono">
                      <p className="text-ivory-200">{res.reservationDate}</p>
                      <p className="text-gold-400 text-[11px] flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {res.reservationTime}
                      </p>
                    </td>

                    {/* Guests */}
                    <td className="p-4 font-mono font-bold text-ivory-100">
                      {res.guests} Guests
                    </td>

                    {/* Table Assignment */}
                    <td className="p-4">
                      <select
                        value={res.tableNumber || ''}
                        onChange={(e) => handleUpdate(res.id, res.status, e.target.value)}
                        className="px-2 py-1 rounded bg-charcoal-800 border border-charcoal-700 text-xs font-mono text-gold-300 focus:outline-none focus:border-gold-500/50"
                      >
                        <option value="">Unassigned</option>
                        {['T01', 'T02', 'T03', 'T04', 'T05', 'T06', 'T07', 'T08', 'T09', 'T10', 'T11', 'T12'].map(tbl => (
                          <option key={tbl} value={tbl}>Table {tbl}</option>
                        ))}
                      </select>
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <StatusBadge status={res.status} />
                    </td>

                    {/* Notes */}
                    <td className="p-4 text-charcoal-400 max-w-xs truncate italic">
                      {res.specialRequest || '—'}
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {res.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleUpdate(res.id, 'CONFIRMED', res.tableNumber || 'T04')}
                              className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-white transition-colors"
                              title="Confirm Booking"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleUpdate(res.id, 'REJECTED')}
                              className="p-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white transition-colors"
                              title="Reject Booking"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {res.status === 'CONFIRMED' && (
                          <button
                            onClick={() => handleUpdate(res.id, 'SEATED')}
                            className="px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500 hover:text-white text-xs font-semibold transition-colors"
                          >
                            Mark Seated
                          </button>
                        )}
                        {res.status === 'SEATED' && (
                          <button
                            onClick={() => handleUpdate(res.id, 'COMPLETED')}
                            className="px-2.5 py-1 rounded-lg bg-charcoal-800 text-ivory-200 hover:bg-charcoal-700 text-xs font-semibold transition-colors"
                          >
                            Mark Completed
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
