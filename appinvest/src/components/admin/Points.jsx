'use client';

import { useState } from 'react';
import { FaCheck as Check, FaTimes as X, FaDownload as Download } from 'react-icons/fa';
import { useForm } from 'react-hook-form';

export default function Points({ points: initialPoints, handlePointAction }) {
  const [points, setPoints] = useState(initialPoints);
  const [modalType, setModalType] = useState(null);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [filteredPoints, setFilteredPoints] = useState(initialPoints);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const openModal = (type, point) => {
    setModalType(type);
    setSelectedPoint(point);
    reset();
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedPoint(null);
    reset();
  };

  const onValidateSubmit = () => {
    if (selectedPoint) {
      setPoints(points.map(p => p.id === selectedPoint.id ? { ...p, status: 'Validé' } : p));
      setFilteredPoints(filteredPoints.map(p => p.id === selectedPoint.id ? { ...p, status: 'Validé' } : p));
      handlePointAction(selectedPoint.id, 'Valider');
      console.log(`Point ${selectedPoint.id} validated`);
      closeModal();
    }
  };

  const onRejectSubmit = () => {
    if (selectedPoint) {
      setPoints(points.map(p => p.id === selectedPoint.id ? { ...p, status: 'Rejeté' } : p));
      setFilteredPoints(filteredPoints.map(p => p.id === selectedPoint.id ? { ...p, status: 'Rejeté' } : p));
      handlePointAction(selectedPoint.id, 'Rejeter');
      console.log(`Point ${selectedPoint.id} rejected`);
      closeModal();
    }
  };

  const onExportSubmit = (data) => {
    if (data.exportFormat === 'CSV') {
      const csv = filteredPoints.map(p => `${p.id},${p.user.replace(/,/g, '')},${p.amount},${p.date},${p.status}`).join('\n');
      const blob = new Blob([`id,user,amount,date,status\n${csv}`], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `points_${data.exportStartDate}_${data.exportEndDate}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      console.log(`Exporting points as ${data.exportFormat} from ${data.exportStartDate} to ${data.exportEndDate}`);
    }
    closeModal();
  };

  const onFilterSubmit = (data) => {
    let filtered = [...points];
    if (data.filterUser) {
      filtered = filtered.filter(p => p.user.toLowerCase().includes(data.filterUser.toLowerCase()));
    }
    if (data.filterDate) {
      filtered = filtered.filter(p => p.date === data.filterDate);
    }
    setFilteredPoints(filtered);
  };

  return (
    <div className="p-2 sm:p-4">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6">Gestion des points</h2>
      <div className="bg-white/10 backdrop-blur-sm border-white/20 rounded-lg">
        <div className="p-4 sm:p-6">
          <h3 className="text-white text-sm sm:text-lg md:text-xl mb-4">Liste des points</h3>
        </div>
        <div className="p-4 sm:p-6">
          <div className="mb-4 flex flex-col sm:flex-row gap-2">
            <button
              className="bg-yellow-600 text-white text-xs sm:text-sm px-3 py-2 rounded flex items-center"
              onClick={() => openModal('export')}
              aria-label="Exporter les points"
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
                  <th className="p-2 sm:p-3 text-left">Utilisateur</th>
                  <th className="p-2 sm:p-3 text-left">Montant</th>
                  <th className="p-2 sm:p-3 text-left">Date</th>
                  <th className="p-2 sm:p-3 text-left">Statut</th>
                  <th className="p-2 sm:p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPoints.map((point) => (
                  <tr key={point.id} className="border-b border-white/10">
                    <td className="p-2 sm:p-3">{point.user}</td>
                    <td className="p-2 sm:p-3">{point.amount} points</td>
                    <td className="p-2 sm:p-3">{point.date}</td>
                    <td className="p-2 sm:p-3">{point.status}</td>
                    <td className="p-2 sm:p-3 flex flex-wrap gap-1 sm:gap-2">
                      <button
                        className="text-white bg-green-600 border-white/20 hover:bg-white/20 text-xs sm:text-sm px-2 py-1 rounded flex items-center"
                        onClick={() => openModal('validate', point)}
                        aria-label="Valider les points"
                      >
                        <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Valider
                      </button>
                      <button
                        className="text-white bg-red-600 border-white/20 hover:bg-white/20 text-xs sm:text-sm px-2 py-1 rounded flex items-center"
                        onClick={() => openModal('reject', point)}
                        aria-label="Rejeter les points"
                      >
                        <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Rejeter
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Validate Modal */}
      <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 ${modalType === 'validate' && !!selectedPoint ? '' : 'hidden'}`}>
        <div className="bg-gray-800 text-white border border-white/20 rounded-xl w-[90%] sm:w-[500px] p-4 sm:p-6 shadow-xl">
          <h3 className="text-lg font-semibold mb-4">Valider les points</h3>
          <div className="p-4">
            <p>Valider {selectedPoint?.amount} points pour {selectedPoint?.user} ?</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 justify-end">
            <button type="button" className="text-white bg-gray-600 text-xs sm:text-sm px-3 py-2 rounded" onClick={closeModal}>Annuler</button>
            <button className="bg-blue-600 text-white text-xs sm:text-sm px-3 py-2 rounded" onClick={onValidateSubmit}>Confirmer</button>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 ${modalType === 'reject' && !!selectedPoint ? '' : 'hidden'}`}>
        <div className="bg-gray-800 text-white border border-white/20 rounded-xl w-[90%] sm:w-[500px] p-4 sm:p-6 shadow-xl">
          <h3 className="text-lg font-semibold mb-4">Rejeter les points</h3>
          <div className="p-4">
            <p>Rejeter {selectedPoint?.amount} points pour {selectedPoint?.user} ?</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 justify-end">
            <button type="button" className="text-white bg-gray-600 text-xs sm:text-sm px-3 py-2 rounded" onClick={closeModal}>Annuler</button>
            <button className="bg-blue-600 text-white text-xs sm:text-sm px-3 py-2 rounded" onClick={onRejectSubmit}>Confirmer</button>
          </div>
        </div>
      </div>

      {/* Export Points Modal */}
      <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 ${modalType === 'export' ? '' : 'hidden'}`}>
        <div className="bg-gray-800 text-white border border-white/20 rounded-xl w-[90%] sm:w-[500px] p-4 sm:p-6 shadow-xl">
          <h3 className="text-lg font-semibold mb-4">Exporter les points</h3>
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