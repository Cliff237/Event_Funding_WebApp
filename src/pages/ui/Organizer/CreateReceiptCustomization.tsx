import { AnimatePresence, motion } from 'framer-motion';
import React, { useMemo, useRef, useState } from 'react';
import type { Align, EventFormData, FormField, ReceiptLayout } from '../../components/Organizer/Events/type';
import { CheckCircle,  Copy,  Facebook,  MessageCircle,  Plus,  QrCode,  Trash2,  GripVertical,  Link as LinkIcon,  Image as ImageIcon,  Palette} from 'lucide-react';

interface ReceiptProps {
  formData: EventFormData;
  setFormData: React.Dispatch<React.SetStateAction<EventFormData>>;
}

function CreateReceiptCustomization({ formData, setFormData }: ReceiptProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [ShareModalCard, setShowShareModalCard] = useState(false);
  const [copied, setCopied] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ---- Safe defaults on receiptConfig ----
  const receipt = (formData.receiptConfig ?? ({} as EventFormData['receiptConfig']));
  const includeFields = formData.receiptConfig?.includeFields ?? [];
  const additionalFields = formData.receiptConfig?.additionalFields ?? {};
  const sampleData = (receipt as any).sampleData ?? ({} as Record<string, string>);
  const school = formData.receiptConfig?.school ?? { name: '', link: '', contact: '', logoUrl: '' };
  const layout: ReceiptLayout = (receipt?.layout as ReceiptLayout) ?? 'one';
  const align: Align = (receipt?.align as Align) ?? 'left';
  const showDividers = receipt?.showDividers ?? true;
  const accent = receipt?.accentColor ?? '#7c3aed'; // purple-600
  const eventUrl = useMemo(() => {
    // Build a deterministic event URL you can later hook to your backend slug/ID.
    const slug = (formData as any).eventSlug
      ? (formData as any).eventSlug
      : encodeURIComponent((formData.eventName || 'event237').trim().toLowerCase().replace(/\s+/g, '-'));
    return `https://shaderlpay.com/event/${slug}`;
  }, [formData]);

  // ---- Handlers ----
  const updateReceipt = (patch: any) =>
    setFormData(prev => ({
      ...prev,
      receiptConfig: {
        ...(prev.receiptConfig ?? {}),
        ...patch
      }
    }));

  const handleCopyLink = () => {
    navigator.clipboard.writeText(eventUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleConfirmEvent = () => {
    // Submit to backend here
    console.log('Complete Event Data:', formData);
    setShowConfirmation(false);
  };

  // ---- Drag & Drop for includeFields ----
  const onDragStart = (id: string) => setDraggingId(id);
  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();
  const onDrop = (targetId: string) => {
    if (!draggingId || draggingId === targetId) return;
    const currentOrder = [...includeFields];
    const fromIdx = currentOrder.indexOf(draggingId);
    const toIdx = currentOrder.indexOf(targetId);
    if (fromIdx === -1 || toIdx === -1) return;
    currentOrder.splice(fromIdx, 1);
    currentOrder.splice(toIdx, 0, draggingId);
    updateReceipt({ includeFields: currentOrder });
    setDraggingId(null);
  };

  // ---- Upload school logo ----
  const onPickLogo = () => fileInputRef.current?.click();
  const onFileChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    updateReceipt({ school: { ...school, logoUrl: url } });
  };

  // ---- Helpers ----
  const fieldById = (id: string): FormField | undefined =>
    formData.fields.find(f => f.id === id);

  const alignmentClass = useMemo(() => {
    switch (align) {
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-right';
      default:
        return 'text-left';
    }
  }, [align]);

  const gridColsClass = layout === 'two' ? 'grid grid-cols-1 sm:grid-cols-2 gap-3' : 'space-y-2';

  // ---- Share buttons ----
  const openWhatsApp = () => {
    const text = `Join/support "${formData.eventName}" here: ${eventUrl}`;
    const href = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(href, '_blank', 'noopener,noreferrer');
  };
  const openFacebook = () => {
    const href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventUrl)}`;
    window.open(href, '_blank', 'noopener,noreferrer');
  };

  return (
    <div>
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Receipt Customization
          </h2>
          <p className="text-gray-600 mt-2">Customize the payment receipt for your school event</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT: Controls */}
          <div className="space-y-6">
            {/* School Profile */}
            <div className="p-4  rounded-lg bg-white shadow-md">
              <h3 className="text-lg font-semibold mb-3">School Profile</h3>
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded border flex items-center justify-center overflow-hidden bg-gray-50"
                  style={{ borderColor: accent }}
                >
                  {school.logoUrl ? (
                    <img src={school.logoUrl} alt="school logo" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={onPickLogo}
                    className="px-3 py-1.5 text-sm bg-gray-100 border rounded hover:bg-gray-200"
                  >
                    Upload Logo
                  </button>
                  {school.logoUrl && (
                    <button
                      onClick={() => updateReceipt({ school: { ...school, logoUrl: '' } })}
                      className="px-3 py-1.5 text-sm bg-red-50 text-red-600 border rounded hover:bg-red-100"
                    >
                      Remove
                    </button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={onFileChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                <input
                  type="text"
                  className="p-2 border rounded"
                  value={school.name}
                  onChange={e => updateReceipt({ school: { ...school, name: e.target.value } })}
                  placeholder="School name"
                />
                  <div className="relative flex-1">
                    <input
                      type="url"
                      className="p-2 border rounded w-full pl-8"
                      value={school.link}
                      onChange={e => updateReceipt({ school: { ...school, link: e.target.value } })}
                      placeholder="School website link"
                    />
                    <LinkIcon className="w-4 h-4 absolute left-2 top-2.5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="p-2 border rounded flex-1"
                    value={school.contact}
                    onChange={e => updateReceipt({ school: { ...school, contact: e.target.value } })}
                    placeholder="Contact (e.g. +237 …)"
                  />
              </div>
            </div>

            {/* Include Fields on Receipt */}
            <div className='p-4 rounded-lg bg-white shadow-md'>
              <h3 className="text-lg font-semibold mb-3">Include Fields on Receipt</h3>
              <div className="grid col-span-1 md:grid-cols-2 gap-2 ">
                {formData.fields.map(field => {
                  const checked = includeFields.includes(field.id);
                  return (
                    <label
                      key={field.id}
                    >
                      <div className="flex items-center border space-x-1.5 hover:cursor-pointer rounded-lg p-2">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={e => {
                            if (e.target.checked) {
                              updateReceipt({ includeFields: [...includeFields, field.id] });
                            } else {
                              updateReceipt({
                                includeFields: includeFields.filter(id => id !== field.id)
                              });
                            }
                          }}
                        />
                        <span className="font-medium">{field.label}</span>
                      </div>
                    </label>
                  );
                })}
              </div>

              {/* Order/Position selected fields */}
              {includeFields.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Reorder fields (drag & drop):</p>
                  <div className="space-y-2">
                    {includeFields.map(fid => {
                      const f = fieldById(fid);
                      if (!f) return null;
                      return (
                        <div
                          key={fid}
                          className={`p-2 border rounded flex items-center justify-between bg-white ${
                            draggingId === fid ? 'opacity-70' : ''
                          }`}
                          draggable
                          onDragStart={() => onDragStart(fid)}
                          onDragOver={onDragOver}
                          onDrop={() => onDrop(fid)}
                        >
                          <div className="flex items-center gap-2">
                            <GripVertical className="w-4 h-4 text-gray-400" />
                            <span>{f.label}</span>
                          </div>
                          <span className="text-xs text-gray-500">{f.type}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Additional fields */}
            <div className='p-4 rounded-xl bg-white shadow-md'>
              <h3 className="text-lg font-semibold mb-3">Additional Receipt Fields</h3>
              <div className="space-y-3">
                {Object.entries(additionalFields).map(([fieldKey, value], idx) => (
                  <div key={idx} className="grid grid-cols-5 items-center space-x-2 ">
                    <div className="col-span-4 grid grid-cols-2 gap-1.5">
                      <input
                      type='text'
                      className='flex-1 p-2 border rounded'
                      placeholder='Field name'
                      value={fieldKey.toString()}
                      onChange={
                        e => {
                          const newFields = { ...additionalFields };
                          delete newFields[fieldKey];
                          newFields[e.target.value] = value;
                          updateReceipt({ additionalFields: newFields });
                        }
                      }
                      />
                      <input
                        type="text"
                        className="flex-1 p-2 border rounded"
                        value={value}
                        required
                        onChange={e =>
                          updateReceipt({
                            additionalFields: { ...additionalFields, [fieldKey]: e.target.value }
                          })
                        }
                        placeholder="Field value"
                      />
                    </div>
                    <button
                      onClick={() => {
                        const newFields = { ...additionalFields };
                        delete newFields[fieldKey];
                        updateReceipt({ additionalFields: newFields });
                      }}
                      className="text-red-500 col-span-1"
                      title="Remove field"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() =>
                    updateReceipt({
                      additionalFields: { ...additionalFields, ['New Field']: '' }
                    })
                  }
                  className="flex items-center space-x-2 text-purple-600"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Field</span>
                </button>
              </div>
            </div>

            {/* show share modal link  */}
            {ShareModalCard && (
              <div>
                {/* Quick Share */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3">Quick Share</h4>
                  <div className="bg-gray-100 p-3 rounded flex items-center justify-between">
                    <span className="text-sm truncate">{eventUrl}</span>
                    <button onClick={handleCopyLink} className="flex items-center space-x-1 text-purple-600 ml-2">
                      {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span className="text-sm">{copied ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="flex gap-3 mt-3">
                    <button onClick={openFacebook} className="p-3 bg-blue-600 text-white rounded-full" title="Share on Facebook">
                      <Facebook className="w-5 h-5" />
                    </button>
                    <button onClick={openWhatsApp} className="p-3 bg-green-500 text-white rounded-full" title="Share on WhatsApp">
                      <MessageCircle className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
              </div>
            )}
          </div>

          {/* RIGHT: Live Preview */}
          <div className="space-y-4">


            {/* Layout & Appearance */}
            <div className="p-4 border rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Layout & Appearance</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Layout</label>
                  <select
                    className="p-2 border rounded w-full"
                    value={layout}
                    onChange={e => updateReceipt({ layout: e.target.value as ReceiptLayout })}
                  >
                    <option value="one">1 Column</option>
                    <option value="two">2 Columns</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Align</label>
                  <select
                    className="p-2 border rounded w-full"
                    value={align}
                    onChange={e => updateReceipt({ align: e.target.value as Align })}
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Accent</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={accent}
                      onChange={e => updateReceipt({ accentColor: e.target.value })}
                      className="w-10 h-10 p-0 border rounded cursor-pointer"
                      title="Accent color"
                    />
                    <Palette className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>

              <label className="mt-3 inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showDividers}
                  onChange={e => updateReceipt({ showDividers: e.target.checked })}
                />
                <span className="text-sm">Show dividers between lines</span>
              </label>

              <div className="mt-3">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={receipt?.includeQR || false}
                    onChange={e => updateReceipt({ includeQR: e.target.checked })}
                  />
                  <span className="text-sm">Include QR Code for verification</span>
                </label>
              </div>
            </div>

            {/* receipt preview  */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-4">Receipt Preview</h3>

              <div className="p-4 bg-white border rounded">
                {/* Header */}
                <div className={`mb-4 ${alignmentClass}`}>
                  {school.logoUrl && (
                    <div className="w-16 h-16 mx-auto mb-2 overflow-hidden rounded-full border"
                         style={{ borderColor: accent }}>
                      <img src={school.logoUrl} alt="logo" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <h4 className="font-bold text-lg" style={{ color: accent }}>
                    {school.name || 'Your School'}
                  </h4>
                  {school.link && (
                    <a
                      href={school.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-blue-600 hover:underline"
                    >
                      {school.link}
                    </a>
                  )}
                  {school.contact && (
                    <div className="text-xs text-gray-500">{school.contact}</div>
                  )}
                  <div className="text-sm text-gray-600 mt-2">Payment Receipt</div>
                </div>

                {/* Meta */}
                <div className={`${gridColsClass}`}>
                  <ReceiptRow
                    label="Date"
                    value={new Date().toLocaleDateString()}
                    align={align}
                    showDivider={showDividers}
                  />
                  <ReceiptRow
                    label="Event"
                    value={formData.eventName || '—'}
                    align={align}
                    showDivider={showDividers}
                  />
                </div>

                {/* Included Form Fields */}
                {includeFields.length > 0 && (
                  <div className={`mt-2 ${gridColsClass}`}>
                    {includeFields.map(fid => {
                      const f = fieldById(fid);
                      if (!f) return null;
                      const val = sampleData[fid] || '—';
                      return (
                        <ReceiptRow
                          key={fid}
                          label={f.label}
                          value={val}
                          align={align}
                          showDivider={showDividers}
                        />
                      );
                    })}
                  </div>
                )}

                {/* Additional Fields */}
                {Object.keys(additionalFields).length > 0 && (
                  <div className={`mt-2 ${gridColsClass}`}>
                    {Object.entries(additionalFields).map(([k, v]) => (
                      <ReceiptRow
                        key={k}
                        label={k}
                        value={v || '—'}
                        align={align}
                        showDivider={showDividers}
                      />
                    ))}
                  </div>
                )}

                {/* QR */}
                {(receipt?.includeQR ?? false) && (
                  <div className="text-center my-4">
                    <div className="inline-block p-2 border rounded">
                      <QrCode className="w-16 h-16 mx-auto" />
                      <p className="text-xs mt-1">Scan to open event</p>
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className={`mt-4 text-xs text-gray-500 ${alignmentClass}`}>
                  Generated by Shaderlpay · <a className="underline" href={eventUrl} target="_blank" rel="noreferrer">Open event</a>
                </div>
              </div>
            </div>


          </div>
        </div>

        {/* Create event button */}
        <div className="flex justify-center">
          <button
            onClick={() => setShowConfirmation(true)}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 flex items-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            <span>Create Event</span>
          </button>
        </div>
      </motion.div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl p-6 w-full max-w-md"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Confirm Event Creation</h3>
                <p className="text-gray-600 mb-6">
                  Are you ready to create "{formData.eventName}"? This will make your event live and shareable.
                </p>

                <div className="flex space-x-3">
                  <button
                    className="flex-1 px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50"
                    onClick={() => setShowConfirmation(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    onClick={() => {
                      handleConfirmEvent();
                      setShowShareModal(true);
                      setShowShareModalCard(true)
                    }}
                  >
                    Confirm & Create
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl p-6 w-full max-w-md"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold mb-2">Share Your Event</h3>
                <p className="text-gray-600">Share your event link with potential contributors</p>
              </div>

              <div className="bg-gray-100 p-4 rounded-lg mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm truncate">{eventUrl}</span>
                  <button onClick={handleCopyLink} className="flex items-center space-x-1 text-purple-600 ml-2">
                    {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span className="text-sm">{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-medium mb-3">Share via</h4>
                <div className="flex justify-center space-x-4">
                  <button onClick={openFacebook} className="p-3 bg-blue-600 text-white rounded-full" title="Share on Facebook">
                    <Facebook className="w-5 h-5" />
                  </button>
                  <button onClick={openWhatsApp} className="p-3 bg-green-500 text-white rounded-full" title="Share on WhatsApp">
                    <MessageCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <button
                onClick={() => setShowShareModal(false)}
                className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Done
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Small presentational row used by the preview */
function ReceiptRow({
  label,
  value,
  align,
  showDivider
}: {
  label: string;
  value: string;
  align: 'left' | 'center' | 'right';
  showDivider: boolean;
}) {
  const alignClass = align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left';
  return (
    <div className={`text-sm ${alignClass}`}>
      <div className="flex items-center justify-between">
        <span className="text-gray-600">{label}:</span>
        <span className="font-medium">{value}</span>
      </div>
      {showDivider && <div className="h-px bg-gray-100 mt-2" />}
    </div>
  );
}

export default CreateReceiptCustomization;
