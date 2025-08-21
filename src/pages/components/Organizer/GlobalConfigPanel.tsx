import React from 'react';
import {FiInfo, FiEdit } from 'react-icons/fi';
import type { EventConfig, PaymentMethod } from './Events/type';

interface GlobalConfigPanelProps {
  event: EventConfig;
  onUpdate: (newConfig: EventConfig) => void;
  onThemeUpdate: (property: keyof EventConfig['theme'], value: string) => void;
  onPaymentMethodToggle: (method: PaymentMethod) => void;
}

const GlobalConfigPanel: React.FC<GlobalConfigPanelProps> = ({
  event,
  onUpdate,
  onThemeUpdate,
  // onPaymentMethodToggle,
}) => {
  const handleEventInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onUpdate({ ...event, [name]: value });
  };

  return (
    <div className="space-y-6">
      {/* Event Information Section */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center mb-3 text-gray-700">
          <FiInfo className="mr-2" />
          <h4 className="font-medium">Event Information</h4>
        </div>

        <div className="space-y-4 text-gray-700 ">
          <div>
            <label className="block text-sm font-medium mb-1">Event Title</label>
            <input
              type="text"
              name="title"
              value={event.title}
              onChange={handleEventInfoChange}
              className="w-full p-2 border rounded text-sm"
              placeholder="e.g., Annual Science Fair"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={event.description}
              onChange={handleEventInfoChange}
              rows={3}
              className="w-full p-2 border rounded text-sm"
              placeholder="Brief description of your event"
              maxLength={100}
            />
            <p className="text-xs text-gray-500 text-right mt-1">
              {event.description.length}/100 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Event Category</label>
            <select
              value={event.category}
              onChange={(e) => onUpdate({ ...event, category: e.target.value as 'wedding' | 'school' })}
              className="w-full p-2 border rounded text-sm"
            >
              <option value="school">Defense  fees Event</option>
              <option value="wedding">School Fees</option>
            </select>
          </div>
        </div>
      </div>

      {/* Theme Customization Section */}
      <div className="bg-gray-50 p-4 text-gray-700 rounded-lg">
        <div className="flex items-center mb-3 text-gray-700">
          <FiEdit className="mr-2" />
          <h4 className="font-medium">Theme Customization</h4>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Primary Color</label>
            <div className="flex items-center">
              <input
                type="color"
                value={event.theme.primaryColor}
                onChange={(e) => onThemeUpdate('primaryColor', e.target.value)}
                className="w-8 h-8 rounded cursor-pointer"
              />
              <span className="ml-2 text-sm">{event.theme.primaryColor}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Secondary Color</label>
            <div className="flex items-center">
              <input
                type="color"
                value={event.theme.secondaryColor}
                onChange={(e) => onThemeUpdate('secondaryColor', e.target.value)}
                className="w-8 h-8 rounded cursor-pointer"
              />
              <span className="ml-2 text-sm">{event.theme.secondaryColor}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Background Color</label>
            <div className="flex items-center">
              <input
                type="color"
                value={event.theme.bgColor}
                onChange={(e) => onThemeUpdate('bgColor', e.target.value)}
                className="w-8 h-8 rounded cursor-pointer"
              />
              <span className="ml-2 text-sm">{event.theme.bgColor}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Settings (Optional) */}
      {/* <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium mb-3 text-gray-700">Advanced Settings</h4>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={event.fields.some(f => f.conditional)}
              onChange={() => {}}
              className="rounded text-purple-600"
              disabled
            />
            <span className="text-sm text-gray-500">Enable Conditional Logic (coming soon)</span>
          </label>
        </div>
      </div> */}
    </div>
  );
};

export default GlobalConfigPanel;