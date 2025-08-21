import { useState } from "react";
import type { FieldType, FormField } from "./Events/type";

const FieldConfigurationPanel =
 (  { 
      field,
      allFields,
      onUpdate,
      onAddCondition
    }: {
      field: FormField;
      allFields: FormField[];
      onUpdate: (updates: Partial<FormField>) => void;
      onAddCondition: (fieldId: string, dependsOn: string, values: string[]) => void;
    }
  ) => {
  const [showConditionPanel, setShowConditionPanel] = useState(false);
  const [dependsOnField, setDependsOnField] = useState('');
  const [triggerValues, setTriggerValues] = useState<string[]>([]);

  return (
    <div className="space-y-4 w-full">
      <div>
        <label className="block text-sm font-medium mb-1">Field Label</label>
        <input
          type="text"
          value={field.label}
          onChange={(e) => onUpdate({ label: e.target.value })}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Field Type</label>
        <select
          value={field.type}
          onChange={(e) => onUpdate({ type: e.target.value as FieldType })}
          className="w-full p-2 border rounded"
        >
          <option value="text">Text</option>
          <option value="number">Number</option>
          <option value="select">Dropdown</option>
          <option value="email">Email</option>
          <option value="tel">Phone</option>
        </select>
      </div>

      {field.type === 'select' && (
        <div>
          <label className="block text-sm font-medium mb-1">Options (comma separated)</label>
          <input
            type="text"
            value={field.options?.join(', ') || ''}
            onChange={(e) => onUpdate({ options: e.target.value.split(',').map(s => s.trim()) })}
            className="w-full p-2 border rounded"
            placeholder="Option 1, Option 2, Option 3"
          />
        </div>
      )}

      {['number', 'text'].includes(field.type) && (
        <div>
          <label className="block text-sm font-medium mb-1">Default Value</label>
          <input
            type={field.type}
            value={field.defaultValue || ''}
            onChange={(e) => onUpdate({ defaultValue: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>
      )}

      <div className="flex items-center space-x-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={field.required}
            onChange={(e) => onUpdate({ required: e.target.checked })}
            className="mr-2"
          />
          Required
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={field.readOnly}
            onChange={(e) => onUpdate({ readOnly: e.target.checked })}
            className="mr-2"
          />
          Read Only
        </label>
      </div>

      {field.type === 'number' && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Min Value</label>
            <input
              type="number"
              value={field.min || ''}
              onChange={(e) => onUpdate({ min: Number(e.target.value) })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Max Value</label>
            <input
              type="number"
              value={field.max || ''}
              onChange={(e) => onUpdate({ max: Number(e.target.value) })}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      )}

      <div>
        <button
          onClick={() => setShowConditionPanel(!showConditionPanel)}
          className="text-sm text-purple-600 flex items-center"
        >
          {field.conditional ? 'Edit' : 'Add'} Conditional Logic
        </button>

        {showConditionPanel && (
          <div className="mt-2 p-3 text-gray-700 bg-gray-50 rounded-lg">
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">When this field:</label>
              <select
                value={dependsOnField}
                onChange={(e) => setDependsOnField(e.target.value)}
                className="w-full p-2 border rounded text-sm"
              >
                <option value="">Select a field</option>
                {allFields
                  .filter(f => f.id !== field.id && ['select', 'radio'].includes(f.type))
                  .map(f => (
                    <option key={f.id} value={f.id}>{f.label}</option>
                  ))}
              </select>
            </div>

            {dependsOnField && (
              <div className="mb-2">
                <label className="block text-sm font-medium mb-1">Has one of these values:</label>
                <input
                  type="text"
                  value={triggerValues.join(', ')}
                  onChange={(e) => setTriggerValues(e.target.value.split(',').map(s => s.trim()))}
                  className="w-full p-2 border rounded text-sm"
                  placeholder="Value 1, Value 2"
                />
              </div>
            )}

            <button
              onClick={() => {
                if (dependsOnField && triggerValues.length > 0) {
                  onAddCondition(field.id, dependsOnField, triggerValues);
                  setShowConditionPanel(false);
                }
              }}
              className="mt-2 px-3 py-1 bg-purple-600 text-white rounded text-sm"
            >
              Apply Condition
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default FieldConfigurationPanel;