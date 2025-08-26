import { useState } from 'react';
import { FiCopy, FiShare2, FiImage, FiCheck, FiChevronLeft } from 'react-icons/fi';
import type { EventConfig } from './type';

interface EventLinkCardProps {
  event: EventConfig;
  onSave: (card: { imageUrl: string; title: string; description: string }) => void;
   onBack: () => void;
}

const EventLinkCardEditor = ({ event, onSave, onBack }: EventLinkCardProps) => {
  const [imageUrl, setImageUrl] = useState('');
  const [customTitle, setCustomTitle] = useState(event.title);
  const [customDescription, setCustomDescription] = useState(event.description);
  const [isCopied, setIsCopied] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);

  // Generate unique link - in a real app this would come from your backend
  const eventLink = `${window.location.origin}/contribute/${event.id}`;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(eventLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const shareEvent = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: customTitle,
          text: customDescription,
          url: eventLink,
        });
      } else {
        setShowShareOptions(true);
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  return (

    <div className="fixed inset-0 overflow-y-scroll text-gray-700 bg-black/80 flex items-center justify-center">
      <div className=" p-4 bg-gray-50 h-fit rounded ">
        {/* Add back button at the top */}
        <button
          onClick={onBack}
          className="mb-4 flex items-center text-purple-600 hover:text-purple-800"
        >
          <FiChevronLeft className="mr-1" />
          Back to editor
        </button>
          
        <h2 className="text-2xl font-bold mb-4">Customize Your Event Link</h2>
        
        <div className="w-full  md:p-2">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Card Editor */}
            <div className="space-y-4 border p-4 rounded w-full" >
              <h3 className="text-lg font-medium">Customize Link Card</h3>
              
              <div>
                <label className="block text-sm font-medium mb-2">Card Image</label>
                <div className="flex items-center space-x-4">
                  <label className="cursor-pointer">
                    <div className="w-24 h-24 rounded-md bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                      {imageUrl ? (
                        <img src={imageUrl} alt="Event" className="w-full h-full object-cover rounded-md" />
                      ) : (
                        <FiImage className="text-gray-400 text-2xl" />
                      )}
                    </div>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="text-sm text-gray-500">
                    {imageUrl ? 'Change image' : 'Upload image (Recommended 800x400px)'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Card Title</label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  maxLength={60}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Card Description</label>
                <textarea
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  rows={3}
                  maxLength={160}
                />
              </div>

              <button
                onClick={() => onSave({ imageUrl, title: customTitle, description: customDescription })}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Save Card Design
              </button>
            </div>

            {/* Preview */}
            <div className="space-y-4 md:w-2/3">
              <h3 className="text-lg font-medium">Preview</h3>
              <div className="border rounded-lg overflow-hidden shadow-sm">
                {imageUrl ? (
                  <img src={imageUrl} alt="Event" className="w-full h-40 object-cover" />
                ) : (
                  <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
                    <FiImage className="text-gray-400 text-4xl" />
                  </div>
                )}
                <div className="p-4">
                  <h4 className="font-bold text-lg mb-1">{customTitle}</h4>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{customDescription}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">event.example.com</span>
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                      {event.category}
                    </span>
                  </div>
                </div>
              </div>

              {/* Link Sharing */}
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Share Event Link Card</h3>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center px-3 py-2 border rounded-md hover:bg-gray-50"
                  >
                    {isCopied ? (
                      <>
                        <FiCheck className="mr-2 text-green-500" /> Copied!
                      </>
                    ) : (
                      <>
                        <FiCopy className="mr-2" /> Copy Link
                      </>
                    )}
                  </button>
                  <button
                    onClick={shareEvent}
                    className="flex items-center px-3 py-2 border rounded-md hover:bg-gray-50"
                  >
                    <FiShare2 className="mr-2" /> Share Link card
                  </button>
                </div>

                {showShareOptions && (
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <a
                      href={`mailto:?subject=${encodeURIComponent(customTitle)}&body=${encodeURIComponent(`${customDescription}\n\n${eventLink}`)}`}
                      className="p-2 border rounded-md text-center hover:bg-gray-50"
                    >
                      Email
                    </a>
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(`${customTitle}\n${customDescription}\n${eventLink}`)}`}
                      className="p-2 border rounded-md text-center hover:bg-gray-50"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      WhatsApp
                    </a>
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${customTitle}\n${eventLink}`)}`}
                      className="p-2 border rounded-md text-center hover:bg-gray-50"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Twitter
                    </a>
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventLink)}`}
                      className="p-2 border rounded-md text-center hover:bg-gray-50"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Facebook
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
  
      </div>
    </div>
  );
};
  

export default EventLinkCardEditor;