
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaCheck, FaEdit, FaTrash, FaPlus, FaDownload } from 'react-icons/fa';

const Settings = ({ handleSettingUpdate }) => {
  const [settings, setSettings] = useState([
    { id: 'notifications', name: 'Activer les notifications', value: false, description: 'Envoie des notifications aux utilisateurs', lastModified: new Date().toISOString().split('T')[0] },
    { id: 'autoDeposits', name: 'Autoriser les dépôts automatiques', value: false, description: 'Permet les dépôts sans validation manuelle', lastModified: new Date().toISOString().split('T')[0] },
    { id: 'twoFactorAuth', name: 'Activer la 2FA pour les admins', value: false, description: 'Sécurise les comptes admin avec 2FA', lastModified: new Date().toISOString().split('T')[0] },
  ]);
  const [filteredSettings, setFilteredSettings] = useState(settings);
  const [modalType, setModalType] = useState(null);
  const [selectedSetting, setSelectedSetting] = useState(null);
  const [selectedSettingsIds, setSelectedSettingsIds] = useState([]);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

  const openModal = (type, setting) => {
    setModalType(type);
    setSelectedSetting(setting || null);
    if (setting && type === 'edit') {
      setValue('name', setting.name);
      setValue('value', setting.value);
      setValue('description', setting.description || '');
    }
    reset(type !== 'edit' ? {} : undefined);
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedSetting(null);
    reset();
  };

  const onAddSubmit = (data) => {
    if (data.name) {
      const newSetting = {
        id: `setting${settings.length + 1}`,
        name: data.name,
        value: data.value ?? false,
        description: data.description,
        lastModified: new Date().toISOString().split('T')[0],
      };
      setSettings([...settings, newSetting]);
      setFilteredSettings([...filteredSettings, newSetting]);
      handleSettingUpdate(newSetting.id, newSetting.value);
      console.log(`Setting added:`, newSetting);
      closeModal();
    }
  };

  const onEditSubmit = (data) => {
    if (selectedSetting && data.name) {
      const updatedSetting = {
        ...selectedSetting,
        name: data.name,
        value: data.value ?? selectedSetting.value,
        description: data.description,
        lastModified: new Date().toISOString().split('T')[0],
      };
      setSettings(settings.map(s => s.id === selectedSetting.id ? updatedSetting : s));
      setFilteredSettings(filteredSettings.map(s => s.id === selectedSetting.id ? updatedSetting : s));
      handleSettingUpdate(selectedSetting.id, updatedSetting.value);
      console.log(`Setting ${selectedSetting.id} edited:`, updatedSetting);
      closeModal();
    }
  };

  const onResetSubmit = () => {
    if (selectedSetting) {
      const updatedSetting = {
        ...selectedSetting,
        value: false,
        lastModified: new Date().toISOString().split('T')[0],
      };
      setSettings(settings.map(s => s.id === selectedSetting.id ? updatedSetting : s));
      setFilteredSettings(filteredSettings.map(s => s.id === selectedSetting.id ? updatedSetting : s));
      handleSettingUpdate(selectedSetting.id, updatedSetting.value);
      console.log(`Setting ${selectedSetting.id} reset to default`);
      closeModal();
    }
  };

  const onBulkEnable = () => {
    setSettings(settings.map(s => selectedSettingsIds.includes(s.id) ? { ...s, value: true, lastModified: new Date().toISOString().split('T')[0] } : s));
    setFilteredSettings(filteredSettings.map(s => selectedSettingsIds.includes(s.id) ? { ...s, value: true, lastModified: new Date().toISOString().split('T')[0] } : s));
    selectedSettingsIds.forEach(id => handleSettingUpdate(id, true));
    console.log(`Bulk enabled settings:`, selectedSettingsIds);
    setSelectedSettingsIds([]);
  };

  const onBulkDisable = () => {
    setSettings(settings.map(s => selectedSettingsIds.includes(s.id) ? { ...s, value: false, lastModified: new Date().toISOString().split('T')[0] } : s));
    setFilteredSettings(filteredSettings.map(s => selectedSettingsIds.includes(s.id) ? { ...s, value: false, lastModified: new Date().toISOString().split('T')[0] } : s));
    selectedSettingsIds.forEach(id => handleSettingUpdate(id, false));
    console.log(`Bulk disabled settings:`, selectedSettingsIds);
    setSelectedSettingsIds([]);
  };

  const onExportSubmit = (data) => {
    if (data.exportFormat === 'CSV') {
      const csv = filteredSettings.map(s => `${s.id},${s.name},${s.value},${s.description || ''},${s.lastModified}`).join('\n');
      const blob = new Blob([`id,name,value,description,lastModified\n${csv}`], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `settings_${data.exportStartDate}_${data.exportEndDate}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      console.log(`Exporting settings as ${data.exportFormat} from ${data.exportStartDate} to ${data.exportEndDate}`);
    }
    closeModal();
  };

  const onFilterSubmit = (data) => {
    let filtered = [...settings];
    if (data.filterName) {
      filtered = filtered.filter(s => s.name.toLowerCase().includes(data.filterName.toLowerCase()));
    }
    if (data.filterStatus && data.filterStatus !== 'all') {
      filtered = filtered.filter(s => s.value === (data.filterStatus === 'enabled'));
    }
    setFilteredSettings(filtered);
  };

  const sortTable = (field) => {
    const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(direction);
    const sorted = [...filteredSettings].sort((a, b) => {
      const aValue = field === 'value' ? a[field] : a[field] || '';
      const bValue = field === 'value' ? b[field] : b[field] || '';
      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setFilteredSettings(sorted);
  };

  const toggleSelectSetting = (id) => {
    setSelectedSettingsIds(prev =>
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedSettingsIds.length === filteredSettings.length) {
      setSelectedSettingsIds([]);
    } else {
      setSelectedSettingsIds(filteredSettings.map(s => s.id));
    }
  };

  return (
    <div className="p-2 sm:p-4">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6">Réglages système</h2>
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg">
        <div className="p-4">
          <h3 className="text-white text-sm sm:text-lg md:text-xl">Paramètres système</h3>
        </div>
        <div className="p-4">
          <div className="mb-4 flex flex-col sm:flex-row gap-2">
            <button
              className="bg-green-600 text-white px-4 py-2 rounded text-xs sm:text-sm flex items-center"
              onClick={() => openModal('add')}
              aria-label="Ajouter un paramètre"
            >
              <FaPlus className="w-4 h-4 mr-2" />
              Ajouter un paramètre
            </button>
            {selectedSettingsIds.length > 0 && (
              <>
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded text-xs sm:text-sm flex items-center"
                  onClick={onBulkEnable}
                  aria-label="Activer les paramètres sélectionnés"
                >
                  <FaCheck className="w-4 h-4 mr-2" />
                  Activer sélection
                </button>
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded text-xs sm:text-sm flex items-center"
                  onClick={onBulkDisable}
                  aria-label="Désactiver les paramètres sélectionnés"
                >
                  <FaTrash className="w-4 h-4 mr-2" />
                  Désactiver sélection
                </button>
              </>
            )}
            <button
              className="bg-yellow-600 text-white px-4 py-2 rounded text-xs sm:text-sm flex items-center"
              onClick={() => openModal('export')}
              aria-label="Exporter les paramètres"
            >
              <FaDownload className="w-4 h-4 mr-2" />
              Exporter
            </button>
          </div>
          <div className="mb-4 flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Filtrer par nom"
              {...register('filterName')}
              className="p-2 rounded-lg bg-white/10 text-white border border-white/20 text-xs sm:text-sm"
            />
            <select
              {...register('filterStatus')}
              className="p-2 rounded-lg bg-white/10 text-white border border-white/20 text-xs sm:text-sm"
            >
              <option value="all">Tous</option>
              <option value="enabled">Activé</option>
              <option value="disabled">Désactivé</option>
            </select>
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
                      checked={selectedSettingsIds.length === filteredSettings.length && filteredSettings.length > 0}
                      onChange={toggleSelectAll}
                      aria-label="Sélectionner tous les paramètres"
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
                    onClick={() => sortTable('value')}
                  >
                    Statut {sortField === 'value' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="p-2 sm:p-3 text-left">Description</th>
                  <th
                    className="p-2 sm:p-3 text-left cursor-pointer"
                    onClick={() => sortTable('lastModified')}
                  >
                    Dernière modification {sortField === 'lastModified' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="p-2 sm:p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSettings.map((setting) => (
                  <tr key={setting.id} className="border-b border-white/10">
                    <td className="p-2 sm:p-3">
                      <input
                        type="checkbox"
                        checked={selectedSettingsIds.includes(setting.id)}
                        onChange={() => toggleSelectSetting(setting.id)}
                        aria-label={`Sélectionner le paramètre ${setting.name}`}
                      />
                    </td>
                    <td className="p-2 sm:p-3">{setting.name}</td>
                    <td className="p-2 sm:p-3">
                      <input
                        type="checkbox"
                        checked={setting.value}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          const updatedSetting = { ...setting, value: checked, lastModified: new Date().toISOString().split('T')[0] };
                          setSettings(settings.map(s => s.id === setting.id ? updatedSetting : s));
                          setFilteredSettings(filteredSettings.map(s => s.id === setting.id ? updatedSetting : s));
                          handleSettingUpdate(setting.id, checked);
                          console.log(`Setting ${setting.id} updated to ${checked}`);
                        }}
                        aria-label={`Activer/Désactiver ${setting.name}`}
                      />
                    </td>
                    <td className="p-2 sm:p-3">{setting.description || '-'}</td>
                    <td className="p-2 sm:p-3">{setting.lastModified}</td>
                    <td className="p-2 sm:p-3 flex flex-wrap gap-1 sm:gap-2">
                      <button
                        className="text-white bg-blue-600 border border-white/20 hover:bg-white/20 px-2 py-1 rounded text-xs sm:text-sm flex items-center"
                        onClick={() => openModal('edit', setting)}
                        aria-label={`Modifier le paramètre ${setting.name}`}
                      >
                        <FaEdit className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Modifier
                      </button>
                      <button
                        className="text-white bg-yellow-600 border border-white/20 hover:bg-white/20 px-2 py-1 rounded text-xs sm:text-sm flex items-center"
                        onClick={() => openModal('reset', setting)}
                        aria-label={`Réinitialiser le paramètre ${setting.name}`}
                      >
                        <FaTrash className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Réinitialiser
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Setting Modal */}
      {modalType === 'add' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 text-white border border-white/20 rounded-xl w-[90%] sm:w-[500px] p-4 sm:p-6 shadow-xl">
            <h3 className="text-lg font-bold mb-4">Ajouter un paramètre</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm">Nom</label>
                <input
                  id="name"
                  {...register('name', { required: 'Nom requis' })}
                  className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/20 text-xs sm:text-sm"
                />
                {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
              </div>
              <div>
                <label htmlFor="value" className="block text-sm">Statut</label>
                <input
                  type="checkbox"
                  {...register('value')}
                  onChange={(e) => setValue('value', e.target.checked)}
                  aria-label="Activer/Désactiver le nouveau paramètre"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm">Description</label>
                <input
                  id="description"
                  {...register('description')}
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

      {/* Edit Setting Modal */}
      {modalType === 'edit' && selectedSetting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 text-white border border-white/20 rounded-xl w-[90%] sm:w-[500px] p-4 sm:p-6 shadow-xl">
            <h3 className="text-lg font-bold mb-4">Modifier le paramètre</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm">Nom</label>
                <input
                  id="name"
                  {...register('name', { required: 'Nom requis' })}
                  className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/20 text-xs sm:text-sm"
                />
                {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
              </div>
              <div>
                <label htmlFor="value" className="block text-sm">Statut</label>
                <input
                  type="checkbox"
                  {...register('value')}
                  onChange={(e) => setValue('value', e.target.checked)}
                  defaultChecked={selectedSetting.value}
                  aria-label="Activer/Désactiver le paramètre"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm">Description</label>
                <input
                  id="description"
                  {...register('description')}
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

      {/* Reset Setting Modal */}
      {modalType === 'reset' && selectedSetting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 text-white border border-white/20 rounded-xl w-[90%] sm:w-[500px] p-4 sm:p-6 shadow-xl">
            <h3 className="text-lg font-bold mb-4">Réinitialiser le paramètre</h3>
            <div className="p-4">
              <p>Réinitialiser le paramètre "{selectedSetting.name}" à sa valeur par défaut (Désactivé) ?</p>
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
                onClick={onResetSubmit}
                disabled={!selectedSetting}
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Settings Modal */}
      {modalType === 'export' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 text-white border border-white/20 rounded-xl w-[90%] sm:w-[500px] p-4 sm:p-6 shadow-xl">
            <h3 className="text-lg font-bold mb-4">Exporter les paramètres</h3>
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

export default Settings;