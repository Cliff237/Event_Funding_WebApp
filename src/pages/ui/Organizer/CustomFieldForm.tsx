import { useState } from 'react';
import type { CustomField } from '../../components/Organizer/Events/type';

interface CustomFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddField: (field: CustomField) => void;
}

export const CustomFieldModal = ({ isOpen, onClose, onAddField }: CustomFieldModalProps) => {
  const [field, setField] = useState<CustomField>({
    name: '',
    value: '',
    required: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setField(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddField(field);
    setField({ name: '', value: '', required: false });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Add Custom Field</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Field Name</label>
            <input
              type="text"
              name="name"
              value={field.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="e.g., Student ID, Department"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Default Value (optional)</label>
            <input
              type="text"
              name="value"
              value={field.value}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Will be empty if not provided"
            />
          </div>
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="required"
                checked={field.required}
                onChange={handleChange}
                className="mr-2"
              />
              Required field (contributor must fill this)
            </label>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add Field
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};