import { motion } from 'framer-motion'
import React, { useState } from 'react'
import type { EventFormData } from './type';

interface Props {
  formData: EventFormData;
  setFormData: React.Dispatch<React.SetStateAction<EventFormData>>;
}
function CreateFormCustomization({ formData, setFormData }: Props) {
  return (
    <div>
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Customize Form Appearance
          </h2>
          <p className="text-gray-600 mt-2">Personalize the look and feel of your event form</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Event Title</label>
              <input
                type="text"
                className="w-full p-3 border rounded-lg"
                value={formData.eventTitle}
                onChange={(e) => setFormData(prev => ({ ...prev, eventTitle: e.target.value }))}
                placeholder="Display title for the form"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Event Description</label>
              <textarea
                className="w-full p-3 border rounded-lg h-24"
                value={formData.eventDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, eventDescription: e.target.value }))}
                placeholder="Brief description of the event"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Primary Color</label>
                <input
                  type="color"
                  className="w-full h-12 border rounded-lg"
                  value={formData.formColors.primary}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    formColors: { ...prev.formColors, primary: e.target.value }
                  }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Secondary Color</label>
                <input
                  type="color"
                  className="w-full h-12 border rounded-lg"
                  value={formData.formColors.secondary}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    formColors: { ...prev.formColors, secondary: e.target.value }
                  }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Text Color</label>
                <input
                  type="color"
                  className="w-full h-12 border rounded-lg"
                  value={formData.formColors.text}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    formColors: { ...prev.formColors, text: e.target.value }
                  }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Background Color</label>
                <input
                  type="color"
                  className="w-full h-12 border rounded-lg"
                  value={formData.formColors.background}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    formColors: { ...prev.formColors, background: e.target.value }
                  }))}
                />
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-4">Live Preview</h3>
            <div 
              className="p-4 rounded-lg border-2 min-h-[200px]"
              style={{ 
                backgroundColor: formData.formColors.background,
                borderColor: formData.formColors.primary 
              }}
            >
              <h2 
                className="text-xl font-bold mb-2"
                style={{ color: formData.formColors.primary }}
              >
                {formData.eventTitle || 'Event Title'}
              </h2>
              <p 
                className="text-sm mb-4"
                style={{ color: formData.formColors.text }}
              >
                {formData.eventDescription || 'Event description will appear here'}
              </p>
              <div className="space-y-2">
                <div 
                  className="h-10 border rounded"
                  style={{ 
                    backgroundColor: 'white',
                    borderColor: formData.formColors.secondary
                  }}
                ></div>
                <div 
                  className="h-10 border rounded"
                  style={{ 
                    backgroundColor: 'white',
                    borderColor: formData.formColors.secondary
                  }}
                ></div>
              </div>
            </div>
          </div>
          
        </div>
      </motion.div>    
    </div>
  )
}

export default CreateFormCustomization