
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaEye, FaTrash, FaDownload, FaCheck } from 'react-icons/fa';

const Security = ({ handleSecurityAction }) => {
  const [securityLogs, setSecurityLogs] = useState([
    { id: 's1', event: 'Tentative de connexion', user: 'Admin 1', date: '2025-06-25', status: 'Échec', details: 'Connexion échouée avec mot de passe incorrect' },
    { id: 's2', event: 'Modification de mot de passe', user: 'Admin 2', date: '2025-06-24', status: 'Succès', details: 'Mot de passe modifié avec succès' },
  ]);
  const [filteredLogs, setFilteredLogs] = useState(securityLogs);
  const [modalType, setModalType] = useState(null);
  const [selectedLog, setSelectedLog] = useState(null);
  const [selectedLogIds, setSelectedLogIds] = useState([]);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const openModal = (type, log) => {
    setModalType(type);
    setSelectedLog(log || null);
    reset();
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedLog(null);
    reset();
  };

  const onDeleteSubmit = () => {
    if (selectedLog) {
      setSecurityLogs(securityLogs.filter(l => l.id !== selectedLog.id));
      setFilteredLogs(filteredLogs.filter(l => l.id !== selectedLog.id));
      handleSecurityAction(selectedLog.id, 'Supprimer');
      console.log(`Log ${selectedLog.id} deleted`);
      closeModal();
    }
  };

  const onBulkDelete = () => {
    setSecurityLogs(securityLogs.filter(l => !selectedLogIds.includes(l.id)));
    setFilteredLogs(filteredLogs.filter(l => !selectedLogIds.includes(l.id)));
    selectedLogIds.forEach(id => handleSecurityAction(id, 'Supprimer'));
    console.log(`Bulk deleted logs:`, selectedLogIds);
    setSelectedLogIds([]);
  };

  const onExportSubmit = (data) => {
    if (data.exportFormat === 'CSV') {
      const csv = filteredLogs.map(l => `${l.id},${l.event},${l.user},${l.date},${l.status},${l.details.replace(/,/g, '')}`).join('\n');
      const blob = new Blob([`id,event,user,date,status,details\n${csv}`], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `security_logs_${data.exportStartDate}_${data.exportEndDate}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      console.log(`Exporting logs as ${data.exportFormat} from ${data.exportStartDate} to ${data.exportEndDate}`);
    }
    closeModal();
  };

  const onFilterSubmit = (data) => {
    let filtered = [...securityLogs];
    if (data.filterEvent) {
      filtered = filtered.filter(l => l.event.toLowerCase().includes(data.filterEvent.toLowerCase()));
    }
    if (data.filterUser) {
      filtered = filtered.filter(l => l.user.toLowerCase().includes(data.filterUser.toLowerCase()));
    }
    if (data.filterStatus && data.filterStatus !== 'all') {
      filtered = filtered.filter(l => l.status === data.filterStatus);
    }
    if (data.filterDate) {
      filtered = filtered.filter(l => l.date === data.filterDate);
    }
    setFilteredLogs(filtered);
  };

  const sortTable = (field) => {
    const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(direction);
    const sorted = [...filteredLogs].sort((a, b) => {
      const aValue = a[field] || '';
      const bValue = b[field] || '';
      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setFilteredLogs(sorted);
  };

  const toggleSelectLog = (id) => {
    setSelectedLogIds(prev =>
      prev.includes(id) ? prev.filter(lid => lid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedLogIds.length === filteredLogs.length) {
      setSelectedLogIds([]);
    } else {
      setSelectedLogIds(filteredLogs.map(l => l.id));
    }
  };

  return (
    <div className="p-2 sm:p-4">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6">Gestion de la sécurité</h2>
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg">
        <div className="p-4">
          <h3 className="text-white text-sm sm:text-lg md:text-xl">Journaux de sécurité</h3>
        </div>
        <div className="p-4">
          <div className="mb-4 flex flex-col sm:flex-row gap-2">
            {selectedLogIds.length > 0 && (
              <button
                className="bg-red-600 text-white px-4 py-2 rounded text-xs sm:text-sm flex items-center"
                onClick={onBulkDelete}
                aria-label="Supprimer les journaux sélectionnés"
              >
                <FaTrash className="w-4 h-4 mr-2" />
                Supprimer sélection
              </button>
            )}
            <button
              className="bg-yellow-600 text-white px-4 py-2 rounded text-xs sm:text-sm flex items-center"
              onClick={() => openModal('export')}
              aria-label="Exporter les journaux"
            >
              <FaDownload className="w-4 h-4 mr-2" />
              Exporter
            </button>
          </div>
          <div className="mb-4 flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Filtrer par événement"
              {...register('filterEvent')}
              className="p-2 rounded-lg bg-white/10 text-white border border-white/20 text-xs sm:text-sm"
            />
            <input
              type="text"
              placeholder="Filtrer par utilisateur"
              {...register('filterUser')}
              className="p-2 rounded-lg bg-white/10 text-white border border-white/20 text-xs sm:text-sm"
            />
            <select
              {...register('filterStatus')}
              className="p-2 rounded-lg bg-white/10 text-white border border-white/20 text-xs sm:text-sm"
            >
              <option value="all">Tous</option>
              <option value="Succès">Succès</option>
              <option value="Échec">Échec</option>
            </select>
            <input
              type="date"
              {...register('filterDate')}
              className="p-2 rounded-lg bg-white/10 text-white border border-white/20 text-xs sm:text-sm"
            />
            <button
              type="button"
              onClick={handleSubmit(onFilterSubmit)}
              className="bg-blue-600 text-white px-4 py-2 rounded text-xs sm:text-sm"
            >
              Filtrer
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-white text-xs sm:text-sm md:text-base">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="p-2 sm:p-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedLogIds.length === filteredLogs.length && filteredLogs.length > 0}
                      onChange={toggleSelectAll}
                      aria-label="Sélectionner tous les journaux"
                    />
                  </th>
                  <th
                    className="p-2 sm:p-3 text-left cursor-pointer"
                    onClick={() => sortTable('event')}
                  >
                    Événement {sortField === 'event' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className="p-2 sm:p-3 text-left cursor-pointer"
                    onClick={() => sortTable('user')}
                  >
                    Utilisateur {sortField === 'user' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className="p-2 sm:p-3 text-left cursor-pointer"
                    onClick={() => sortTable('date')}
                  >
                    Date {sortField === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className="p-2 sm:p-3 text-left cursor-pointer"
                    onClick={() => sortTable('status')}
                  >
                    Statut {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="p-2 sm:p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="border-b border-white/10">
                    <td className="p-2 sm:p-3">
                      <input
                        type="checkbox"
                        checked={selectedLogIds.includes(log.id)}
                        onChange={() => toggleSelectLog(log.id)}
                        aria-label={`Sélectionner le journal ${log.event}`}
                      />
                    </td>
                    <td className="p-2 sm:p-3">{log.event}</td>
                    <td className="p-2 sm:p-3">{log.user}</td>
                    <td className="p-2 sm:p-3">{log.date}</td>
                    <td className="p-2 sm:p-3">{log.status}</td>
                    <td className="p-2 sm:p-3 flex flex-wrap gap-1 sm:gap-2">
                      <button
                        className="text-white bg-yellow-600 border border-white/20 hover:bg-white/20 px-2 py-1 rounded text-xs sm:text-sm flex items-center"
                        onClick={() => openModal('view', log)}
                        aria-label={`Voir le journal ${log.event}`}
                      >
                        <FaEye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        
                      </button>
                      <button
                        className="text-white bg-red-600 border border-white/20 hover:bg-white/20 px-2 py-1 rounded text-xs sm:text-sm flex items-center"
                        onClick={() => openModal('delete', log)}
                        aria-label={`Supprimer le journal ${log.event}`}
                      >
                        <FaTrash className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* View Log Modal */}
      {modalType === 'view' && selectedLog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 text-white border border-white/20 rounded-xl w-[90%] sm:w-[500px] p-4 sm:p-6 shadow-xl">
            <h3 className="text-lg font-bold mb-4">Voir le journal</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm">Événement</label>
                <p className="text-xs sm:text-sm">{selectedLog.event}</p>
              </div>
              <div>
                <label className="block text-sm">Utilisateur</label>
                <p className="text-xs sm:text-sm">{selectedLog.user}</p>
              </div>
              <div>
                <label className="block text-sm">Date</label>
                <p className="text-xs sm:text-sm">{selectedLog.date}</p>
              </div>
              <div>
                <label className="block text-sm">Statut</label>
                <p className="text-xs sm:text-sm">{selectedLog.status}</p>
              </div>
              <div>
                <label className="block text-sm">Détails</label>
                <p className="text-xs sm:text-sm">{selectedLog.details}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  className="text-white bg-gray-600 px-4 py-2 rounded text-xs sm:text-sm"
                  onClick={closeModal}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Log Modal */}
      {modalType === 'delete' && selectedLog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 text-white border border-white/20 rounded-xl w-[90%] sm:w-[500px] p-4 sm:p-6 shadow-xl">
            <h3 className="text-lg font-bold mb-4">Supprimer le journal</h3>
            <div className="p-4">
              <p>Supprimer le journal "{selectedLog.event}" de {selectedLog.user} ({selectedLog.date}) ?</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                className="text-white bg-gray-600 px-4 py-2 rounded text-xs sm:text-sm"
                onClick={closeModal}
              >
                Annuler
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded text-xs sm:text-sm"
                onClick={onDeleteSubmit}
                disabled={!selectedLog}
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Logs Modal */}
      {modalType === 'export' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 text-white border border-white/20 rounded-xl w-[90%] sm:w-[500px] p-4 sm:p-6 shadow-xl">
            <h3 className="text-lg font-bold mb-4">Exporter les journaux</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="exportFormat" className="block text-sm">Format</label>
                <select
                  id="exportFormat"
                  {...register('exportFormat', { required: 'Format requis' })}
                  className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/20 text-xs sm:text-sm"
                >
                  <option value="">Sélectionner un format</option>
                  <option value="CSV">CSV</option>
                  <option value="PDF">PDF</option>
                </select>
                {errors.exportFormat && <p className="text-red-500 text-xs">{errors.exportFormat.message}</p>}
              </div>
              <div>
                <label htmlFor="exportStartDate" className="block text-sm">Date de début</label>
                <input
                  id="exportStartDate"
                  type="date"
                  {...register('exportStartDate', { required: 'Date de début requise' })}
                  className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/20 text-xs sm:text-sm"
                />
                {errors.exportStartDate && <p className="text-red-500 text-xs">{errors.exportStartDate.message}</p>}
              </div>
              <div>
                <label htmlFor="exportEndDate" className="block text-sm">Date de fin</label>
                <input
                  id="exportEndDate"
                  type="date"
                  {...register('exportEndDate', { required: 'Date de fin requise' })}
                  className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/20 text-xs sm:text-sm"
                />
                {errors.exportEndDate && <p className="text-red-500 text-xs">{errors.exportEndDate.message}</p>}
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  className="text-white bg-gray-600 px-4 py-2 rounded text-xs sm:text-sm"
                  onClick={closeModal}
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleSubmit(onExportSubmit)}
                  className="bg-blue-600 text-white px-4 py-2 rounded text-xs sm:text-sm"
                >
                  Exporter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Security;