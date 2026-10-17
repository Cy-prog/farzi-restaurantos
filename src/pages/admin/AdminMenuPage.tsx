import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, X, Sparkles, Image, Flame, ShieldAlert } from 'lucide-react';
import { MenuItem, MenuCategory, SpiceLevel } from '../../types';
import { api } from '../../services/api';
import { Button } from '../../components/ui/Button';
import { VegBadge, NonVegBadge, ChefSpecialBadge, SpiceBadge } from '../../components/ui/Badge';
import { ImageWithFallback } from '../../components/ui/ImageWithFallback';

export const AdminMenuPage: React.FC = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  const [formData, setFormData] = useState<Partial<MenuItem>>({
    name: '',
    categoryId: 1,
    price: 450,
    description: '',
    imageUrl: '',
    ingredients: '',
    allergens: '',
    spiceLevel: 'NONE',
    isVeg: true,
    isAvailable: true,
    isChefSpecial: false,
    calories: 350,
    preparationTimeMinutes: 15
  });

  const loadData = async () => {
    try {
      const [menuData, catData] = await Promise.all([
        api.getAdminMenu(),
        api.getCategories()
      ]);
      setItems(menuData);
      setCategories(catData);
    } catch (err) {
      console.error('Failed to load menu items:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      categoryId: categories[0]?.id || 1,
      price: 495,
      description: '',
      imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=1200&auto=format&fit=crop',
      ingredients: '',
      allergens: '',
      spiceLevel: 'NONE',
      isVeg: true,
      isAvailable: true,
      isChefSpecial: false,
      calories: 350,
      preparationTimeMinutes: 15
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setFormData(item);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      alert('Please enter a dish name.');
      return;
    }
    const priceNum = Number(formData.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      alert('Please specify a valid positive price in INR.');
      return;
    }

    try {
      if (editingItem) {
        await api.updateMenuItem(editingItem.id, {
          ...formData,
          price: priceNum
        });
      } else {
        await api.createMenuItem({
          ...formData,
          price: priceNum
        });
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      alert('Failed to save menu item. Please check server status.');
      console.error(err);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}" from the menu?`)) {
      try {
        await api.deleteMenuItem(id);
        loadData();
      } catch (err) {
        alert('Failed to delete item');
        console.error(err);
      }
    }
  };

  const handleToggleAvailability = async (item: MenuItem) => {
    try {
      await api.updateMenuItem(item.id, { isAvailable: !item.isAvailable });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleSpecial = async (item: MenuItem) => {
    try {
      await api.updateMenuItem(item.id, { isChefSpecial: !item.isChefSpecial });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredItems = items.filter(i => {
    if (selectedCategory === 'all') return true;
    return i.categoryId === Number(selectedCategory);
  });

  return (
    <div className="p-6 sm:p-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-charcoal-800">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400 font-semibold">
            Catalog Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-ivory-50 mt-0.5">
            Culinary Menu Items Studio
          </h1>
        </div>

        <Button onClick={openCreateModal} variant="gold" size="md" icon={<Plus className="w-4 h-4" />}>
          Create New Creation
        </Button>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all ${
            selectedCategory === 'all'
              ? 'bg-gold-500 text-charcoal-950 font-bold'
              : 'bg-charcoal-900 text-ivory-300 border border-charcoal-800 hover:bg-charcoal-800'
          }`}
        >
          All Categories ({items.length})
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(String(c.id))}
            className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all ${
              selectedCategory === String(c.id)
                ? 'bg-gold-500 text-charcoal-950 font-bold'
                : 'bg-charcoal-900 text-ivory-300 border border-charcoal-800 hover:bg-charcoal-800'
            }`}
          >
            {c.name} ({items.filter(i => i.categoryId === c.id).length})
          </button>
        ))}
      </div>

      {/* Items Table / Cards */}
      {isLoading ? (
        <div className="p-12 text-center text-charcoal-400 font-mono text-xs">
          Loading menu catalog...
        </div>
      ) : (
        <div className="bg-charcoal-900 border border-charcoal-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-charcoal-950 text-charcoal-400 uppercase font-mono tracking-wider border-b border-charcoal-800">
                <tr>
                  <th className="p-4">Dish</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Diet & Spice</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-center">Chef Pick</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-800/80">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-charcoal-850/50 transition-colors">
                    {/* Dish & Image */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <ImageWithFallback
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-12 h-12 rounded-lg object-cover bg-charcoal-950 flex-shrink-0 border border-charcoal-800"
                        />
                        <div>
                          <p className="font-serif font-bold text-sm text-ivory-100">{item.name}</p>
                          <p className="text-[11px] text-charcoal-400 line-clamp-1 max-w-xs">{item.description}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="p-4 font-mono text-gold-400">
                      {item.categoryName || 'Tapas'}
                    </td>

                    {/* Price */}
                    <td className="p-4 font-serif font-bold text-gold-300 text-sm">
                      ₹{item.price}
                    </td>

                    {/* Badges */}
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {item.isVeg ? <VegBadge /> : <NonVegBadge />}
                        {item.spiceLevel !== 'NONE' && <SpiceBadge level={item.spiceLevel} />}
                      </div>
                    </td>

                    {/* Availability Switch */}
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleToggleAvailability(item)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold transition-colors ${
                          item.isAvailable
                            ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/50 hover:bg-emerald-900/60'
                            : 'bg-charcoal-800 text-charcoal-500 border border-charcoal-700 hover:bg-charcoal-700'
                        }`}
                      >
                        {item.isAvailable ? 'Available' : 'Sold Out'}
                      </button>
                    </td>

                    {/* Chef Special Switch */}
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleToggleSpecial(item)}
                        className={`p-1.5 rounded-full transition-colors ${
                          item.isChefSpecial
                            ? 'text-gold-400 bg-gold-500/10 border border-gold-500/40 hover:bg-gold-500/20'
                            : 'text-charcoal-600 hover:text-charcoal-400'
                        }`}
                        title="Toggle Chef Special"
                      >
                        <Sparkles className="w-4 h-4" />
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 rounded text-charcoal-400 hover:text-gold-300 hover:bg-charcoal-800 transition-colors"
                          title="Edit Dish"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.name)}
                          className="p-1.5 rounded text-charcoal-400 hover:text-rose-400 hover:bg-charcoal-800 transition-colors"
                          title="Delete Dish"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-charcoal-900 border border-charcoal-700 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-charcoal-800">
              <h3 className="font-serif font-bold text-xl text-ivory-50">
                {editingItem ? 'Edit Culinary Creation' : 'Create New Menu Dish'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-charcoal-400 hover:text-white rounded-full hover:bg-charcoal-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-ivory-400 mb-1">
                    Dish Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-charcoal-850 border border-charcoal-700 text-sm text-ivory-100 focus:outline-none focus:border-gold-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-ivory-400 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.categoryId || 1}
                    onChange={(e) => setFormData({ ...formData, categoryId: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-charcoal-850 border border-charcoal-700 text-sm text-ivory-100 focus:outline-none focus:border-gold-500/50"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-ivory-400 mb-1">
                    Price (INR) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.price || 0}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-charcoal-850 border border-charcoal-700 text-sm text-ivory-100 focus:outline-none focus:border-gold-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-ivory-400 mb-1">
                    Diet Classification
                  </label>
                  <select
                    value={formData.isVeg ? 'veg' : 'non-veg'}
                    onChange={(e) => setFormData({ ...formData, isVeg: e.target.value === 'veg' })}
                    className="w-full px-3 py-2 rounded-xl bg-charcoal-850 border border-charcoal-700 text-sm text-ivory-100 focus:outline-none focus:border-gold-500/50"
                  >
                    <option value="veg">Vegetarian</option>
                    <option value="non-veg">Non-Vegetarian</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-ivory-400 mb-1">
                    Spice Level
                  </label>
                  <select
                    value={formData.spiceLevel || 'NONE'}
                    onChange={(e) => setFormData({ ...formData, spiceLevel: e.target.value as SpiceLevel })}
                    className="w-full px-3 py-2 rounded-xl bg-charcoal-850 border border-charcoal-700 text-sm text-ivory-100 focus:outline-none focus:border-gold-500/50"
                  >
                    <option value="NONE">None</option>
                    <option value="MILD">Mild</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HOT">Hot</option>
                    <option value="EXTRA_HOT">Extra Hot</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-ivory-400 mb-1">
                  Gastronomic Description *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-charcoal-850 border border-charcoal-700 text-sm text-ivory-100 focus:outline-none focus:border-gold-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-ivory-400 mb-1">
                  High-Resolution Food Photography URL
                </label>
                <input
                  type="url"
                  value={formData.imageUrl || ''}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=1200"
                  className="w-full px-3 py-2 rounded-xl bg-charcoal-850 border border-charcoal-700 text-sm text-ivory-100 focus:outline-none focus:border-gold-500/50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-ivory-400 mb-1">
                    Ingredients List
                  </label>
                  <input
                    type="text"
                    value={formData.ingredients || ''}
                    onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                    placeholder="Arborio Rice, Moong Dal, Truffle..."
                    className="w-full px-3 py-2 rounded-xl bg-charcoal-850 border border-charcoal-700 text-sm text-ivory-100 focus:outline-none focus:border-gold-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-ivory-400 mb-1">
                    Allergens
                  </label>
                  <input
                    type="text"
                    value={formData.allergens || ''}
                    onChange={(e) => setFormData({ ...formData, allergens: e.target.value })}
                    placeholder="Dairy, Gluten, Nuts..."
                    className="w-full px-3 py-2 rounded-xl bg-charcoal-850 border border-charcoal-700 text-sm text-ivory-100 focus:outline-none focus:border-gold-500/50"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-ivory-200">
                  <input
                    type="checkbox"
                    checked={formData.isAvailable !== false}
                    onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                    className="rounded bg-charcoal-800 border-charcoal-700 text-gold-500 focus:ring-gold-500"
                  />
                  <span>Dish is Available</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-ivory-200">
                  <input
                    type="checkbox"
                    checked={Boolean(formData.isChefSpecial)}
                    onChange={(e) => setFormData({ ...formData, isChefSpecial: e.target.checked })}
                    className="rounded bg-charcoal-800 border-charcoal-700 text-gold-500 focus:ring-gold-500"
                  />
                  <span className="text-gold-300">Mark as Chef's Signature</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-charcoal-800">
                <Button type="button" onClick={() => setIsModalOpen(false)} variant="subtle" size="md">
                  Cancel
                </Button>
                <Button type="submit" variant="gold" size="md">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
