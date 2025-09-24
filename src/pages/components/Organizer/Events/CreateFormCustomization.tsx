import { motion, AnimatePresence } from 'framer-motion'
import React, { useState } from 'react'
import { Palette, Eye, Sparkles, Image as ImageIcon, Type, Layout, Brush, Wand2, RefreshCw } from 'lucide-react';
import type { EventFormData } from './type';

interface Props {
  formData: EventFormData;
  setFormData: React.Dispatch<React.SetStateAction<EventFormData>>;
}

function CreateFormCustomization({ formData, setFormData }: Props) {
  const [activeTab, setActiveTab] = useState<'content' | 'colors' | 'preview'>('content');
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null);

  const colorPresets = [
    { name: 'Purple Gradient', primary: '#7c3aed', secondary: '#a855f7', text: '#1f2937', background: '#f9fafb' },
    { name: 'Blue Ocean', primary: '#3b82f6', secondary: '#60a5fa', text: '#1e293b', background: '#f8fafc' },
    { name: 'Green Nature', primary: '#10b981', secondary: '#34d399', text: '#064e3b', background: '#f0fdf4' },
    { name: 'Pink Sunset', primary: '#ec4899', secondary: '#f472b6', text: '#831843', background: '#fdf2f8' },
    { name: 'Orange Fire', primary: '#f97316', secondary: '#fb923c', text: '#9a3412', background: '#fff7ed' },
    { name: 'Indigo Night', primary: '#6366f1', secondary: '#818cf8', text: '#312e81', background: '#f0f9ff' },
  ];

  const applyColorPreset = (preset: typeof colorPresets[0]) => {
    setFormData(prev => ({
      ...prev,
      formColors: {
        primary: preset.primary,
        secondary: preset.secondary,
        text: preset.text,
        background: preset.background
      }
    }));
  };

  const resetToDefaults = () => {
    setFormData(prev => ({
      ...prev,
      eventTitle: '',
      eventDescription: '',
      formColors: {
        primary: '#7c3aed',
        secondary: '#a855f7',
        text: '#1f2937',
        background: '#f9fafb'
      }
    }));
  };

  const tabs = [
    { id: 'content', label: 'Content', icon: Type },
    { id: 'colors', label: 'Colors', icon: Palette },
    { id: 'preview', label: 'Preview', icon: Eye },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <motion.h2 
          className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          🎨 Customize Form Appearance
        </motion.h2>
        <motion.p 
          className="text-gray-600 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Make your event form beautiful and engaging
        </motion.p>
      </div>

      {/* Tab Navigation */}
      <motion.div 
        className="flex justify-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-100">
          <div className="flex space-x-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Controls */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {/* Content Tab */}
            {activeTab === 'content' && (
              <motion.div
                key="content"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Event Title */}
                <motion.div 
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                      <Type className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Event Title</h3>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Display Title
                    </label>
                    <input
                      type="text"
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all duration-200"
                      value={formData.eventTitle}
                      onChange={(e) => setFormData(prev => ({ ...prev, eventTitle: e.target.value }))}
                      placeholder="Enter a catchy title for your form..."
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      This will be the main heading on your contribution form
                    </p>
                  </div>
                </motion.div>

                {/* Event Description */}
                <motion.div 
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                      <Layout className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Event Description</h3>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all duration-200 resize-none"
                      rows={4}
                      value={formData.eventDescription}
                      onChange={(e) => setFormData(prev => ({ ...prev, eventDescription: e.target.value }))}
                      placeholder="Describe your event and why people should contribute..."
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      A compelling description helps increase contributions
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Colors Tab */}
            {activeTab === 'colors' && (
              <motion.div
                key="colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Color Presets */}
                <motion.div 
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
                        <Wand2 className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">Color Presets</h3>
                    </div>
                    <motion.button
                      onClick={resetToDefaults}
                      className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span className="text-sm">Reset</span>
                    </motion.button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {colorPresets.map((preset, index) => (
                      <motion.button
                        key={preset.name}
                        onClick={() => applyColorPreset(preset)}
                        className="p-4 border-2 rounded-xl hover:border-gray-300 transition-all duration-200 group"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + index * 0.05 }}
                      >
                        <div className="flex space-x-2 mb-2">
                          <div 
                            className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                            style={{ backgroundColor: preset.primary }}
                          />
                          <div 
                            className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                            style={{ backgroundColor: preset.secondary }}
                          />
                        </div>
                        <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                          {preset.name}
                        </p>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Custom Colors */}
                <motion.div 
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                      <Brush className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Custom Colors</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { key: 'primary', label: 'Primary Color', desc: 'Main accent color' },
                      { key: 'secondary', label: 'Secondary Color', desc: 'Supporting color' },
                      { key: 'text', label: 'Text Color', desc: 'Main text color' },
                      { key: 'background', label: 'Background Color', desc: 'Form background' }
                    ].map((color) => (
                      <div key={color.key} className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          {color.label}
                        </label>
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <input
                              type="color"
                              className="w-12 h-12 border-2 border-gray-200 rounded-lg cursor-pointer"
                              value={formData.formColors[color.key as keyof typeof formData.formColors]}
                              onChange={(e) => setFormData(prev => ({ 
                                ...prev, 
                                formColors: { ...prev.formColors, [color.key]: e.target.value }
                              }))}
                            />
                          </div>
                          <div className="flex-1">
                            <input
                              type="text"
                              className="w-full p-2 border border-gray-200 rounded-lg text-sm font-mono"
                              value={formData.formColors[color.key as keyof typeof formData.formColors]}
                              onChange={(e) => setFormData(prev => ({ 
                                ...prev, 
                                formColors: { ...prev.formColors, [color.key]: e.target.value }
                              }))}
                            />
                            <p className="text-xs text-gray-500 mt-1">{color.desc}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Preview Tab */}
            {activeTab === 'preview' && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <motion.div 
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                      <Eye className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Form Preview</h3>
                  </div>
                  
                  <div className="text-center text-gray-600 py-8">
                    <Eye className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p>Preview will be shown in the right panel</p>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column - Live Preview */}
        <motion.div 
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Live Preview</h3>
          </div>
          
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-1">
            <motion.div 
              className="p-6 rounded-lg min-h-[400px] transition-all duration-300"
              style={{ 
                backgroundColor: formData.formColors.background,
                borderColor: formData.formColors.primary 
              }}
              key={`${formData.formColors.primary}-${formData.formColors.background}`}
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 1 }}
            >
              {/* Form Header */}
              <motion.div 
                className="text-center mb-6"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <motion.h2 
                  className="text-2xl font-bold mb-3 transition-colors duration-300"
                  style={{ color: formData.formColors.primary }}
                >
                  {formData.eventTitle || 'Your Event Title'}
                </motion.h2>
                <motion.p 
                  className="text-sm leading-relaxed transition-colors duration-300"
                  style={{ color: formData.formColors.text }}
                >
                  {formData.eventDescription || 'Your event description will appear here. This is where you can explain what your event is about and encourage people to contribute.'}
                </motion.p>
              </motion.div>

              {/* Sample Form Fields */}
              <motion.div 
                className="space-y-4"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div>
                  <label 
                    className="block text-sm font-medium mb-2 transition-colors duration-300"
                    style={{ color: formData.formColors.text }}
                  >
                    Full Name *
                  </label>
                  <div 
                    className="h-12 border-2 rounded-lg bg-white transition-colors duration-300"
                    style={{ borderColor: formData.formColors.secondary }}
                  />
                </div>
                
                <div>
                  <label 
                    className="block text-sm font-medium mb-2 transition-colors duration-300"
                    style={{ color: formData.formColors.text }}
                  >
                    Contribution Amount (FCFA) *
                  </label>
                  <div 
                    className="h-12 border-2 rounded-lg bg-white transition-colors duration-300"
                    style={{ borderColor: formData.formColors.secondary }}
                  />
                </div>

                <motion.button 
                  className="w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 shadow-lg"
                  style={{ backgroundColor: formData.formColors.primary }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Contribute Now
                </motion.button>
              </motion.div>

              {/* Sample Progress Bar */}
              <motion.div 
                className="mt-6 p-4 bg-white/50 rounded-lg"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex justify-between text-sm mb-2">
                  <span style={{ color: formData.formColors.text }}>Progress</span>
                  <span style={{ color: formData.formColors.primary }} className="font-semibold">65%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div 
                    className="h-2 rounded-full transition-colors duration-300"
                    style={{ 
                      backgroundColor: formData.formColors.primary,
                      width: '65%'
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: '65%' }}
                    transition={{ delay: 0.8, duration: 1 }}
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default CreateFormCustomization;