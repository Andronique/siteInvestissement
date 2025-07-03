'use client';

import { useState } from 'react';
import { FaCheck as Check, FaTimes as X, FaEdit as Edit, FaTrash as Trash, FaPlus as Plus, FaDownload as Download } from 'react-icons/fa';
import { useForm } from 'react-hook-form';

export default function Plans({ plans: initialPlans, handlePlanAction }) {
  const [plans, setPlans] = useState(initialPlans);
  const [filteredPlans, setFilteredPlans] = useState(initialPlans);
  const [modalType, setModalType] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedPlans, setSelectedPlans] = useState([]);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

  const openModal = (type, plan) => {
    setModalType(type);
    setSelectedPlan(plan || null);
    if (plan && type === 'edit') {
      setValue('name', plan.name);
      setValue('roi', plan.roi);
      setValue('duration', plan.duration);
      setValue('status', plan.status);
    }
    reset(type !== 'edit' ? {} : undefined);
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedPlan(null);
    reset();
  };

  const onAddSubmit = (data) => {
    if (data.name && data.roi && data.duration && data.status) {
      const newPlan = {
        id: `plan${plans.length + 1}`,
        name: data.name,
        roi: data.roi,
        duration: data.duration,
        status: data.status,
      };
      setPlans([...plans, newPlan]);
      setFilteredPlans([...filteredPlans, newPlan]);
      handlePlanAction(newPlan.id, 'Ajouter');
      console.log(`Plan added:`, newPlan);
      closeModal();
    }
  };

  const onEditSubmit = (data) => {
    if (selectedPlan && data.name && data.roi && data.duration && data.status) {
      const updatedPlan = {
        ...selectedPlan,
        name: data.name,
        roi: data.roi,
        duration: data.duration,
        status: data.status,
      };
      setPlans(plans.map(p => p.id === selectedPlan.id ? updatedPlan : p));
      setFilteredPlans(filteredPlans.map(p => p.id === selectedPlan.id ? updatedPlan : p));
      handlePlanAction(selectedPlan.id, 'Modifier');
      console.log(`Plan ${selectedPlan.id} edited:`, updatedPlan);
      closeModal();
    }
  };

  const onDeleteSubmit = () => {
    if (selectedPlan) {
      setPlans(plans.filter(p => p.id !== selectedPlan.id));
      setFilteredPlans(filteredPlans.filter(p => p.id !== selectedPlan.id));
      handlePlanAction(selectedPlan.id, 'Supprimer');
      console.log(`Plan ${selectedPlan.id} deleted`);
      closeModal();
    }
  };

  const onToggleSubmit = () => {
    if (selectedPlan) {
      const newStatus = selectedPlan.status === 'Actif' ? 'Désactivé' : 'Actif';
      setPlans(plans.map(p => p.id === selectedPlan.id ? { ...p, status: newStatus } : p));
      setFilteredPlans(filteredPlans.map(p => p.id === selectedPlan.id ? { ...p, status: newStatus } : p));
      handlePlanAction(selectedPlan.id, newStatus === 'Actif' ? 'Activer' : 'Désactiver');
      console.log(`Plan ${selectedPlan.id} ${newStatus}`);
      closeModal();
    }
  };

  const onBulkToggle = (action) => {
    const newStatus = action === 'Activer' ? 'Actif' : 'Désactivé';
    setPlans(plans.map(p => selectedPlans.includes(p.id) ? { ...p, status: newStatus } : p));
    setFilteredPlans(filteredPlans.map(p => selectedPlans.includes(p.id) ? { ...p, status: newStatus } : p));
    selectedPlans.forEach(id => handlePlanAction(id, action));
    console.log(`Bulk ${action.toLowerCase()} plans:`, selectedPlans);
    setSelectedPlans([]);
  };

  const onExportSubmit = (data) => {
    if (data.exportFormat === 'CSV') {
      const csv = filteredPlans.map(p => `${p.id},${p.name.replace(/,/g, '')},${p.roi},${p.duration.replace(/,/g, '')},${p.status}`).join('\n');
      const blob = new Blob([`id,name,roi,duration,status\n${csv}`], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `plans_${data.exportStartDate}_${data.exportEndDate}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      console.log(`Exporting plans as ${data.exportFormat} from ${data.exportStartDate} to ${data.exportEndDate}`);
    }
    closeModal();
  };

  const onFilterSubmit = (data) => {
    let filtered = [...plans];
    if (data.filterName) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(data.filterName.toLowerCase()));
    }
    if (data.filterROI) {
      filtered = filtered.filter(p => parseFloat(p.roi) >= data.filterROI);
    }
    if (data.filterDuration) {
      filtered = filtered.filter(p => p.duration.toLowerCase().includes(data.filterDuration.toLowerCase()));
    }
    if (data.filterStatus && data.filterStatus !== 'all') {
      filtered = filtered.filter(p => p.status === data.filterStatus);
    }
    setFilteredPlans(filtered);
  };

  const sortTable = (field) => {
    const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(direction);
    const sorted = [...filteredPlans].sort((a, b) => {
      const aValue = field === 'roi' ? parseFloat(a[field]) : a[field];
      const bValue = field === 'roi' ? parseFloat(b[field]) : b[field];
      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setFilteredPlans(sorted);
  };

  const toggleSelectPlan = (id) => {
    setSelectedPlans(prev =>
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedPlans.length === filteredPlans.length) {
      setSelectedPlans([]);
    } else {
      setSelectedPlans(filteredPlans.map(p => p.id));
    }
  };

  return (
    <div className="p-2 sm:p-4">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6">Gestion des plans d'investissement</h2>
      <div className="bg-white/10 backdrop-blur-sm border-white/20 rounded-lg">
        <div className="p-4 sm:p-6">
          <h3 className="text-white text-sm sm:text-lg md:text-xl mb-4">Liste des plans</h3>
        </div>
        <div className="p-4 sm:p-6">
          <div className="mb-4 flex flex-col sm:flex-row gap-2">
            <button
              className="bg-green-500 text-white text-xs sm:text-sm px-3 py-2 rounded flex items-center"
              onClick={() => openModal('add')}
              aria-label="Ajouter un plan"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un plan
            </button>
            {selectedPlans.length > 0 && (
              <>
                <button
                  className="bg-blue-600 text-white text-xs sm:text-sm px-3 py-2 rounded flex items-center"
                  onClick={() => onBulkToggle('Activer')}
                  aria-label="Activer les plans sélectionnés"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Activer sélection
                </button>
                <button
                  className="bg-red-600 text-white text-xs sm:text-sm px-3 py-2 rounded flex items-center"
                  onClick={() => onBulkToggle('Désactiver')}
                  aria-label="Désactiver les plans sélectionnés"
                >
                  <X className="w-4 h-4 mr-2" />
                  Désactiver sélection
                </button>
              </>
            )}
            <button
              className="bg-yellow-600 text-white text-xs sm:text-sm px-3 py-2 rounded flex items-center"
              onClick={() => openModal('export')}
              aria-label="Exporter les plans"
            >
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </button>
          </div>
          <form onSubmit={handleSubmit(onFilterSubmit)} className="mb-4 flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Filtrer par nom"
              {...register('filterName')}
              className="p-2 rounded-lg bg-white/10 text-white border-white/20 text-xs sm:text-sm"
            />
            <input
              type="number"
              placeholder="ROI minimum (%)"
              {...register('filterROI')}
              className="p-2 rounded-lg bg-white/10 text-white border-white/20 text-xs sm:text-sm"
            />
            <input
              type="text"
              placeholder="Filtrer par durée"
              {...register('filterDuration')}
              className="p-2 rounded-lg bg-white/10 text-white border-white/20 text-xs sm:text-sm"
            />
            <select
              {...register('filterStatus')}
              className="p-2 rounded-lg bg-white/10 text-white border-white/20 text-xs sm:text-sm"
            >
              <option value="all">Tous</option>
              <option value="Actif">Actif</option>
              <option value="Désactivé">Désactivé</option>
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
                      checked={selectedPlans.length === filteredPlans.length && filteredPlans.length > 0}
                      onChange={toggleSelectAll}
                      aria-label="Sélectionner tous les plans"
                    />
                  </th>
                  <th
                    className="p-2 sm:p-3 text-left cursor-pointer"
                    onClick={() => sortTable('name')}
                  >
                    Nom {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className="p-2 sm:p-3 text-left cursor-pointer"
                    onClick={() => sortTable('roi')}
                  >
                    ROI {sortField === 'roi' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className="p-2 sm:p-3 text-left cursor-pointer"
                    onClick={() => sortTable('duration')}
                  >
                    Durée {sortField === 'duration' && (sortDirection === 'asc' ? '↑' : '↓')}
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
                {filteredPlans.map((plan) => (
                  <tr key={plan.id} className="border-b border-white/10">
                    <td className="p-2 sm:p-3">
                      <input
                        type="checkbox"
                        checked={selectedPlans.includes(plan.id)}
                        onChange={() => toggleSelectPlan(plan.id)}
                        aria-label={`Sélectionner le plan ${plan.name}`}
                      />
                    </td>
                    <td className="p-2 sm:p-3">{plan.name}</td>
                    <td className="p-2 sm:p-3">{plan.roi}</td>
                    <td className="p-2 sm:p-3">{plan.duration}</td>
                    <td className="p-2 sm:p-3">{plan.status}</td>
                    <td className="p-2 sm:p-3 flex flex-wrap gap-1 sm:gap-2">
                      <button
                        className="text-white bg-yellow-600 border-white/20 hover:bg-white/20 text-xs sm:text-sm px-2 py-1 rounded flex items-center"
                        onClick={() => openModal('toggle', plan)}
                        aria-label={plan.status === 'Actif' ? 'Désactiver le plan' : 'Activer le plan'}
                      >
                        {plan.status === 'Actif' ? <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1" /> : <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />}
                        {plan.status === 'Actif' ? 'Désactiver' : 'Activer'}
                      </button>
                      <button
                        className="text-white bg-blue-600 border-white/20 hover:bg-white/20 text-xs sm:text-sm px-2 py-1 rounded flex items-center"
                        onClick={() => openModal('edit', plan)}
                        aria-label="Modifier le plan"
                      >
                        <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Modifier
                      </button>
                      <button
                        className="text-white bg-red-600 border-white/20 hover:bg-white/20 text-xs sm:text-sm px-2 py-1 rounded flex items-center"
                        onClick={() => openModal('delete', plan)}
                        aria-label="Supprimer le plan"
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

      {/* Add Plan Modal */}
      <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 ${modalType === 'add' ? '' : 'hidden'}`}>
        <div className="bg-gray-800 text-white border border-white/20 rounded-xl w-[90%] sm:w-[500px] p-4 sm:p-6 shadow-xl">
          <h3 className="text-lg font-semibold mb-4">Ajouter un plan</h3>
          <form onSubmit={handleSubmit(onAddSubmit)} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm">Nom</label>
              <input
                id="name"
                {...register('name', { required: 'Nom requis' })}
                className="w-full p-2 rounded-lg bg-white/10 text-white border-white/20 text-xs sm:text-sm"
              />
              {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
            </div>
            <div>
              <label htmlFor="roi" className="block text-sm">ROI (%)</label>
              <input
                id="roi"
                type="text"
                {...register('roi', {
                  required: 'ROI requis',
                  pattern: { value: /^\d+(\.\d+)?%$/, message: 'Format: nombre suivi de % (ex: 5%)' }
                })}
                className="w-full p-2 rounded-lg bg-white/10 text-white border-white/20 text-xs sm:text-sm"
              />
              {errors.roi && <p className="text-red-500 text-xs">{errors.roi.message}</p>}
            </div>
            <div>
              <label htmlFor="duration" className="block text-sm">Durée</label>
              <input
                id="duration"
                {...register('duration', { required: 'Durée requise' })}
                className="w-full p-2 rounded-lg bg-white/10 text-white border-white/20 text-xs sm:text-sm"
              />
              {errors.duration && <p className="text-red-500 text-xs">{errors.duration.message}</p>}
            </div>
            <div>
              <label htmlFor="status" className="block text-sm">Statut</label>
              <select
                {...register('status', { required: 'Statut requis' })}
                className="w-full p-2 rounded-lg bg-white/10 text-white border-white/20 text-xs sm:text-sm"
              >
                <option value="" disabled>Sélectionner un statut</option>
                <option value="Actif">Actif</option>
                <option value="Désactivé">Désactivé</option>
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

      {/* Edit Plan Modal */}
      <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 ${modalType === 'edit' && !!selectedPlan ? '' : 'hidden'}`}>
        <div className="bg-gray-800 text-white border border-white/20 rounded-xl w-[90%] sm:w-[500px] p-4 sm:p-6 shadow-xl">
          <h3 className="text-lg font-semibold mb-4">Modifier le plan</h3>
          <form onSubmit={handleSubmit(onEditSubmit)} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm">Nom</label>
              <input
                id="name"
                {...register('name', { required: 'Nom requis' })}
                className="w-full p-2 rounded-lg bg-white/10 text-white border-white/20 text-xs sm:text-sm"
              />
              {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
            </div>
            <div>
              <label htmlFor="roi" className="block text-sm">ROI (%)</label>
              <input
                id="roi"
                type="text"
                {...register('roi', {
                  required: 'ROI requis',
                  pattern: { value: /^\d+(\.\d+)?%$/, message: 'Format: nombre suivi de % (ex: 5%)' }
                })}
                className="w-full p-2 rounded-lg bg-white/10 text-white border-white/20 text-xs sm:text-sm"
              />
              {errors.roi && <p className="text-red-500 text-xs">{errors.roi.message}</p>}
            </div>
            <div>
              <label htmlFor="duration" className="block text-sm">Durée</label>
              <input
                id="duration"
                {...register('duration', { required: 'Durée requise' })}
                className="w-full p-2 rounded-lg bg-white/10 text-white border-white/20 text-xs sm:text-sm"
              />
              {errors.duration && <p className="text-red-500 text-xs">{errors.duration.message}</p>}
            </div>
            <div>
              <label htmlFor="status" className="block text-sm">Statut</label>
              <select
                {...register('status', { required: 'Statut requis' })}
                className="w-full p-2 rounded-lg bg-white/10 text-white border-white/20 text-xs sm:text-sm"
              >
                <option value="" disabled>Sélectionner un statut</option>
                <option value="Actif">Actif</option>
                <option value="Désactivé">Désactivé</option>
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

      {/* Delete Plan Modal */}
      <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 ${modalType === 'delete' && !!selectedPlan ? '' : 'hidden'}`}>
        <div className="bg-gray-800 text-white border border-white/20 rounded-xl w-[90%] sm:w-[500px] p-4 sm:p-6 shadow-xl">
          <h3 className="text-lg font-semibold mb-4">Supprimer le plan</h3>
          <div className="p-4">
            <p>Supprimer le plan {selectedPlan?.name} ?</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 justify-end">
            <button type="button" className="text-white bg-gray-600 text-xs sm:text-sm px-3 py-2 rounded" onClick={closeModal}>Annuler</button>
            <button className="bg-blue-600 text-white text-xs sm:text-sm px-3 py-2 rounded" onClick={onDeleteSubmit}>Confirmer</button>
          </div>
        </div>
      </div>

      {/* Toggle Status Modal */}
      <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 ${modalType === 'toggle' && !!selectedPlan ? '' : 'hidden'}`}>
        <div className="bg-gray-800 text-white border border-white/20 rounded-xl w-[90%] sm:w-[500px] p-4 sm:p-6 shadow-xl">
          <h3 className="text-lg font-semibold mb-4">{selectedPlan?.status === 'Actif' ? 'Désactiver' : 'Activer'} le plan</h3>
          <div className="p-4">
            <p>{selectedPlan?.status === 'Actif' ? 'Désactiver' : 'Activer'} le plan {selectedPlan?.name} ?</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 justify-end">
            <button type="button" className="text-white bg-gray-600 text-xs sm:text-sm px-3 py-2 rounded" onClick={closeModal}>Annuler</button>
            <button className="bg-blue-600 text-white text-xs sm:text-sm px-3 py-2 rounded" onClick={onToggleSubmit}>Confirmer</button>
          </div>
        </div>
      </div>

      {/* Export Plans Modal */}
      <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 ${modalType === 'export' ? '' : 'hidden'}`}>
        <div className="bg-gray-800 text-white border border-white/20 rounded-xl w-[90%] sm:w-[500px] p-4 sm:p-6 shadow-xl">
          <h3 className="text-lg font-semibold mb-4">Exporter les plans</h3>
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