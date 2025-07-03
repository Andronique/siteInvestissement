'use client';

import { useState } from 'react';
import { FaCheck as Check, FaTimes as X, FaEdit as Edit, FaTrash as Trash, FaPlus as Plus, FaDownload as Download } from 'react-icons/fa';
import { useForm } from 'react-hook-form';

export default function Microtasks({ microtasks: initialMicrotasks, handleMicrotaskAction }) {
  const [microtasks, setMicrotasks] = useState(initialMicrotasks);
  const [filteredMicrotasks, setFilteredMicrotasks] = useState(initialMicrotasks);
  const [modalType, setModalType] = useState(null);
  const [selectedMicrotask, setSelectedMicrotask] = useState(null);
  const [selectedMicrotasks, setSelectedMicrotasks] = useState([]);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

  const openModal = (type, microtask) => {
    setModalType(type);
    setSelectedMicrotask(microtask || null);
    if (microtask && type === 'edit') {
      setValue('user', microtask.user);
      setValue('task', microtask.task);
      setValue('status', microtask.status);
      setValue('date', microtask.date);
    }
    reset(type !== 'edit' ? {} : undefined);
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedMicrotask(null);
    reset();
  };

  const onAddSubmit = (data) => {
    if (data.user && data.task && data.status && data.date) {
      const newMicrotask = {
        id: `task${microtasks.length + 1}`,
        user: data.user,
        task: data.task,
        status: data.status,
        date: data.date,
      };
      setMicrotasks([...microtasks, newMicrotask]);
      setFilteredMicrotasks([...filteredMicrotasks, newMicrotask]);
      handleMicrotaskAction(newMicrotask.id, 'Ajouter');
      console.log(`Microtask added:`, newMicrotask);
      closeModal();
    }
  };

  const onEditSubmit = (data) => {
    if (selectedMicrotask && data.user && data.task && data.status && data.date) {
      const updatedMicrotask = {
        ...selectedMicrotask,
        user: data.user,
        task: data.task,
        status: data.status,
        date: data.date,
      };
      setMicrotasks(microtasks.map(t => t.id === selectedMicrotask.id ? updatedMicrotask : t));
      setFilteredMicrotasks(filteredMicrotasks.map(t => t.id === selectedMicrotask.id ? updatedMicrotask : t));
      handleMicrotaskAction(selectedMicrotask.id, 'Modifier');
      console.log(`Microtask ${selectedMicrotask.id} edited:`, updatedMicrotask);
      closeModal();
    }
  };

  const onDeleteSubmit = () => {
    if (selectedMicrotask) {
      setMicrotasks(microtasks.filter(t => t.id !== selectedMicrotask.id));
      setFilteredMicrotasks(filteredMicrotasks.filter(t => t.id !== selectedMicrotask.id));
      handleMicrotaskAction(selectedMicrotask.id, 'Supprimer');
      console.log(`Microtask ${selectedMicrotask.id} deleted`);
      closeModal();
    }
  };

  const onValidateSubmit = () => {
    if (selectedMicrotask) {
      setMicrotasks(microtasks.map(t => t.id === selectedMicrotask.id ? { ...t, status: 'Validé' } : t));
      setFilteredMicrotasks(filteredMicrotasks.map(t => t.id === selectedMicrotask.id ? { ...t, status: 'Validé' } : t));
      handleMicrotaskAction(selectedMicrotask.id, 'Valider');
      console.log(`Microtask ${selectedMicrotask.id} validated`);
      closeModal();
    }
  };

  const onRejectSubmit = () => {
    if (selectedMicrotask) {
      setMicrotasks(microtasks.map(t => t.id === selectedMicrotask.id ? { ...t, status: 'Rejeté' } : t));
      setFilteredMicrotasks(filteredMicrotasks.map(t => t.id === selectedMicrotask.id ? { ...t, status: 'Rejeté' } : t));
      handleMicrotaskAction(selectedMicrotask.id, 'Rejeter');
      console.log(`Microtask ${selectedMicrotask.id} rejected`);
      closeModal();
    }
  };

  const onBulkValidate = () => {
    setMicrotasks(microtasks.map(t => selectedMicrotasks.includes(t.id) ? { ...t, status: 'Validé' } : t));
    setFilteredMicrotasks(filteredMicrotasks.map(t => selectedMicrotasks.includes(t.id) ? { ...t, status: 'Validé' } : t));
    selectedMicrotasks.forEach(id => handleMicrotaskAction(id, 'Valider'));
    console.log(`Bulk validated microtasks:`, selectedMicrotasks);
    setSelectedMicrotasks([]);
  };

  const onBulkReject = () => {
    setMicrotasks(microtasks.map(t => selectedMicrotasks.includes(t.id) ? { ...t, status: 'Rejeté' } : t));
    setFilteredMicrotasks(filteredMicrotasks.map(t => selectedMicrotasks.includes(t.id) ? { ...t, status: 'Rejeté' } : t));
    selectedMicrotasks.forEach(id => handleMicrotaskAction(id, 'Rejeter'));
    console.log(`Bulk rejected microtasks:`, selectedMicrotasks);
    setSelectedMicrotasks([]);
  };

  const onExportSubmit = (data) => {
    if (data.exportFormat === 'CSV') {
      const csv = filteredMicrotasks.map(t => `${t.id},${t.user},${t.task.replace(/,/g, '')},${t.status},${t.date}`).join('\n');
      const blob = new Blob([`id,user,task,status,date\n${csv}`], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `microtasks_${data.exportStartDate}_${data.exportEndDate}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      console.log(`Exporting microtasks as ${data.exportFormat} from ${data.exportStartDate} to ${data.exportEndDate}`);
    }
    closeModal();
  };

  const onFilterSubmit = (data) => {
    let filtered = [...microtasks];
    if (data.filterUser) {
      filtered = filtered.filter(t => t.user.toLowerCase().includes(data.filterUser.toLowerCase()));
    }
    if (data.filterTask) {
      filtered = filtered.filter(t => t.task.toLowerCase().includes(data.filterTask.toLowerCase()));
    }
    if (data.filterStatus && data.filterStatus !== 'all') {
      filtered = filtered.filter(t => t.status === data.filterStatus);
    }
    if (data.filterDate) {
      filtered = filtered.filter(t => t.date === data.filterDate);
    }
    setFilteredMicrotasks(filtered);
  };

  const sortTable = (field) => {
    const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(direction);
    const sorted = [...filteredMicrotasks].sort((a, b) => {
      const aValue = a[field];
      const bValue = b[field];
      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setFilteredMicrotasks(sorted);
  };

  const toggleSelectMicrotask = (id) => {
    setSelectedMicrotasks(prev =>
      prev.includes(id) ? prev.filter(tid => tid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedMicrotasks.length === filteredMicrotasks.length) {
      setSelectedMicrotasks([]);
    } else {
      setSelectedMicrotasks(filteredMicrotasks.map(t => t.id));
    }
  };

  return (
    <div className="p-2 sm:p-4">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6">Gestion des micro-tâches</h2>
      <div className="bg-white/10 backdrop-blur-sm border-white/20 rounded-lg">
        <div className="p-4 sm:p-6">
          <h3 className="text-white text-sm sm:text-lg md:text-xl mb-4">Liste des micro-tâches</h3>
        </div>
        <div className="p-4 sm:p-6">
          <div className="mb-4 flex flex-col sm:flex-row gap-2">
            <button
              className="bg-green-600 text-white text-xs sm:text-sm px-3 py-2 rounded flex items-center"
              onClick={() => openModal('add')}
              aria-label="Ajouter une micro-tâche"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter une micro-tâche
            </button>
            {selectedMicrotasks.length > 0 && (
              <>
                <button
                  className="bg-blue-600 text-white text-xs sm:text-sm px-3 py-2 rounded flex items-center"
                  onClick={onBulkValidate}
                  aria-label="Valider les micro-tâches sélectionnées"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Valider sélection
                </button>
                <button
                  className="bg-red-600 text-white text-xs sm:text-sm px-3 py-2 rounded flex items-center"
                  onClick={onBulkReject}
                  aria-label="Rejeter les micro-tâches sélectionnées"
                >
                  <X className="w-4 h-4 mr-2" />
                  Rejeter sélection
                </button>
              </>
            )}
            <button
              className="bg-yellow-600 text-white text-xs sm:text-sm px-3 py-2 rounded flex items-center"
              onClick={() => openModal('export')}
              aria-label="Exporter les micro-tâches"
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
            <input
              type="text"
              placeholder="Filtrer par tâche"
              {...register('filterTask')}
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
            <input
              type="date"
              {...register('filterDate')}
              className="p-2 rounded-lg bg-white/10 text-white border-white/20 text-xs sm:text-sm"
            />
            <button type="submit" className="bg-blue-600 text-white text-xs sm:text-sm px-3 py-2 rounded">Filtrer</button>
          </form>
          <div className="overflow-x-auto">
            <table className="w-full text-white text-xs sm:text-sm md:text-base">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="p-2 sm:p-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedMicrotasks.length === filteredMicrotasks.length && filteredMicrotasks.length > 0}
                      onChange={toggleSelectAll}
                      aria-label="Sélectionner toutes les micro-tâches"
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
                    onClick={() => sortTable('task')}
                  >
                    Tâche {sortField === 'task' && (sortDirection === 'asc' ? '↑' : '↓')}
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
                {filteredMicrotasks.map((microtask) => (
                  <tr key={microtask.id} className="border-b border-white/10">
                    <td className="p-2 sm:p-3">
                      <input
                        type="checkbox"
                        checked={selectedMicrotasks.includes(microtask.id)}
                        onChange={() => toggleSelectMicrotask(microtask.id)}
                        aria-label={`Sélectionner la micro-tâche ${microtask.id}`}
                      />
                    </td>
                    <td className="p-2 sm:p-3">{microtask.user}</td>
                    <td className="p-2 sm:p-3">{microtask.task}</td>
                    <td className="p-2 sm:p-3">{microtask.status}</td>
                    <td className="p-2 sm:p-3">{microtask.date}</td>
                    <td className="p-2 sm:p-3 flex flex-wrap gap-1 sm:gap-2">
                      <button
                        className="text-white bg-green-600 border-white/20 hover:bg-white/20 text-xs sm:text-sm px-2 py-1 rounded flex items-center"
                        onClick={() => openModal('validate', microtask)}
                        aria-label="Valider la micro-tâche"
                      >
                        <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Valider
                      </button>
                      <button
                        className="text-white bg-red-600 border-white/20 hover:bg-white/20 text-xs sm:text-sm px-2 py-1 rounded flex items-center"
                        onClick={() => openModal('reject', microtask)}
                        aria-label="Rejeter la micro-tâche"
                      >
                        <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Rejeter
                      </button>
                      <button
                        className="text-white bg-blue-600 border-white/20 hover:bg-white/20 text-xs sm:text-sm px-2 py-1 rounded flex items-center"
                        onClick={() => openModal('edit', microtask)}
                        aria-label="Modifier la micro-tâche"
                      >
                        <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Modifier
                      </button>
                      <button
                        className="text-white bg-yellow-600 border-white/20 hover:bg-white/20 text-xs sm:text-sm px-2 py-1 rounded flex items-center"
                        onClick={() => openModal('delete', microtask)}
                        aria-label="Supprimer la micro-tâche"
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

      {/* Add Microtask Modal */}
      <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 ${modalType === 'add' ? '' : 'hidden'}`}>
        <div className="bg-gray-800 text-white border border-white/20 rounded-xl w-[90%] sm:w-[500px] p-4 sm:p-6 shadow-xl">
          <h3 className="text-lg font-semibold mb-4">Ajouter une micro-tâche</h3>
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
              <label htmlFor="task" className="block text-sm">Tâche</label>
              <input
                id="task"
                {...register('task', { required: 'Tâche requise' })}
                className="w-full p-2 rounded-lg bg-white/10 text-white border-white/20 text-xs sm:text-sm"
              />
              {errors.task && <p className="text-red-500 text-xs">{errors.task.message}</p>}
            </div>
            <div>
              <label htmlFor="status" className="block text-sm">Statut</label>
              <select
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
            <div className="flex flex-col sm:flex-row gap-2 justify-end">
              <button type="button" className="text-white bg-gray-600 text-xs sm:text-sm px-3 py-2 rounded" onClick={closeModal}>Annuler</button>
              <button type="submit" className="bg-blue-600 text-white text-xs sm:text-sm px-3 py-2 rounded">Confirmer</button>
            </div>
          </form>
        </div>
      </div>

      {/* Edit Microtask Modal */}
      <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 ${modalType === 'edit' && !!selectedMicrotask ? '' : 'hidden'}`}>
        <div className="bg-gray-800 text-white border border-white/20 rounded-xl w-[90%] sm:w-[500px] p-4 sm:p-6 shadow-xl">
          <h3 className="text-lg font-semibold mb-4">Modifier la micro-tâche</h3>
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
              <label htmlFor="task" className="block text-sm">Tâche</label>
              <input
                id="task"
                {...register('task', { required: 'Tâche requise' })}
                className="w-full p-2 rounded-lg bg-white/10 text-white border-white/20 text-xs sm:text-sm"
              />
              {errors.task && <p className="text-red-500 text-xs">{errors.task.message}</p>}
            </div>
            <div>
              <label htmlFor="status" className="block text-sm">Statut</label>
              <select
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
            <div className="flex flex-col sm:flex-row gap-2 justify-end">
              <button type="button" className="text-white bg-gray-600 text-xs sm:text-sm px-3 py-2 rounded" onClick={closeModal}>Annuler</button>
              <button type="submit" className="bg-blue-600 text-white text-xs sm:text-sm px-3 py-2 rounded">Confirmer</button>
            </div>
          </form>
        </div>
      </div>

      {/* Delete Microtask Modal */}
      <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 ${modalType === 'delete' && !!selectedMicrotask ? '' : 'hidden'}`}>
        <div className="bg-gray-800 text-white border border-white/20 rounded-xl w-[90%] sm:w-[500px] p-4 sm:p-6 shadow-xl">
          <h3 className="text-lg font-semibold mb-4">Supprimer la micro-tâche</h3>
          <div className="p-4">
            {selectedMicrotask ? (
              <p>Supprimer la micro-tâche "{selectedMicrotask.task}" pour {selectedMicrotask.user} ?</p>
            ) : (
              <p>Aucune micro-tâche sélectionnée.</p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-2 justify-end">
            <button type="button" className="text-white bg-gray-600 text-xs sm:text-sm px-3 py-2 rounded" onClick={closeModal}>Annuler</button>
            <button className="bg-blue-600 text-white text-xs sm:text-sm px-3 py-2 rounded" onClick={onDeleteSubmit} disabled={!selectedMicrotask}>Confirmer</button>
          </div>
        </div>
      </div>

      {/* Validate Microtask Modal */}
      <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 ${modalType === 'validate' && !!selectedMicrotask ? '' : 'hidden'}`}>
        <div className="bg-gray-800 text-white border border-white/20 rounded-xl w-[90%] sm:w-[500px] p-4 sm:p-6 shadow-xl">
          <h3 className="text-lg font-semibold mb-4">Valider la micro-tâche</h3>
          <div className="p-4">
            {selectedMicrotask ? (
              <p>Valider la micro-tâche "{selectedMicrotask.task}" pour {selectedMicrotask.user} ?</p>
            ) : (
              <p>Aucune micro-tâche sélectionnée.</p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-2 justify-end">
            <button type="button" className="text-white bg-gray-600 text-xs sm:text-sm px-3 py-2 rounded" onClick={closeModal}>Annuler</button>
            <button className="bg-blue-600 text-white text-xs sm:text-sm px-3 py-2 rounded" onClick={onValidateSubmit} disabled={!selectedMicrotask}>Confirmer</button>
          </div>
        </div>
      </div>

      {/* Reject Microtask Modal */}
      <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 ${modalType === 'reject' && !!selectedMicrotask ? '' : 'hidden'}`}>
        <div className="bg-gray-800 text-white border border-white/20 rounded-xl w-[90%] sm:w-[500px] p-4 sm:p-6 shadow-xl">
          <h3 className="text-lg font-semibold mb-4">Rejeter la micro-tâche</h3>
          <div className="p-4">
            {selectedMicrotask ? (
              <p>Rejeter la micro-tâche "{selectedMicrotask.task}" pour {selectedMicrotask.user} ?</p>
            ) : (
              <p>Aucune micro-tâche sélectionnée.</p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-2 justify-end">
            <button type="button" className="text-white bg-gray-600 text-xs sm:text-sm px-3 py-2 rounded" onClick={closeModal}>Annuler</button>
            <button className="bg-blue-600 text-white text-xs sm:text-sm px-3 py-2 rounded" onClick={onRejectSubmit} disabled={!selectedMicrotask}>Confirmer</button>
          </div>
        </div>
      </div>

      {/* Export Microtasks Modal */}
      <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 ${modalType === 'export' ? '' : 'hidden'}`}>
        <div className="bg-gray-800 text-white border border-white/20 rounded-xl w-[90%] sm:w-[500px] p-4 sm:p-6 shadow-xl">
          <h3 className="text-lg font-semibold mb-4">Exporter les micro-tâches</h3>
          <form onSubmit={handleSubmit(onExportSubmit)} className="space-y-4">
            <div>
              <label htmlFor="exportFormat" className="block text-sm">Format</label>
              <select
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