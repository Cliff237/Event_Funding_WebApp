import { motion } from 'framer-motion';
import type { EventFormData } from '../../components/Organizer/Events/type';

interface Props {
  formData: EventFormData;
  setFormData: React.Dispatch<React.SetStateAction<EventFormData>>;
  deadlineError:string | null
  goalError:string | null
}
function CreateFinalConfiguration({ formData, setFormData,deadlineError,goalError }: Props) {
return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Final Configuration
        </h2>
        <p className="text-gray-600 mt-2">Set up wallet, goals, and sharing options</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Wallet Type</label>
            <select
              className="w-full p-3 border rounded-lg"
              value={formData.walletType}
              onChange={(e) => setFormData(prev => ({ ...prev, walletType: e.target.value as 'app_wallet' | 'bank_account' }))}
            >
              <option value="app_wallet">App Wallet</option>
              <option value="bank_account">Bank Account</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Fundraising Goal (FCFA)</label>
            <input
              type="number"
              className="w-full p-3 border rounded-lg"
              value={formData.fundraisingGoal || 5000}
              onChange={(e) => setFormData(prev => ({ ...prev, fundraisingGoal: parseInt(e.target.value) || 0 }))}
              placeholder="0"
              min="5000"
            />
            {goalError && <p className="text-red-500 text-sm mt-1">{goalError}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Deadline</label>
            <input
              type="datetime-local"
              className="w-full p-3 border rounded-lg"
              value={formData.deadline}
              onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
              min={new Date().toISOString().slice(0, 16)}
            />
            {deadlineError && <p className="text-red-500 text-sm mt-1">{deadlineError}</p>}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Contributor Message</label>
            <textarea
              className="w-full p-3 border rounded-lg h-24"
              value={formData.contributorMessage}
              onChange={(e) => setFormData(prev => ({ ...prev, contributorMessage: e.target.value }))}
              placeholder="Thank you message for contributors"
            />
          </div>
        </div>
      </div>
    </motion.div>  
  )
}

export default CreateFinalConfiguration