import { BarChart3, CheckCircle, ChevronLeft, ChevronRight, Clock, CreditCard, DollarSign, Download, Eye, Search, Settings, XCircle } from "lucide-react";
import { TransactionCard } from "../../components/Organizer/TransactionCard";
import { useEffect, useMemo, useState } from "react";
import type { Transaction,Event } from "../../components/Organizer/Events/type";
import { FiTrash } from "react-icons/fi";

interface FilterState {
  eventId: string;
  status: string;
  paymentMethod: string;
  dateRange: { from: string; to: string };
  search: string;
  amountRange: { min: number; max: number };
}

interface OverviewStats {
  totalTransactions: number;
  totalAmount: number;
}
export default function TransactionsPage(){

    const [events] = useState<Event[]>([
    {
        id: '1',
        name: 'AICS School Fees 2024',
        category: 'school',
        customFields: [
            { id: 'studentName', label: 'Student Name', type: 'text', visible: true },
            { id: 'class', label: 'Class', type: 'text', visible: true },
            { id: 'gender', label: 'Gender', type: 'select', visible: false },
            { id: 'parentContact', label: 'Parent Contact', type: 'tel', visible: true },
            { id: 'studentId', label: 'Student ID', type: 'text', visible: true },
        ],
    },
    {
        id: '2',
        name: 'Marie & Paul Wedding',
        category: 'wedding',
        customFields: [
        { id: 'guestName', label: 'Guest Name', type: 'text', visible: true },
        { id: 'relationship', label: 'Relationship', type: 'select', visible: true },
        { id: 'attendance', label: 'Will Attend', type: 'select', visible: false },
        { id: 'message', label: 'Message', type: 'textarea', visible: true },
        ],
    }
    ]);

    const [transactions] = useState<Transaction[]>([
        {
            id: '1',
            eventId: '1',
            eventName: 'AICS School Fees 2024',
            transactionId: 'TX001',
            paymentMethod: 'momo',
            date: '2024-01-15T10:30:00Z',
            amount: 50000,
            payerName: 'John Doe',
            payerEmail: 'john@example.com',
            customFields: { studentName: 'John Doe', class: 'Form 5A', gender: 'Male', parentContact: '677123456', studentId: 'ST001' },
            eventType: ""
        },
        {
            id: '2',
            eventId: '1',
            eventName: 'AICS School Fees 2024',
            transactionId: 'TX002',
            paymentMethod: 'om',
            date: '2024-01-14T14:20:00Z',
            amount: 50000,
            payerName: 'Jane Smith',
            payerEmail: 'jane@example.com',
            customFields: { studentName: 'Jane Smith', class: 'Form 4B', gender: 'Female', parentContact: '677654321', studentId: 'ST002' },
            eventType: ""
        },
        {
            id: '3',
            eventId: '2',
            eventName: 'Marie & Paul Wedding',
            transactionId: 'TX003',
            paymentMethod: 'visa',
            date: '2024-01-13T16:45:00Z',
            amount: 25000,
            payerName: 'Alice Johnson',
            payerEmail: 'alice@example.com',
            customFields: { guestName: 'Alice Johnson', relationship: 'Friend', attendance: 'Yes', message: 'Congratulations!' },
            eventType: ""
        },
        {
            id: '4',
            eventId: '2',
            eventName: 'Marie & Paul Wedding',
            transactionId: 'TX003',
            paymentMethod: 'visa',
            date: '2024-01-13T16:45:00Z',
            amount: 25000,
            payerName: 'Alice Johnson',
            payerEmail: 'alice@example.com',
            customFields: { guestName: 'Alice Johnson', relationship: 'Friend', attendance: 'Yes', message: 'Congratulations!' },
            eventType: ""
        },
        // Add more mock transactions...
    ]);

    const [filters, setFilters] = useState<FilterState>({
    eventId: '',
    status: '',
    paymentMethod: '',
    dateRange: { from: '', to: '' },
    search: '',
    amountRange: { min: 0, max: 0 }
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({});

  // Get current event
  const currentEvent = events.find(e => e.id === filters.eventId) || events[0];
  useEffect(() => {
    if (currentEvent) {
      const defaultColumns = {
        transactionId: true,
        paymentMethod: true,
        date: true,
        status: true,
        amount: true,
        payerName: true,
      };
      
      const customColumns = currentEvent.customFields.reduce((acc, field) => {
        acc[field.id] = field.visible;
        return acc;
      }, {} as Record<string, boolean>);

      setVisibleColumns({ ...defaultColumns, ...customColumns });
    }
  }, [currentEvent]);
    // Filter and search transactions
    const filteredTransactions = useMemo(() => {
      return transactions.filter(transaction => {
        if (filters.eventId && transaction.eventId !== filters.eventId) return false;
        if (filters.paymentMethod && transaction.paymentMethod !== filters.paymentMethod) return false;
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          return (
            transaction.transactionId.toLowerCase().includes(searchLower) ||
            transaction.payerName.toLowerCase().includes(searchLower) ||
            Object.values(transaction.customFields).some(value => 
              String(value).toLowerCase().includes(searchLower)
            )
          );
        }
        return true;
      });
    }, [transactions, filters]);

    // Calculate overview stats
    const overviewStats: OverviewStats = useMemo(() => {
    const filtered = filteredTransactions;
    return {
        totalTransactions: filtered.length,
        totalAmount: filtered.reduce((sum, t) => sum + t.amount, 0),
    };
    }, [filteredTransactions]);
    // Get recent contributors
    const recentTransactions = useMemo(() => {
        return [...transactions]
          .filter(t => t.date) // optional guard if some items may miss date
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5);
      }, [transactions]);
    // Pagination
    const paginatedTransactions = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredTransactions.slice(start, start + itemsPerPage);
    }, [filteredTransactions, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

    const handleFilterChange = (key: keyof FilterState, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setCurrentPage(1);
    };

  const toggleColumnVisibility = (columnId: string) => {
    const defaultColumns = ['transactionId', 'paymentMethod', 'date'];
    if (defaultColumns.includes(columnId)) return; // Can't hide default columns
    
    setVisibleColumns(prev => ({ ...prev, [columnId]: !prev[columnId] }));
  };

  const exportTransactions = () => {
    // Implementation for export functionality
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Transaction ID,paymentMethod,Date,Status,Amount,Payer Name\n"
      + filteredTransactions.map(t => 
          `${t.transactionId},${t.paymentMethod},${t.date},{t.amount},${t.payerName}`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };



  const getpaymentMethodIcon = (paymentMethod: string) => {
    switch (paymentMethod) {
      case 'momo':
        return <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-xs font-bold text-white">M</div>;
      case 'om':
        return <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-xs font-bold text-white">O</div>;
      case 'bank':
        return <CreditCard className="w-4 h-4 text-blue-500" />;
      default:
        return null;
    }
  };  
    return (
        <div className="h-screen w-[100vw] md:w-full p-1 bg-gray-50/90 overflow-y-auto overflow-x-hidden">
            {/* header */}
            <div className="bg-gray-100 shadow-md border-b">
                <div className="px-4 sm:px-6 py-">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="font-bold text-gray-900">Transaction </h1>
                    </div>
                </div>
                </div>
            </div>

                {/* main  */}
                <div className=" mx-auto px-2 py-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                        
                        {/* middle */}
                        <div className="md:col-span-9">
                            <div className="bg-white space-x-2 flex justify-between items-center  rounded-lg shadow p-4 mb-6 ">
                                <div className="md:flex  md:space-x-2">
                                    <label className="hidden sm:flex text-sm font-medium text-gray-700 mb-2">Event Filter</label>
                                    <select
                                    value={filters.eventId}
                                    onChange={(e) => handleFilterChange('eventId', e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                    >
                                    <option value="">All Events</option>
                                    {events.map(event => (
                                        <option key={event.id} value={event.id}>{event.name}</option>
                                    ))}
                                    </select>
                                </div>

                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="Search transactions..."
                                        value={filters.search}
                                        onChange={(e) => handleFilterChange('search', e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                    />
                                </div>
                            </div>

                            {/* overViewCard  */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-3">
                                <TransactionCard totalTransaction={'Total Transactions'} overViewStat={overviewStats.totalTransactions.toLocaleString()} icon={<BarChart3 className="w-6 h-6 text-purple-800" />}/>
                                <TransactionCard totalTransaction={"Total Amount"} overViewStat={formatAmount(overviewStats.totalAmount)} icon={<DollarSign className="w-6 h-6 text-green-800" />}/>
                            </div>
                            
                            {/* Transaction Table  */}
                            <div className="bg-gray-100 rounded-lg shadow-sm shadow-gray-50 ">
                                <div className=" flex justify-center items-center p-4">
                                    <h3 className="text-lg font-medium text-gray-900">
                                    {currentEvent?.name || 'All Events'} ({filteredTransactions.length} records)
                                    </h3>
                                </div>

                                <div className="px-6 py-4 border-b border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex space-x-2">
                                            <div className="md:flex">
                                                <label className="hidden lg:block text-sm font-medium text-gray-700 mb-2">Status Filter</label>
                                                    <select
                                                    value={filters.status}
                                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                                    >
                                                    <option value="">All Status</option>
                                                    <option value="success">Success</option>
                                                    <option value="pending">Pending</option>
                                                    <option value="failed">Failed</option>
                                                    </select>                  
                                            </div>
                                            <div className="md:flex">
                                                <label className="hidden lg:block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                                                <select
                                                value={filters.paymentMethod}
                                                onChange={(e) => handleFilterChange('paymentMethod', e.target.value)}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                                >
                                                <option value="">All Methods</option>
                                                <option value="momo">Mobile Money</option>
                                                <option value="om">Orange Money</option>
                                                <option value="bank">Bank Transfer</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button className="inline-flex items-center px-3 py-1 bg-purple-800 text-white rounded-md text-sm  hover:bg-purple-900">
                                                Create Event
                                            </button>
                                            <button 
                                            onClick={exportTransactions}
                                            className="inline-flex items-center px-3 py-1 bg-purple-800 text-white rounded-md text-sm hover:bg-purple-900"
                                            >
                                            <Download className="w-4 h-4 mr-1" />
                                            Export
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                         {/* table */}
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th> */}
                                        {visibleColumns['payerName'] && (
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payer Name</th>
                                        )}
                                        {currentEvent?.customFields.filter(field => visibleColumns[field.id]).map(field => (
                                            <th key={field.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            {field.label}
                                            </th>
                                        ))}
                                        {visibleColumns['amount'] && (
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                        )}
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {paginatedTransactions.map((transaction) => (
                                        <tr key={transaction.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {transaction.transactionId}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex items-center">
                                                {getpaymentMethodIcon(transaction.paymentMethod)}
                                                <span className="ml-2 capitalize">{transaction.paymentMethod}</span>
                                            </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(transaction.date)}
                                            </td>
                                            {visibleColumns['payerName'] && (
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {transaction.payerName}
                                            </td>
                                            )}
                                            {currentEvent?.customFields.filter(field => visibleColumns[field.id]).map(field => (
                                            <td key={field.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {transaction.customFields[field.id] || '-'}
                                            </td>
                                            ))}
                                            {visibleColumns['amount'] && (
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {formatAmount(transaction.amount)}
                                            </td>
                                            )}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex items-center space-x-2">
                                                <button className="text-purple-600 hover:text-purple-900">
                                                <Eye className="w-4 h-4" />
                                                </button>
                                                <button className="text-red-600 hover:text-red-900">
                                                <FiTrash className="w-4 h-4" />
                                                </button>
                                            </div>
                                            </td>
                                        </tr>
                                        ))}
                                    </tbody>
                                    </table>
                                </div>
                                   {/* Pagination */}
                                <div className="px-6 py-4 border-t mb-5 border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-gray-700">
                                            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} results
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button
                                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                            disabled={currentPage === 1}
                                            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                            <ChevronLeft className="w-4 h-4 mr-1" />
                                            Previous
                                            </button>
                                            
                                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                            const page = i + 1;
                                            return (
                                                <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                className={`px-3 py-2 rounded-md text-sm ${
                                                    currentPage === page
                                                    ? 'bg-purple-800 text-white'
                                                    : 'text-gray-500 hover:bg-gray-50'
                                                }`}
                                                >
                                                {page}
                                                </button>
                                            );
                                            })}
                                            
                                            <button
                                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                            disabled={currentPage === totalPages}
                                            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                            Next
                                            <ChevronRight className="w-4 h-4 ml-1" />
                                            </button>
                                        </div>
                                    </div>
                                </div>                        
                            </div>
                                 
                            {/* Recent Contributors */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Contributors</h3>
                                <div className="space-y-3">
                                    {recentTransactions.map((transaction) => (
                                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex-1">
                                                <p className="text-sm font-medium ">{transaction.payerName}</p>
                                                <p className="text-xs text-gray-500">
                                                    {formatAmount(transaction.amount)} • {formatDate(transaction.date)}
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    {getpaymentMethodIcon(transaction.paymentMethod)} {transaction.paymentMethod.toUpperCase()} • {transaction.eventName}
                                                </p>
                                            </div>
                                    </div>
                                    ))}
                                </div>
                            </div>

                        </div>

                        {/* right side bar */}
                        <div className="lg:col-span-3 w-full sm:col-span-9 lg:bg-gray-100 md:shadow-xl  lg:p-3 space-y-6">

                            <div className="p-3 bg-white text-gray-900 rounded-xl shadow-md ">
                                <label className="block text-sm font-medium  mb-2">Column Visibility</label>
                                <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-md p-3">
                                    {/* Default columns (non-hideable) */}
                                    <div className="flex items-center">
                                        <input
                                        type="checkbox"
                                        checked={true}
                                        disabled
                                        className="h-4 w-4 text-purple-600 border-gray-300 rounded opacity-50"
                                        />
                                        <label className="ml-2 text-sm text-gray-500">Transaction ID</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                        type="checkbox"
                                        checked={true}
                                        disabled
                                        className="h-4 w-4 text-purple-600 border-gray-300 rounded opacity-50"
                                        />
                                        <label className="ml-2 text-sm text-gray-500">Method</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                        type="checkbox"
                                        checked={true}
                                        disabled
                                        className="h-4 w-4 text-purple-600 border-gray-300 rounded opacity-50"
                                        />
                                        <label className="ml-2 text-sm text-gray-500">Date</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                        type="checkbox"
                                        checked={true}
                                        disabled
                                        className="h-4 w-4 text-purple-600 border-gray-300 rounded opacity-50"
                                        />
                                        <label className="ml-2 text-sm text-gray-500">Status</label>
                                    </div>
                                
                                    {/* Custom columns (hideable) */}
                                    {currentEvent?.customFields.map(field => (
                                        <div key={field.id} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={visibleColumns[field.id] || false}
                                            onChange={() => toggleColumnVisibility(field.id)}
                                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                        />
                                        <label className="ml-2 text-sm text-gray-700">{field.label}</label>
                                        </div>
                                    ))}
                                    
                                    {/* Amount and Payer Name */}
                                    <div className="flex items-center">
                                        <input
                                        type="checkbox"
                                        checked={visibleColumns['amount'] || false}
                                        onChange={() => toggleColumnVisibility('amount')}
                                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                        />
                                        <label className="ml-2 text-sm text-gray-700">Amount</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                        type="checkbox"
                                        checked={visibleColumns['payerName'] || false}
                                        onChange={() => toggleColumnVisibility('payerName')}
                                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                        />
                                        <label className="ml-2 text-sm text-gray-700">Payer Name</label>
                                    </div>
                                </div>
                            </div>

                  

                            {/* Quick Analytics */}
                            <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Methods</h3>
                            <div className="space-y-3 text-gray-900">
                                <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    {getpaymentMethodIcon('momo')}
                                    <span className="ml-2 text-sm">Mobile Money</span>
                                </div>
                                <span className="text-sm font-medium">60% (732)</span>
                                </div>
                                <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    {getpaymentMethodIcon('om')}
                                    <span className="ml-2 text-sm">Orange Money</span>
                                </div>
                                <span className="text-sm font-medium">30% (370)</span>
                                </div>
                                <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    {getpaymentMethodIcon('bank')}
                                    <span className="ml-2 text-sm">Bank Transfer</span>
                                </div>
                                <span className="text-sm font-medium">10% (132)</span>
                                </div>
                            </div>
                            </div>
                       

                       
                        </div>
                    </div>
                    
                </div>
        </div>
    )
}