
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Lot, Category, SubCategory } from '../types/inventory';

interface LotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lot: Omit<Lot, 'id' | 'movements'>) => void;
  lot?: Lot | null;
  categories: Category[];
  subCategories: SubCategory[];
}

const LotModal = ({ isOpen, onClose, onSave, lot, categories, subCategories }: LotModalProps) => {
  const [formData, setFormData] = useState({
    lotNumber: '',
    subCategoryId: '',
    quantity: 0,
    receivedDate: '',
    expiryDate: '',
    supplier: '',
    costPerUnit: 0,
  });

  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (lot) {
      setFormData({
        lotNumber: lot.lotNumber,
        subCategoryId: lot.subCategoryId,
        quantity: lot.quantity,
        receivedDate: lot.receivedDate,
        expiryDate: lot.expiryDate || '',
        supplier: lot.supplier,
        costPerUnit: lot.costPerUnit,
      });
      
      const subCategory = subCategories.find(sc => sc.id === lot.subCategoryId);
      setSelectedCategoryId(subCategory?.categoryId || '');
    } else {
      setFormData({
        lotNumber: '',
        subCategoryId: '',
        quantity: 0,
        receivedDate: new Date().toISOString().split('T')[0],
        expiryDate: '',
        supplier: '',
        costPerUnit: 0,
      });
      setSelectedCategoryId('');
    }
    setErrors({});
  }, [lot, isOpen, subCategories]);

  const filteredSubCategories = subCategories.filter(sc => sc.categoryId === selectedCategoryId);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.lotNumber.trim()) {
      newErrors.lotNumber = 'Lot number is required';
    }
    if (!formData.subCategoryId) {
      newErrors.subCategoryId = 'Sub-category is required';
    }
    if (formData.quantity <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    }
    if (!formData.receivedDate) {
      newErrors.receivedDate = 'Received date is required';
    }
    if (!formData.supplier.trim()) {
      newErrors.supplier = 'Supplier is required';
    }
    if (formData.costPerUnit <= 0) {
      newErrors.costPerUnit = 'Cost per unit must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave({
        lotNumber: formData.lotNumber,
        subCategoryId: formData.subCategoryId,
        quantity: formData.quantity,
        receivedDate: formData.receivedDate,
        expiryDate: formData.expiryDate || undefined,
        supplier: formData.supplier,
        costPerUnit: formData.costPerUnit,
      });
      onClose();
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setFormData(prev => ({ ...prev, subCategoryId: '' }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {lot ? 'Edit Lot' : 'Add New Lot'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <Label htmlFor="lotNumber">Lot Number</Label>
            <Input
              id="lotNumber"
              value={formData.lotNumber}
              onChange={(e) => handleInputChange('lotNumber', e.target.value)}
              className={errors.lotNumber ? 'border-red-500' : ''}
              placeholder="LOT-001-2024"
            />
            {errors.lotNumber && <p className="text-red-500 text-sm mt-1">{errors.lotNumber}</p>}
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={selectedCategoryId} onValueChange={handleCategoryChange}>
              <SelectTrigger className={errors.subCategoryId ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="subCategory">Sub-Category</Label>
            <Select 
              value={formData.subCategoryId} 
              onValueChange={(value) => handleInputChange('subCategoryId', value)}
              disabled={!selectedCategoryId}
            >
              <SelectTrigger className={errors.subCategoryId ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select a sub-category" />
              </SelectTrigger>
              <SelectContent>
                {filteredSubCategories.map(subCategory => (
                  <SelectItem key={subCategory.id} value={subCategory.id}>
                    {subCategory.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.subCategoryId && <p className="text-red-500 text-sm mt-1">{errors.subCategoryId}</p>}
          </div>

          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              value={formData.quantity}
              onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 0)}
              className={errors.quantity ? 'border-red-500' : ''}
            />
            {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
          </div>

          <div>
            <Label htmlFor="costPerUnit">Cost Per Unit</Label>
            <Input
              id="costPerUnit"
              type="number"
              step="0.01"
              value={formData.costPerUnit}
              onChange={(e) => handleInputChange('costPerUnit', parseFloat(e.target.value) || 0)}
              className={errors.costPerUnit ? 'border-red-500' : ''}
            />
            {errors.costPerUnit && <p className="text-red-500 text-sm mt-1">{errors.costPerUnit}</p>}
          </div>

          <div>
            <Label htmlFor="supplier">Supplier</Label>
            <Input
              id="supplier"
              value={formData.supplier}
              onChange={(e) => handleInputChange('supplier', e.target.value)}
              className={errors.supplier ? 'border-red-500' : ''}
              placeholder="Supplier name"
            />
            {errors.supplier && <p className="text-red-500 text-sm mt-1">{errors.supplier}</p>}
          </div>

          <div>
            <Label htmlFor="receivedDate">Received Date</Label>
            <Input
              id="receivedDate"
              type="date"
              value={formData.receivedDate}
              onChange={(e) => handleInputChange('receivedDate', e.target.value)}
              className={errors.receivedDate ? 'border-red-500' : ''}
            />
            {errors.receivedDate && <p className="text-red-500 text-sm mt-1">{errors.receivedDate}</p>}
          </div>

          <div>
            <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
            <Input
              id="expiryDate"
              type="date"
              value={formData.expiryDate}
              onChange={(e) => handleInputChange('expiryDate', e.target.value)}
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button type="submit" className="flex-1">
              {lot ? 'Update Lot' : 'Add Lot'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LotModal;
