import { Eye, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { EventFormData, FieldType, FormField, PaymentMethod } from './type';
import CreateEventFormView from '../CreateEventFormView';

interface Props {
  formData: EventFormData;
  setFormData: React.Dispatch<React.SetStateAction<EventFormData>>;
  eventNameError: string | null;
}

function CreateCustomeEventFields({ formData, eventNameError, setFormData }: Props) {
  const [showPreview, setShowPreview] = useState(false);

  const addField = () => {
    const newField: FormField = {
      id: Date.now().toString(),
      label: 'New Field',
      type: 'text',
      required: false,
      readOnly: false,
      options: [], // for select fields
      min: undefined, // for number fields
      max: undefined,
      defaultValue: '',
    };
    setFormData((prev) => ({
      ...prev,
      fields: [...prev.fields, newField],
    }));
  };

  const addConditionalField = (fieldId: string) => {
    const conditionalField: FormField = {
      id: Date.now().toString(),
      label: 'Conditional Field',
      type: 'conditional',
      required: false,
      readOnly: false,
      condition: {
        fieldId,
        value: '',
      },
    };
    setFormData((prev) => ({
      ...prev,
      fields: [...prev.fields, conditionalField],
    }));
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFormData((prev) => ({
      ...prev,
      fields: prev.fields.map((field) =>
        field.id === id ? { ...field, ...updates } : field
      ),
    }));
  };

  const removeField = (id: string) => {
    if (formData.fields.length <= 2) return; // Keep minimum 2 fields
    setFormData((prev) => ({
      ...prev,
      fields: prev.fields.filter((field) => field.id !== id),
    }));
  };

  return (
    <div>
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Customize Event Fields
        </h2>
        <p className="text-gray-600 mt-2">
          Add and configure the fields for your event form
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:gap-6 lg:grid-cols-15 bg-white border-2 rounded border-gray-200 p-4 shadow-xl">
        {/* left side bar */}
        <div className="md:col-span-9">
          <div>
            <label className="block text-sm font-medium mb-2">Event Name *</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg"
              value={formData.eventName}
              required
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, eventName: e.target.value }))
              }
              placeholder="Enter unique event name"
            />
            {eventNameError && (
              <p className="text-red-500 text-sm mt-1">{eventNameError}</p>
            )}
          </div>

          {/* phone only */}
          <div className="md:hidden my-3 px-2">
            <div className="flex justify-between items-center ">
              <button
                onClick={addField}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                <Plus className="w-4 h-4" />
                <span>Add Field</span>
              </button>
              <button
                onClick={() => addConditionalField(formData.fields[0]?.id || '')}
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                <Plus className="w-4 h-4" />
                <span>Conditional Field</span>
              </button>
            </div>
          </div>

          {/* fields */}
          <div className="mt-4 space-y-4 h-fit md:max-h-[90vh] max-h-[60vh] p-2 overflow-auto">
            {formData.fields.map((field, index) => (
              <div key={field.id} className="bg-white p-4 rounded-lg border">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-sm font-medium text-gray-600">
                    {field.type === 'conditional'
                      ? 'Conditional Field'
                      : `Field ${index + 1}`}
                  </span>
                  {index >= 2 && (
                    <button
                      onClick={() => removeField(field.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Field Label"
                    className="p-2 border rounded"
                    value={field.label}
                    onChange={(e) =>
                      updateField(field.id, { label: e.target.value })
                    }
                  />
                  <select
                    className="p-2 border rounded"
                    value={field.type}
                    onChange={(e) =>
                      updateField(field.id, { type: e.target.value as FieldType })
                    }
                  >
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="email">Email</option>
                    <option value="tel">Phone</option>
                    <option value="image">Image</option>
                    <option value="select">Select</option>
                  </select>
                </div>

                {/* Number field settings */}
                {field.type === 'number' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                    <input
                      type="number"
                      placeholder="Min value"
                      className="p-2 border rounded"
                      value={field.min ?? ''}
                      onChange={(e) =>
                        updateField(field.id, {
                          min: e.target.value ? Number(e.target.value) : undefined,
                        })
                      }
                    />
                    <input
                      type="number"
                      placeholder="Max value"
                      className="p-2 border rounded"
                      value={field.max ?? ''}
                      onChange={(e) =>
                        updateField(field.id, {
                          max: e.target.value ? Number(e.target.value) : undefined,
                        })
                      }
                    />
                    <input
                      type="number"
                      placeholder="Default value"
                      className="p-2 border rounded"
                      value={field.defaultValue ?? ''}
                      onChange={(e) =>
                        updateField(field.id, { defaultValue: e.target.value })
                      }
                    />
                  </div>
                )}

                {/* Select field settings */}
                {field.type === 'select' && (
                  <div className="mt-3 space-y-2">
                    {(field.options ?? []).map((opt, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <input
                          type="text"
                          className="p-2 border rounded flex-1"
                          value={opt}
                          onChange={(e) => {
                            const newOptions = [...(field.options ?? [])];
                            newOptions[i] = e.target.value;
                            updateField(field.id, { options: newOptions });
                          }}
                        />
                        <button
                          onClick={() => {
                            const newOptions = (field.options ?? []).filter(
                              (_, idx) => idx !== i
                            );
                            updateField(field.id, { options: newOptions });
                          }}
                          className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() =>
                        updateField(field.id, {
                          options: [...(field.options ?? []), 'New option'],
                        })
                      }
                      className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded hover:bg-indigo-200"
                    >
                      + Add Option
                    </button>
                  </div>
                )}

                {/* Conditional field settings */}
                {field.type === 'conditional' && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">
                      Condition Settings
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <select
                        className="p-2 border rounded"
                        value={field.condition?.fieldId || ''}
                        onChange={(e) =>
                          updateField(field.id, {
                            condition: {
                              fieldId: e.target.value,
                              value: '',
                            },
                          })
                        }
                      >
                        <option value="">Select field...</option>
                        {formData.fields
                          .filter(
                            (f) => f.id !== field.id && f.type === 'select'
                          )
                          .map((f) => (
                            <option key={f.id} value={f.id}>
                              {f.label}
                            </option>
                          ))}
                      </select>

                      {field.condition?.fieldId && (
                        <select
                          className="p-2 border rounded"
                          value={field.condition?.value || ''}
                          onChange={(e) =>
                            updateField(field.id, {
                              condition: {
                                fieldId: field.condition?.fieldId ?? '',
                                value: e.target.value,
                              },
                            })
                          }
                        >
                          <option value="">Select option...</option>
                          {formData.fields
                            .find((f) => f.id === field.condition?.fieldId)
                            ?.options?.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                        </select>
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-2 flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={field.required}
                      onChange={(e) =>
                        updateField(field.id, { required: e.target.checked })
                      }
                      disabled={index < 2}
                    />
                    <span className="text-sm">Required</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={field.readOnly}
                      onChange={(e) =>
                        updateField(field.id, { readOnly: e.target.checked })
                      }
                    />
                    <span className="text-sm">readOnly</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* right side bar */}
        <div className="md:col-span-6 bg-white shadow-md border border-gray-200 rounded-r-xl px-4 py-4">
          <div className="md:flex w-full hidden justify-between mb-4">
            <button
              onClick={addField}
              className="flex items-center space-x-2 p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              <Plus className="w-4 h-4" />
              <span>Add Field</span>
            </button>
            <button
              onClick={() =>
                addConditionalField(formData.fields[0]?.id || '')
              }
              className="flex items-center space-x-2 p-2 bg-indigo-700 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              <span>Conditional Field</span>
            </button>
          </div>

          {/* payment method */}
          <div className="border-t-2 mt-2 border-gray-200">
            <h3 className="text-lg font-semibold mb-3">Payment Methods</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: 'momo', name: 'MTN MoMo', color: 'bg-yellow-500' },
                { id: 'om', name: 'Orange Money', color: 'bg-orange-500' },
                { id: 'visa', name: 'Visa Card', color: 'bg-blue-500' },
                { id: 'app_wallet', name: 'App Wallet', color: 'bg-purple-500' },
              ].map((method) => (
                <label
                  key={method.id}
                  className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={formData.paymentMethods.includes(
                      method.id as PaymentMethod
                    )}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData((prev) => ({
                          ...prev,
                          paymentMethods: [
                            ...prev.paymentMethods,
                            method.id as PaymentMethod,
                          ],
                        }));
                      } else {
                        setFormData((prev) => ({
                          ...prev,
                          paymentMethods: prev.paymentMethods.filter(
                            (m) => m !== method.id
                          ),
                        }));
                      }
                    }}
                  />
                  <div className={`w-4 h-4 rounded ${method.color}`}></div>
                  <span className="text-sm">{method.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* show form preview */}
          <div className="flex mt-5">
            <button
              onClick={() => setShowPreview(true)}
              className="flex w-full justify-center items-center space-x-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              <Eye className="w-4 h-4" />
              <span>Preview Form</span>
            </button>
          </div>
        </div>
      </div>

      {/* form View */}
      <CreateEventFormView
        formData={formData}
        showPreview={showPreview}
        setShowPreview={setShowPreview}
      />
    </div>
  );
}

export default CreateCustomeEventFields;
