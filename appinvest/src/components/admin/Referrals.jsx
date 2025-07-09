
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaCheck, FaTimes, FaEdit, FaTrash, FaPlus, FaDownload } from 'react-icons/fa';

const Referrals = ({ referrals: initialReferrals, handleReferralAction }) => {
  const [referrals, setReferrals] = useState(initialReferrals);
  const [filteredReferrals, setFilteredReferrals] = useState(initialReferrals);
  const [modalType, setModalType] = useState(null);
  const [selectedReferral, setSelectedReferral] = useState(null);
  const [selectedReferrals, setSelectedReferrals] = useState([]);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

  const openModal = (type, referral) => {
    setModalType(type);
    setSelectedReferral(referral || null);
    if (referral && type === 'edit') {
      setValue('user', referral.user);
      setValue('referrer', referral.referrer);
      setValue('commission', referral.commission);
      setValue('status', referral.status);
      setValue('date', referral.date || '');
    }
    reset(type !== 'edit' ? {} : undefined);
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedReferral(null);
    reset();
  };

  const onAddSubmit = (data) => {
    if (data.user && data.referrer && data.commission && data.status) {
      const newReferral = {
        id: `ref${referrals.length + 1}`,
        user: data.user,
        referrer: data.referrer,
        commission: Number(data.commission),
        status: data.status,
        date: data.date || new Date().toISOString().split('T')[0],
      };
      setReferrals([...referrals, newReferral]);
      setFilteredReferrals([...filteredReferrals, newReferral]);
      handleReferralAction(newReferral.id, 'Ajouter');
      console.log(`Referral added:`, newReferral);
      closeModal();
    }
  };

  const onEditSubmit = (data) => {
    if (selectedReferral && data.user && data.referrer && data.commission && data.status) {
      const updatedReferral = {
        ...selectedReferral,
        user: data.user,
        referrer: data.referrer,
        commission: Number(data.commission),
        status: data.status,
        date: data.date || selectedReferral.date || new Date().toISOString().split('T')[0],
      };
      setReferrals(referrals.map(r => r.id === selectedReferral.id ? updatedReferral : r));
      setFilteredReferrals(filteredReferrals.map(r => r.id === selectedReferral.id ? updatedReferral : r));
      handleReferralAction(selectedReferral.id, 'Modifier');
      console.log(`Referral ${selectedReferral.id} edited:`, updatedReferral);
      closeModal();
    }
  };

  const onDeleteSubmit = () => {
    if (selectedReferral) {
      setReferrals(referrals.filter(r => r.id !== selectedReferral.id));
      setFilteredReferrals(filteredReferrals.filter(r => r.id !== selectedReferral.id));
      handleReferralAction(selectedReferral.id, 'Supprimer');
      console.log(`Referral ${selectedReferral.id} deleted`);
      closeModal();
    }
  };

  const onValidateSubmit = () => {
    if (selectedReferral) {
      setReferrals(referrals.map(r => r.id === selectedReferral.id ? { ...r, status: 'Validé' } : r));
      setFilteredReferrals(filteredReferrals.map(r => r.id === selectedReferral.id ? { ...r, status: 'Validé' } : r));
      handleReferralAction(selectedReferral.id, 'Valider');
      console.log(`Referral ${selectedReferral.id} validated`);
      closeModal();
    }
  };

  const onRejectSubmit = () => {
    if (selectedReferral) {
      setReferrals(referrals.map(r => r.id === selectedReferral.id ? { ...r, status: 'Rejeté' } : r));
      setFilteredReferrals(filteredReferrals.map(r => r.id === selectedReferral.id ? { ...r, status: 'Rejeté' } : r));
      handleReferralAction(selectedReferral.id, 'Rejeter');
      console.log(`Referral ${selectedReferral.id} rejected`);
      closeModal();
    }
  };

  const onBulkValidate = () => {
    setReferrals(referrals.map(r => selectedReferrals.includes(r.id) ? { ...r, status: 'Validé' } : r));
    setFilteredReferrals(filteredReferrals.map(r => selectedReferrals.includes(r.id) ? { ...r, status: 'Validé' } : r));
    selectedReferrals.forEach(id => handleReferralAction(id, 'Valider'));
    console.log(`Bulk validated referrals:`, selectedReferrals);
    setSelectedReferrals([]);
  };

  const onBulkReject = () => {
    setReferrals(referrals.map(r => selectedReferrals.includes(r.id) ? { ...r, status: 'Rejeté' } : r));
    setFilteredReferrals(filteredReferrals.map(r => selectedReferrals.includes(r.id) ? { ...r, status: 'Rejeté' } : r));
    selectedReferrals.forEach(id => handleReferralAction(id, 'Rejeter'));
    console.log(`Bulk rejected referrals:`, selectedReferrals);
    setSelectedReferrals([]);
  };

  const onExportSubmit = (data) => {
    if (data.exportFormat === 'CSV') {
      const csv = filteredReferrals.map(r => `${r.id},${r.user},${r.referrer},${r.commission},${r.status},${r.date || ''}`).join('\n');
      const blob = new Blob([`id,user,referrer,commission,status,date\n${csv}`], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `referrals_${data.exportStartDate}_${data.exportEndDate}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      console.log(`Exporting referrals as ${data.exportFormat} from ${data.exportStartDate} to ${data.exportEndDate}`);
    }
    closeModal();
  };

  const onFilterSubmit = (data) => {
    let filtered = [...referrals];
    if (data.filterUser) {
      filtered = filtered.filter(r => r.user.toLowerCase().includes(data.filterUser.toLowerCase()));
    }
    if (data.filterReferrer) {
      filtered = filtered.filter(r => r.referrer.toLowerCase().includes(data.filterReferrer.toLowerCase()));
    }
    if (data.filterStatus && data.filterStatus !== 'all') {
      filtered = filtered.filter(r => r.status === data.filterStatus);
    }
    if (data.filterDate) {
      filtered = filtered.filter(r => r.date && r.date === data.filterDate);
    }
    setFilteredReferrals(filtered);
  };

  const sortTable = (field) => {
    const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(direction);
    const sorted = [...filteredReferrals].sort((a, b) => {
      const aValue = field === 'commission' ? a[field] : a[field] || '';
      const bValue = field === 'commission' ? b[field] : b[field] || '';
      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setFilteredReferrals(sorted);
  };

  const toggleSelectReferral = (id) => {
    setSelectedReferrals(prev =>
      prev.includes(id) ? prev.filter(rid => rid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedReferrals.length === filteredReferrals.length) {
      setSelectedReferrals([]);
    } else {
      setSelectedReferrals(filteredReferrals.map(r => r.id));
    }
  };

  return (
    <div className="p-2 sm:p-4">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6">Gestion des parrainages/affiliés</h2>
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg">
        <div className="p-4">
          <h3 className="text-white text-sm sm:text-lg md:text-xl">Liste des parrainages</h3>
        </div>
        <div className="p-4">
          <div className="mb-4 flex flex-col sm:flex-row gap-2">
            <button
              className="bg-green-600 text-white px-4 py-2 rounded text-xs sm:text-sm flex items-center"
              onClick={() => openModal('add')}
              aria-label="Ajouter un parrainage"
            >
              <FaPlus className="w-4 h-4 mr-2" />
              Ajouter un parrainage
            </button>
            {selectedReferrals.length > 0 && (
              <>
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded text-xs sm:text-sm flex items-center"
                  onClick={onBulkValidate}
                  aria-label="Valider les parrainages sélectionnés"
                >
                  <FaCheck className="w-4 h-4 mr-2" />
                  Valider sélection
                </button>
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded text-xs sm:text-sm flex items-center"
                  onClick={onBulkReject}
                  aria-label="Rejeter les parrainages sélectionnés"
                >
                  <FaTimes className="w-4 h-4 mr-2" />
                  Rejeter sélection
                </button>
              </>
            )}
            <button
              className="bg-yellow-600 text-white px-4 py-2 rounded text-xs sm:text-sm flex items-center"
              onClick={() => openModal('export')}
              aria-label="Exporter les parrainages"
            >
              <FaDownload className="w-4 h-4 mr-2" />
              Exporter
            </button>
          </div>
          <div className="mb-4 flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Filtrer par utilisateur"
              {...register('filterUser')}
              className="p-2 rounded-lg bg-white/10 text-white border border-white/20 text-xs sm:text-sm"
            />
            <input
              type="text"
              placeholder="Filtrer par parrain"
              {...register('filterReferrer')}
              className="p-2 rounded-lg bg-white/10 text-white border border-white/20 text-xs sm:text-sm"
            />
            <select
              {...register('filterStatus')}
              className="p-2 rounded-lg bg-white/10 text-white border border-white/20 text-xs sm:text-sm"
            >
              <option value="all">Tous</option>
              <option value="Validé">Validé</option>
              <option value="Rejeté">Rejeté</option>
              <option value="En attente">En attente</option>
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
                      checked={selectedReferrals.length === filteredReferrals.length && filteredReferrals.length > 0}
                      onChange={toggleSelectAll}
                      aria-label="Sélectionner tous les parrainages"
                    />
                  </th>
                  <th
                    className="p-2 sm:p-3 text-left cursor-pointer"
                    onClick={() => sortTable('user')}
                  >
                    Utilisateur {sortField === 'user' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className="p-2 sm:p-3 text-left cursor-pointer"
                    onClick={() => sortTable('referrer')}
                  >
                    Parrain {sortField === 'referrer' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className="p-2 sm:p-3 text-left cursor-pointer"
                    onClick={() => sortTable('commission')}
                  >
                    Commission {sortField === 'commission' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className="p-2 sm:p-3 text-left cursor-pointer"
                    onClick={() => sortTable('status')}
                  >
                    Statut {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className="p-2 sm:p-3 text-left cursor-pointer"
                    onClick={() => sortTable('date')}
                  >
                    Date {sortField === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="p-2 sm:p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReferrals.map((referral) => (
                  <tr key={referral.id} className="border-b border-white/10">
                    <td className="p-2 sm:p-3">
                      <input
                        type="checkbox"
                        checked={selectedReferrals.includes(referral.id)}
                        onChange={() => toggleSelectReferral(referral.id)}
                        aria-label={`Sélectionner le parrainage ${referral.id}`}
                      />
                    </td>
                    <td className="p-2 sm:p-3">{referral.user}</td>
                    <td className="p-2 sm:p-3">{referral.referrer}</td>
                    <td className="p-2 sm:p-3">{referral.commission.toLocaleString()} Ar</td>
                    <td className="p-2 sm:p-3">{referral.status}</td>
                    <td className="p-2 sm:p-3">{referral.date || '-'}</td>
                    <td className="p-2 sm:p-3 flex flex-wrap gap-1 sm:gap-2">
                      <button
                        className="text-white bg-green-600 border border-white/20 hover:bg-white/20 px-2 py-1 rounded text-xs sm:text-sm flex items-center"
                        onClick={() => openModal('validate', referral)}
                        aria-label="Valider le parrainage"
                      >
                        <FaCheck className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      
                      </button>
                      <button
                        className="text-white bg-red-600 border border-white/20 hover:bg-white/20 px-2 py-1 rounded text-xs sm:text-sm flex items-center"
                        onClick={() => openModal('reject', referral)}
                        aria-label="Rejeter le parrainage"
                      >
                        <FaTimes className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                       
                      </button>
                      <button
                        className="text-white bg-blue-600 border border-white/20 hover:bg-white/20 px-2 py-1 rounded text-xs sm:text-sm flex items-center"
                        onClick={() => openModal('edit', referral)}
                        aria-label="Modifier le parrainage"
                      >
                        <FaEdit className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                       
                      </button>
                      <button
                        className="text-white bg-yellow-600 border border-white/20 hover:bg-white/20 px-2 py-1 rounded text-xs sm:text-sm flex items-center"
                        onClick={() => openModal('delete', referral)}
                        aria-label="Supprimer le parrainage"
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

      {/* Add Referral Modal */}
      {modalType === 'add' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 text-white border border-white/20 rounded-xl w-[90%] sm:w-[500px] p-4 sm:p-6 shadow-xl">
            <h3 className="text-lg font-bold mb-4">Ajouter un parrainage</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="user" className="block text-sm">Utilisateur</label>
                <input
                  id="user"
                  {...register('user', { required: 'Utilisateur requis' })}
                  className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/20 text-xs sm:text-sm"
                />
                {errors.user && <p className="text-red-500 text-xs">{errors.user.message}</p>}
              </div>
              <div>
                <label htmlFor="referrer" className="block text-sm">Parrain</label>
                <input
                  id="referrer"
                  {...register('referrer', { required: 'Parrain requis' })}
                  className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/20 text-xs sm:text-sm"
                />
                {errors.referrer && <p className="text-red-500 text-xs">{errors.referrer.message}</p>}
              </div>
              <div>
                <label htmlFor="commission" className="block text-sm">Commission (Ar)</label>
                <input
                  id="commission"
                  type="number"
                  {...register('commission', { required: 'Commission requise', min: { value: 1, message: 'Commission doit être supérieure à 0' } })}
                  className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/20 text-xs sm:text-sm"
                />
                {errors.commission && <p className="text-red-500 text-xs">{errors.commission.message}</p>}
              </div>
              <div>
                <label htmlFor="status" className="block text-sm">Statut</label>
                <select
                  id="status"
                  {...register('status', { required: 'Statut requis' })}
                  className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/20 text-xs sm:text-sm"
                >
                  <option value="">Sélectionner un statut</option>
                  <option value="Validé">Validé</option>
                  <option value="Rejeté">Rejeté</option>
                  <option value="En attente">En attente</option>
                </select>
                {errors.status && <p className="text-red-500 text-xs">{errors.status.message}</p>}
              </div>
              <div>
                <label htmlFor="date" className="block text-sm">Date</label>
                <input
                  id="date"
                  type="date"
                  {...register('date')}
                  className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/20 text-xs sm:text-sm"
                />
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
                  onClick={handleSubmit(onAddSubmit)}
                  className="bg-blue-600 text-white px-4 py-2 rounded text-xs sm:text-sm"
                >
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Referral Modal */}
      {modalType === 'edit' && selectedReferral && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 text-white border border-white/20 rounded-xl w-[90%] sm:w-[500px] p-4 sm:p-6 shadow-xl">
            <h3 className="text-lg font-bold mb-4">Modifier le parrainage</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="user" className="block text-sm">Utilisateur</label>
                <input
                  id="user"
                  {...register('user', { required: 'Utilisateur requis' })}
                  className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/20 text-xs sm:text-sm"
                />
                {errors.user && <p className="text-red-500 text-xs">{errors.user.message}</p>}
              </div>
              <div>
                <label htmlFor="referrer" className="block text-sm">Parrain</label>
                <input
                  id="referrer"
                  {...register('referrer', { required: 'Parrain requis' })}
                  className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/20 text-xs sm:text-sm"
                />
                {errors.referrer && <p className="text-red-500 text-xs">{errors.referrer.message}</p>}
              </div>
              <div>
                <label htmlFor="commission" className="block text-sm">Commission (Ar)</label>
                <input
                  id="commission"
                  type="number"
                  {...register('commission', { required: 'Commission requise', min: { value: 1, message: 'Commission doit être supérieure à 0' } })}
                  className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/20 text-xs sm:text-sm"
                />
                {errors.commission && <p className="text-red-500 text-xs">{errors.commission.message}</p>}
              </div>
              <div>
                <label htmlFor="status" className="block text-sm">Statut</label>
                <select
                  id="status"
                  {...register('status', { required: 'Statut requis' })}
                  className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/20 text-xs sm:text-sm"
                >
                  <option value="">Sélectionner un statut</option>
                  <option value="Validé">Validé</option>
                  <option value="Rejeté">Rejeté</option>
                  <option value="En attente">En attente</option>
                </select>
                {errors.status && <p className="text-red-500 text-xs">{errors.status.message}</p>}
              </div>
              <div>
                <label htmlFor="date" className="block text-sm">Date</label>
                <input
                  id="date"
                  type="date"
                  {...register('date')}
                  className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/20 text-xs sm:text-sm"
                />
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
                  onClick={handleSubmit(onEditSubmit)}
                  className="bg-blue-600 text-white px-4 py-2 rounded text-xs sm:text-sm"
                >
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Referral Modal */}
      {modalType === 'delete' && selectedReferral && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 text-white border border-white/20 rounded-xl w-[90%] sm:w-[500px] p-4 sm:p-6 shadow-xl">
            <h3 className="text-lg font-bold mb-4">Supprimer le parrainage</h3>
            <div className="p-4">
              <p>Supprimer le parrainage de {selectedReferral.user} par {selectedReferral.referrer} ({selectedReferral.commission.toLocaleString()} Ar) ?</p>
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
                disabled={!selectedReferral}
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Validate Referral Modal */}
      {modalType === 'validate' && selectedReferral && (
        <div className="

fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 text-white border border-white/20 rounded-xl w-[90%] sm:w-[500px] p-4 sm:p-6 shadow-xl">
            <h3 className="text-lg font-bold mb-4">Valider le parrainage</h3>
            <div className="p-4">
              <p>Valider le parrainage de {selectedReferral.user} par {selectedReferral.referrer} ({selectedReferral.commission.toLocaleString()} Ar) ?</p>
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
                onClick={onValidateSubmit}
                disabled={!selectedReferral}
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Referral Modal */}
      {modalType === 'reject' && selectedReferral && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 text-white border border-white/20 rounded-xl w-[90%] sm:w-[500px] p-4 sm:p-6 shadow-xl">
            <h3 className="text-lg font-bold mb-4">Rejeter le parrainage</h3>
            <div className="p-4">
              <p>Rejeter le parrainage de {selectedReferral.user} par {selectedReferral.referrer} ({selectedReferral.commission.toLocaleString()} Ar) ?</p>
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
                onClick={onRejectSubmit}
                disabled={!selectedReferral}
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Referrals Modal */}
      {modalType === 'export' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 text-white border border-white/20 rounded-xl w-[90%] sm:w-[500px] p-4 sm:p-6 shadow-xl">
            <h3 className="text-lg font-bold mb-4">Exporter les parrainages</h3>
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

export default Referrals;
