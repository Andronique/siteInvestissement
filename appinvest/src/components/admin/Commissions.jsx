'use client';

import { useState } from 'react';
import { BiCheck as Check, BiX as X, BiEdit as Edit, BiTrash as Trash, BiPlus as Plus, BiDownload as Download } from 'react-icons/bi';
import { useForm } from 'react-hook-form';

export default function Commissions({ commissions: initialCommissions, handleCommissionAction }) {
  const [commissions, setCommissions] = useState(initialCommissions);
  const [filteredCommissions, setFilteredCommissions] = useState(initialCommissions);
  const [modalType, setModalType] = useState(null);
  const [selectedCommission, setSelectedCommission] = useState(null);
  const [selectedCommissions, setSelectedCommissions] = useState([]);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

  const openModal = (type, commission) => {
    setModalType(type);
    setSelectedCommission(commission || null);
    if (commission && type === 'edit') {
      setValue('user', commission.user);
      setValue('type', commission.type);
      setValue('amount', commission.amount);
      setValue('date', commission.date);
      setValue('status', commission.status);
    }
    reset(type !== 'edit' ? {} : undefined);
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedCommission(null);
    reset();
  };

  const onAddSubmit = (data) => {
    if (data.user && data.type && data.amount && data.date && data.status) {
      const newCommission = {
        id: `comm${commissions.length + 1}`,
        user: data.user,
        type: data.type,
        amount: Number(data.amount),
        date: data.date,
        status: data.status,
      };
      setCommissions([...commissions, newCommission]);
      setFilteredCommissions([...filteredCommissions, newCommission]);
      handleCommissionAction(newCommission.id, 'Ajouter');
      console.log(`Commission added:`, newCommission);
      closeModal();
    }
  };

  const onEditSubmit = (data) => {
    if (selectedCommission && data.user && data.type && data.amount && data.date && data.status) {
      const updatedCommission = {
        ...selectedCommission,
        user: data.user,
        type: data.type,
        amount: Number(data.amount),
        date: data.date,
        status: data.status,
      };
      setCommissions(commissions.map(c => c.id === selectedCommission.id ? updatedCommission : c));
      setFilteredCommissions(filteredCommissions.map(c => c.id === selectedCommission.id ? updatedCommission : c));
      handleCommissionAction(selectedCommission.id, 'Modifier');
      console.log(`Commission ${selectedCommission.id} edited:`, updatedCommission);
      closeModal();
    }
  };

  const onDeleteSubmit = () => {
    if (selectedCommission) {
      setCommissions(commissions.filter(c => c.id !== selectedCommission.id));
      setFilteredCommissions(filteredCommissions.filter(c => c.id !== selectedCommission.id));
      handleCommissionAction(selectedCommission.id, 'Supprimer');
      console.log(`Commission ${selectedCommission.id} deleted`);
      closeModal();
    }
  };

  const onValidateSubmit = () => {
    if (selectedCommission) {
      setCommissions(commissions.map(c => c.id === selectedCommission.id ? { ...c, status: 'Validé' } : c));
      setFilteredCommissions(filteredCommissions.map(c => c.id === selectedCommission.id ? { ...c, status: 'Validé' } : c));
      handleCommissionAction(selectedCommission.id, 'Valider');
      console.log(`Commission ${selectedCommission.id} validated`);
      closeModal();
    }
  };

  const onRejectSubmit = () => {
    if (selectedCommission) {
      setCommissions(commissions.map(c => c.id === selectedCommission.id ? { ...c, status: 'Rejeté' } : c));
      setFilteredCommissions(filteredCommissions.map(c => c.id === selectedCommission.id ? { ...c, status: 'Rejeté' } : c));
      handleCommissionAction(selectedCommission.id, 'Rejeter');
      console.log(`Commission ${selectedCommission.id} rejected`);
      closeModal();
    }
  };

  const onBulkValidate = () => {
    setCommissions(commissions.map(c => selectedCommissions.includes(c.id) ? { ...c, status: 'Validé' } : c));
    setFilteredCommissions(filteredCommissions.map(c => selectedCommissions.includes(c.id) ? { ...c, status: 'Validé' } : c));
    selectedCommissions.forEach(id => handleCommissionAction(id, 'Valider'));
    console.log(`Bulk validated commissions:`, selectedCommissions);
    setSelectedCommissions([]);
  };

  const onBulkReject = () => {
    setCommissions(commissions.map(c => selectedCommissions.includes(c.id) ? { ...c, status: 'Rejeté' } : c));
    setFilteredCommissions(filteredCommissions.map(c => selectedCommissions.includes(c.id) ? { ...c, status: 'Rejeté' } : c));
    selectedCommissions.forEach(id => handleCommissionAction(id, 'Rejeter'));
    console.log(`Bulk rejected commissions:`, selectedCommissions);
    setSelectedCommissions([]);
  };

  const onExportSubmit = (data) => {
    if (data.exportFormat === 'CSV') {
      const csv = filteredCommissions.map(c => `${c.id},${c.user},${c.type},${c.amount},${c.date},${c.status}`).join('\n');
      const blob = new Blob([`id,user,type,amount,date,status\n${csv}`], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `commissions_${data.exportStartDate}_${data.exportEndDate}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      console.log(`Exporting commissions as ${data.exportFormat} from ${data.exportStartDate} to ${data.exportEndDate}`);
    }
    closeModal();
  };

  const onFilterSubmit = (data) => {
    let filtered = [...commissions];
    if (data.filterUser) {
      filtered = filtered.filter(c => c.user.toLowerCase().includes(data.filterUser.toLowerCase()));
    }
    if (data.filterType && data.filterType !== 'all') {
      filtered = filtered.filter(c => c.type === data.filterType);
    }
    if (data.filterDate) {
      filtered = filtered.filter(c => c.date === data.filterDate);
    }
    if (data.filterStatus && data.filterStatus !== 'all') {
      filtered = filtered.filter(c => c.status === data.filterStatus);
    }
    setFilteredCommissions(filtered);
  };

  const sortTable = (field) => {
    const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(direction);
    const sorted = [...filteredCommissions].sort((a, b) => {
      const aValue = field === 'amount' ? a[field] : a[field];
      const bValue = field === 'amount' ? b[field] : b[field];
      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setFilteredCommissions(sorted);
  };

  const toggleSelectCommission = (id) => {
    setSelectedCommissions(prev =>
      prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedCommissions.length === filteredCommissions.length) {
      setSelectedCommissions([]);
    } else {
      setSelectedCommissions(filteredCommissions.map(c => c.id));
    }
  };

  return (
    <div className="p-2 sm:p-4">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6">Gestion des gains/commissions</h2>
      <div className="bg-white/10 backdrop-blur-sm border-white/20 rounded-lg">
        <div className="p-4 sm:p-6">
          <h3 className="text-white text-sm sm:text-lg md:text-xl mb-4">Liste des commissions</h3>
        </div>
        <div className="p-4 sm:p-6">
          <div className="mb-4 flex flex-col sm:flex-row gap-2">
            <button
              className="bg-green-600 text-white text-xs sm:text-sm px-3 py-2 rounded flex items-center"
              onClick={() => openModal('add')}
              aria-label="Ajouter une commission"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter une commission
            </button>
            {selectedCommissions.length > 0 && (
              <>
                <button
                  className="bg-blue-600 text-white text-xs sm:text-sm px-3 py-2 rounded flex items-center"
                  onClick={onBulkValidate}
                  aria-label="Valider les commissions sélectionnées"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Valider sélection
                </button>
                <button
                  className="bg-red-600 text-white text-xs sm:text-sm px-3 py-2 rounded flex items-center"
                  onClick={onBulkReject}
                  aria-label="Rejeter les commissions sélectionnées"
                >
                  <X className="w-4 h-4 mr-2" />
                  Rejeter sélection
                </button>
              </>
            )}
            <button
              className="bg-yellow-600 text-white text-xs sm:text-sm px-3 py-2 rounded flex items-center"
              onClick={() => openModal('export')}
              aria-label="Exporter les commissions"
            >
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </button>
          </div>
          <form onSubmit={handleSubmit(onFilterSubmit)} className="mb-4 flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Filtrer par utilisateur"
              {...register('filterUser')}
              className="p-2 rounded-lg bg-white/10 text-white border-white/20 text-xs sm:text-sm"
            />
            <select
              {...register('filterType')}
              className="p-2 rounded-lg bg-white/10 text-white border-white/20 text-xs sm:text-sm"
            >
              <option value="all">Tous</option>
              <option value="Parrainage">Parrainage</option>
              <option value="Bonus">Bonus</option>
            </select>
            <input
              type="date"
              {...register('filterDate')}
              className="p-2 rounded-lg bg-white/10 text-white border-white/20 text-xs sm:text-sm"
            />
            <select
              {...register('filterStatus')}
              className="p-2 rounded-lg bg-white/10 text-white border-white/20 text-xs sm:text-sm"
            >
              <option value="all">Tous</option>
              <option value="Validé">Validé</option>
              <option value="Rejeté">Rejeté</option>
              <option value="En attente">En attente</option>
            </select>
            <button type="submit" className="bg-blue-600 text-white text-xs sm:text-sm px-3 py-2 rounded">Filtrer</button>
          </form>
          <div className="overflow-x-auto">
            <table className="w-full text-white text-xs sm:text-sm md:text-base">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="p-2 sm:p-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedCommissions.length === filteredCommissions.length && filteredCommissions.length > 0}
                      onChange={toggleSelectAll}
                      aria-label="Sélectionner toutes les commissions"
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
                    onClick={() => sortTable('amount')}
                  >
                    Montant {sortField === 'amount' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className="p-2 sm:p-3 text-left cursor-pointer"
                    onClick={() => sortTable('type')}
                  >
                    Type {sortField === 'type' && (sortDirection === 'asc' ? '↑' : '↓')}
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
                {filteredCommissions.map((commission) => (
                  <tr key={commission.id} className="border-b border-white/10">
                    <td className="p-2 sm:p-3">
                      <input
                        type="checkbox"
                        checked={selectedCommissions.includes(commission.id)}
                        onChange={() => toggleSelectCommission(commission.id)}
                        aria-label={`Sélectionner la commission ${commission.id}`}
                      />
                    </td>
                    <td className="p-2 sm:p-3">{commission.user}</td>
                    <td className="p-2 sm:p-3">{commission.amount.toLocaleString()} Ar</td>
                    <td className="p-2 sm:p-3">{commission.type}</td>
                    <td className="p-2 sm:p-3">{commission.date}</td>
                    <td className="p-2 sm:p-3">{commission.status}</td>
                    <td className="p-2 sm:p-3 flex flex-wrap gap-1 sm:gap-2">
                      <button
                        className="text-white bg-green-600 border-white/20 hover:bg-white/20 text-xs sm:text-sm px-2 py-1 rounded flex items-center"
                        onClick={() => openModal('validate', commission)}
                        aria-label="Valider la commission"
                      >
                        <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Valider
                      </button>
                      <button
                        className="text-white bg-red-600 border-white/20 hover:bg-white/20 text-xs sm:text-sm px-2 py-1 rounded flex items-center"
                        onClick={() => openModal('reject', commission)}
                        aria-label="Rejeter la commission"
                      >
                        <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Rejeter
                      </button>
                      <button
                        className="text-white bg-blue-600 border-white/20 hover:bg-white/20 text-xs sm:text-sm px-2 py-1 rounded flex items-center"
                        onClick={() => openModal('edit', commission)}
                        aria-label="Modifier la commission"
                      >
                        <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Modifier
                      </button>
                      <button
                        className="text-white bg-yellow-600 border-white/20 hover:bg-white/20 text-xs sm:text-sm px-2 py-1 rounded flex items-center"
                        onClick={() => openModal('delete', commission)}
                        aria-label="Supprimer la commission"
                      >
                        <Trash className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Commission Modal */}
      <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 ${modalType === 'add' ? '' : 'hidden'}`}>
        <div className="bg-gray-800 text-white border border-white/20 rounded-xl w-[90%] sm:w-[500px] p-4 sm:p-6 shadow-xl">
          <h3 className="text-lg font-semibold mb-4">Ajouter une commission</h3>
          <form onSubmit={handleSubmit(onAddSubmit)} className="space-y-4">
            <div>
              <label htmlFor="user" className="block text-sm">Utilisateur</label>
              <input
                id="user"
                {...register('user', { required: 'Utilisateur requis' })}
                className="w-full p-2 rounded-lg bg-white/10 text-white border-white/20 text-xs sm:text-sm"
              />
              {errors.user && <p className="text-red-500 text-xs">{errors.user.message}</p>}
            </div>
            <div>
              <label htmlFor="type" className="block text-sm">Type</label>
              <select
                id="type"
                {...register('type', { required: 'Type requis' })}
                className="w-full p-2 rounded-lg bg-white/10 text-white border-white/20 text-xs sm:text-sm"
              >
                <option value="" disabled>Sélectionner un type</option>
                <option value="Parrainage">Parrainage</option>
                <option value="Bonus">Bonus</option>
              </select>
              {errors.type && <p className="text-red-500 text-xs">{errors.type.message}</p>}
            </div>
            <div>
              <label htmlFor="amount" className="block text-sm">Montant (Ar)</label>
              <input
                id="amount"
                type="number"
                {...register('amount', { required: 'Montant requis', min: { value: 1, message: 'Montant doit être supérieur à 0' } })}
                className="w-full p-2 rounded-lg bg-white/10 text-white border-white/20 text-xs sm:text-sm"
              />
              {errors.amount && <p className="text-red-500 text-xs">{errors.amount.message}</p>}
            </div>
            <div>
              <label htmlFor="date" className="block text-sm">Date</label>
              <input
                id="date"
                type="date"
                {...register('date', { required: 'Date requise' })}
                className="w-full p-2 rounded-lg bg-white/10 text-white border-white/20 text-xs sm:text-sm"
              />
              {errors.date && <p className="text-red-500 text-xs">{errors.date.message}</p>}
            </div>
            <div>
              <label htmlFor="status" className="block text-sm">Statut</label>
              <select
                id="status"
                {...register('status', { required: 'Statut requis' })}
                className="w-full p-2 rounded-lg bg-white/10 text-white border-white/20 text-xs sm:text-sm"
              >
                <option value="" disabled>Sélectionner un statut</option>
                <option value="Validé">Validé</option>
                <option value="Rejeté">Rejeté</option>
                <option value="En attente">En attente</option>
              </select>
              {errors.status && <p className="text-red-500 text-xs">{errors.status.message}</p>}
            </div>
            <div className="flex flex-col sm:flex-row gap-2 justify-end">
              <button type="button" className="text-white bg-gray-600 text-xs sm:text-sm px-3 py-2 rounded" onClick={closeModal}>Annuler</button>
              <button type="submit" className="bg-blue-600 text-white text-xs sm:text-sm px-3 py-2 rounded">Confirmer</button>
            </div>
          </form>
        </div>
      </div>

      {/* Edit Commission Modal */}
      <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 ${modalType === 'edit' && !!selectedCommission ? '' : 'hidden'}`}>
        <div className="bg-gray-800 text-white border border-white/20 rounded-xl w-[90%] sm:w-[500px] p-4 sm:p-6 shadow-xl">
          <h3 className="text-lg font-semibold mb-4">Modifier la commission</h3>
          <form onSubmit={handleSubmit(onEditSubmit)} className="space-y-4">
            <div>
              <label htmlFor="user" className="block text-sm">Utilisateur</label>
              <input
                id="user"
                {...register('user', { required: 'Utilisateur requis' })}
                className="w-full p-2 rounded-lg bg-white/10 text-white border-white/20 text-xs sm:text-sm"
              />
              {errors.user && <p className="text-red-500 text-xs">{errors.user.message}</p>}
            </div>
            <div>
              <label htmlFor="type" className="block text-sm">Type</label>
              <select
                id="type"
                {...register('type', { required: 'Type requis' })}
                className="w-full p-2 rounded-lg bg-white/10 text-white border-white/20 text-xs sm:text-sm"
              >
                <option value="" disabled>Sélectionner un type</option>
                <option value="Parrainage">Parrainage</option>
                <option value="Bonus">Bonus</option>
              </select>
              {errors.type && <p className="text-red-500 text-xs">{errors.type.message}</p>}
            </div>
            <div>
              <label htmlFor="amount" className="block text-sm">Montant (Ar)</label>
              <input
                id="amount"
                type="number"
                {...register('amount', { required: 'Montant requis', min: { value: 1, message: 'Montant doit être supérieur à 0' } })}
                className="w-full p-2 rounded-lg bg-white/10 text-white border-white/20 text-xs sm:text-sm"
              />
              {errors.amount && <p className="text-red-500 text-xs">{errors.amount.message}</p>}
            </div>
            <div>
              <label htmlFor="date" className="block text-sm">Date</label>
              <input
                id="date"
                type="date"
                {...register('date', { required: 'Date requise' })}
                className="w-full p-2 rounded-lg bg-white/10 text-white border-white/20 text-xs sm:text-sm"
              />
              {errors.date && <p className="text-red-500 text-xs">{errors.date.message}</p>}
            </div>
            <div>
              <label htmlFor="status" className="block text-sm">Statut</label>
              <select
                id="status"
                {...register('status', { required: 'Statut requis' })}
                className="w-full p-2 rounded-lg bg-white/10 text-white border-white/20 text-xs sm:text-sm"
              >
                <option value="" disabled>Sélectionner un statut</option>
                <option value="Validé">Validé</option>
                <option value="Rejeté">Rejeté</option>
                <option value="En attente">En attente</option>
              </select>
              {errors.status && <p className="text-red-500 text-xs">{errors.status.message}</p>}
            </div>
            <div className="flex flex-col sm:flex-row gap-2 justify-end">
              <button type="button" className="text-white bg-gray-600 text-xs sm:text-sm px-3 py-2 rounded" onClick={closeModal}>Annuler</button>
              <button type="submit" className="bg-blue-600 text-white text-xs sm:text-sm px-3 py-2 rounded">Confirmer</button>
            </div>
          </form>
        </div>
      </div>

      {/* Delete Commission Modal */}
      <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 ${modalType === 'delete' && !!selectedCommission ? '' : 'hidden'}`}>
        <div className="bg-gray-800 text-white border border-white/20 rounded-xl w-[90%] sm:w-[500px] p-4 sm:p-6 shadow-xl">
          <h3 className="text-lg font-semibold mb-4">Supprimer la commission</h3>
          <div className="p-4">
            {selectedCommission ? (
              <p>Supprimer la commission de {selectedCommission.amount.toLocaleString()} Ar pour {selectedCommission.user} ?</p>
            ) : (
              <p>Aucune commission sélectionnée.</p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-2 justify-end">
            <button type="button" className="text-white bg-gray-600 text-xs sm:text-sm px-3 py-2 rounded" onClick={closeModal}>Annuler</button>
            <button className="bg-blue-600 text-white text-xs sm:text-sm px-3 py-2 rounded" onClick={onDeleteSubmit} disabled={!selectedCommission}>Confirmer</button>
          </div>
        </div>
      </div>

      {/* Validate Commission Modal */}
      <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 ${modalType === 'validate' && !!selectedCommission ? '' : 'hidden'}`}>
        <div className="bg-gray-800 text-white border border-white/20 rounded-xl w-[90%] sm:w-[500px] p-4 sm:p-6 shadow-xl">
          <h3 className="text-lg font-semibold mb-4">Valider la commission</h3>
          <div className="p-4">
            {selectedCommission ? (
              <p>Valider la commission de {selectedCommission.amount.toLocaleString()} Ar pour {selectedCommission.user} ?</p>
            ) : (
              <p>Aucune commission sélectionnée.</p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-2 justify-end">
            <button type="button" className="text-white bg-gray-600 text-xs sm:text-sm px-3 py-2 rounded" onClick={closeModal}>Annuler</button>
            <button className="bg-blue-600 text-white text-xs sm:text-sm px-3 py-2 rounded" onClick={onValidateSubmit} disabled={!selectedCommission}>Confirmer</button>
          </div>
        </div>
      </div>

      {/* Reject Commission Modal */}
      <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 ${modalType === 'reject' && !!selectedCommission ? '' : 'hidden'}`}>
        <div className="bg-gray-800 text-white border border-white/20 rounded-xl w-[90%] sm:w-[500px] p-4 sm:p-6 shadow-xl">
          <h3 className="text-lg font-semibold mb-4">Rejeter la commission</h3>
          <div className="p-4">
            {selectedCommission ? (
              <p>Rejeter la commission de {selectedCommission.amount.toLocaleString()} Ar pour {selectedCommission.user} ?</p>
            ) : (
              <p>Aucune commission sélectionnée.</p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-2 justify-end">
            <button type="button" className="text-white bg-gray-600 text-xs sm:text-sm px-3 py-2 rounded" onClick={closeModal}>Annuler</button>
            <button className="bg-blue-600 text-white text-xs sm:text-sm px-3 py-2 rounded" onClick={onRejectSubmit} disabled={!selectedCommission}>Confirmer</button>
          </div>
        </div>
      </div>

      {/* Export Commissions Modal */}
      <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 ${modalType === 'export' ? '' : 'hidden'}`}>
        <div className="bg-gray-800 text-white border border-white/20 rounded-xl w-[90%] sm:w-[500px] p-4 sm:p-6 shadow-xl">
          <h3 className="text-lg font-semibold mb-4">Exporter les commissions</h3>
          <form onSubmit={handleSubmit(onExportSubmit)} className="space-y-4">
            <div>
              <label htmlFor="exportFormat" className="block text-sm">Format</label>
              <select
                id="exportFormat"
                {...register('exportFormat', { required: 'Format requis' })}
                className="w-full p-2 rounded-lg bg-white/10 text-white border-white/20 text-xs sm:text-sm"
              >
                <option value="" disabled>Sélectionner un format</option>
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
                className="w-full p-2 rounded-lg bg-white/10 text-white border-white/20 text-xs sm:text-sm"
              />
              {errors.exportStartDate && <p className="text-red-500 text-xs">{errors.exportStartDate.message}</p>}
            </div>
            <div>
              <label htmlFor="exportEndDate" className="block text-sm">Date de fin</label>
              <input
                id="exportEndDate"
                type="date"
                {...register('exportEndDate', { required: 'Date de fin requise' })}
                className="w-full p-2 rounded-lg bg-white/10 text-white border-white/20 text-xs sm:text-sm"
              />
              {errors.exportEndDate && <p className="text-red-500 text-xs">{errors.exportEndDate.message}</p>}
            </div>
            <div className="flex flex-col sm:flex-row gap-2 justify-end">
              <button type="button" className="text-white bg-gray-600 text-xs sm:text-sm px-3 py-2 rounded" onClick={closeModal}>Annuler</button>
              <button type="submit" className="bg-blue-600 text-white text-xs sm:text-sm px-3 py-2 rounded">Exporter</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}