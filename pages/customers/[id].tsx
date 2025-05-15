import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { FaArrowLeft, FaCalendarAlt, FaMapMarkerAlt, FaRegStickyNote, FaFile, FaStar, FaSpinner, FaEdit } from 'react-icons/fa';
import { toast, Toaster } from 'react-hot-toast';
import axios from 'axios';

// Import customer components
import CustomerCard from '../../components/customers/CustomerCard';
import CustomerTabs from '../../components/customers/CustomerTabs';
import AddressHistory from '../../components/customers/AddressHistory';
import AppointmentList from '../../components/customers/AppointmentList';
import NoteList from '../../components/customers/NoteList';
import FileUploader from '../../components/customers/FileUploader';

// Dummy data for initial development
const dummyCustomer = {
  id: 1,
  name: 'John Doe',
  phone: '(555) 123-4567',
  email: 'john.doe@example.com',
  address: '123 Main St, Anytown, CA 90210',
  status: 'active',
  created_at: '2022-09-15',
  total_spent: 450.00,
  last_service: '2023-04-15'
};

const dummyAddresses = [
  {
    id: 1,
    address: '123 Main St',
    city: 'Anytown',
    state: 'CA',
    zipcode: '90210',
    is_primary: true,
    created_at: '2022-09-15'
  },
  {
    id: 2,
    address: '456 Oak Ave',
    city: 'Somecity',
    state: 'CA',
    zipcode: '90211',
    is_primary: false,
    created_at: '2023-01-10'
  }
];

const dummyAppointments = [
  {
    id: 1,
    date: '2023-04-15',
    time: '14:30',
    duration: 60,
    status: 'completed' as const,
    service_type: 'Key Replacement',
    technician: 'Jane Smith',
    location: '123 Main St, Anytown, CA 90210',
    notes: 'Customer needed a replacement transponder key for Toyota Camry 2018.'
  },
  {
    id: 2,
    date: '2023-06-20',
    time: '10:00',
    duration: 45,
    status: 'scheduled' as const,
    service_type: 'Lock Repair',
    technician: 'Mike Johnson',
    location: '123 Main St, Anytown, CA 90210',
    notes: 'Front door deadbolt is sticking and difficult to turn.'
  }
];

const dummyNotes = [
  {
    id: 1,
    content: 'Customer prefers appointment times in the morning before noon.',
    created_at: '2022-10-05T14:30:00Z',
    created_by: 'Jane Smith'
  },
  {
    id: 2,
    content: 'Customer has a dog that needs to be put away during service visits.',
    created_at: '2023-02-20T09:15:00Z',
    created_by: 'Mike Johnson',
    updated_at: '2023-02-21T10:22:00Z'
  }
];

const dummyFiles = [
  {
    id: 1,
    filename: 'invoice_apr2023.pdf',
    file_type: 'application/pdf',
    file_size: 528400,
    uploaded_at: '2023-04-15T15:45:00Z',
    url: '#'
  },
  {
    id: 2,
    filename: 'house_front_door.jpg',
    file_type: 'image/jpeg',
    file_size: 2097152,
    uploaded_at: '2023-02-20T09:30:00Z',
    url: '#'
  }
];

const CustomerProfile = () => {
  const router = useRouter();
  const { id } = router.query;
  
  const [customer, setCustomer] = useState<any | null>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [files, setFiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch customer data from API (using dummy data for now)
  useEffect(() => {
    if (id) {
      // Simulating API fetch with dummy data
      setTimeout(() => {
        setCustomer(dummyCustomer);
        setAddresses(dummyAddresses);
        setAppointments(dummyAppointments);
        setNotes(dummyNotes);
        setFiles(dummyFiles);
        setIsLoading(false);
      }, 1000);
      
      // Actual API fetch would look like this:
      /*
      const fetchCustomerData = async () => {
        try {
          setIsLoading(true);
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE}/customers/${id}`);
          
          if (response.data && response.data.success) {
            setCustomer(response.data.customer);
            setAddresses(response.data.addresses || []);
            setAppointments(response.data.appointments || []);
            setNotes(response.data.notes || []);
            setFiles(response.data.files || []);
          } else {
            toast.error('Failed to load customer data.');
          }
        } catch (error) {
          console.error('Error fetching customer data:', error);
          toast.error('Error connecting to the server. Please try again later.');
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchCustomerData();
      */
    }
  }, [id]);

  // Handle operations on addresses
  const handleAddAddress = async (addressData: any) => {
    // In a real app, this would be an API call
    const newAddress = {
      id: addresses.length + 1,
      ...addressData,
      created_at: new Date().toISOString()
    };
    
    setAddresses([...addresses, newAddress]);
    toast.success('Address added successfully!');
  };

  const handleDeleteAddress = async (addressId: number) => {
    // In a real app, this would be an API call
    setAddresses(addresses.filter(address => address.id !== addressId));
    toast.success('Address deleted successfully!');
  };

  const handleSetPrimaryAddress = async (addressId: number) => {
    // In a real app, this would be an API call
    setAddresses(addresses.map(address => ({
      ...address,
      is_primary: address.id === addressId
    })));
    toast.success('Primary address updated.');
  };

  // Handle operations on notes
  const handleAddNote = async (content: string) => {
    // In a real app, this would be an API call
    const newNote = {
      id: notes.length + 1,
      content,
      created_at: new Date().toISOString(),
      created_by: 'Current User'
    };
    
    setNotes([newNote, ...notes]);
    toast.success('Note added successfully!');
  };

  const handleUpdateNote = async (noteId: number, content: string) => {
    // In a real app, this would be an API call
    setNotes(notes.map(note => 
      note.id === noteId
        ? { ...note, content, updated_at: new Date().toISOString() }
        : note
    ));
    toast.success('Note updated successfully!');
  };

  const handleDeleteNote = async (noteId: number) => {
    // In a real app, this would be an API call
    setNotes(notes.filter(note => note.id !== noteId));
    toast.success('Note deleted successfully!');
  };

  // Handle operations on files
  const handleUploadFile = async (file: File) => {
    // In a real app, this would be an API call to upload file
    const newFile = {
      id: files.length + 1,
      filename: file.name,
      file_type: file.type,
      file_size: file.size,
      uploaded_at: new Date().toISOString(),
      url: '#'
    };
    
    setFiles([newFile, ...files]);
    toast.success('File uploaded successfully!');
  };

  const handleDeleteFile = async (fileId: number) => {
    // In a real app, this would be an API call
    setFiles(files.filter(file => file.id !== fileId));
    toast.success('File deleted successfully!');
  };

  // Handle appointment operations
  const handleAddAppointment = () => {
    // In a real app, this would navigate to an appointment creation form
    // or open a modal to create a new appointment
    toast.success('Navigate to appointment scheduling page');
  };

  const handleViewAppointmentDetails = (appointmentId: number) => {
    // In a real app, this would navigate to the appointment details page
    toast.success(`Navigate to appointment details for ID: ${appointmentId}`);
  };

  const handleCancelAppointment = async (appointmentId: number) => {
    // In a real app, this would be an API call
    setAppointments(appointments.map(appointment => 
      appointment.id === appointmentId
        ? { ...appointment, status: 'cancelled' }
        : appointment
    ));
    toast.success('Appointment cancelled successfully!');
  };

  // Handle customer edit
  const handleEditCustomer = () => {
    setIsEditing(true);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FaSpinner className="animate-spin inline-block text-4xl text-blue-600 mb-4" />
          <p className="text-gray-600">Loading customer information...</p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Customer Not Found</h2>
          <p className="text-gray-600 mb-6">The customer you're looking for doesn't exist or you don't have permission to view it.</p>
          <Link href="/customers" className="text-blue-600 hover:text-blue-800">
            &larr; Back to Customers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>{customer.name} | Customer Profile | KeyBot</title>
      </Head>
      
      <Toaster position="top-right" />
      
      <div className="mb-6">
        <Link href="/customers" className="text-blue-600 hover:text-blue-800 flex items-center">
          <FaArrowLeft className="mr-2" /> Back to Customers
        </Link>
      </div>
      
      <CustomerCard 
        customer={customer} 
        onEdit={handleEditCustomer} 
      />
      
      <CustomerTabs 
        tabs={[
          { id: 'appointments', label: 'Appointments', icon: <FaCalendarAlt /> },
          { id: 'addresses', label: 'Addresses', icon: <FaMapMarkerAlt /> },
          { id: 'notes', label: 'Notes', icon: <FaRegStickyNote /> },
          { id: 'files', label: 'Files', icon: <FaFile /> },
        ]}
        defaultTab="appointments"
      >
        <AppointmentList 
          customerId={Number(id)} 
          appointments={appointments}
          onAddAppointment={handleAddAppointment}
          onViewDetails={handleViewAppointmentDetails}
          onCancelAppointment={handleCancelAppointment}
        />
        
        <AddressHistory 
          customerId={Number(id)} 
          addresses={addresses}
          onAddAddress={handleAddAddress}
          onDeleteAddress={handleDeleteAddress}
          onSetPrimary={handleSetPrimaryAddress}
        />
        
        <NoteList 
          customerId={Number(id)} 
          notes={notes}
          onAddNote={handleAddNote}
          onUpdateNote={handleUpdateNote}
          onDeleteNote={handleDeleteNote}
        />
        
        <FileUploader 
          customerId={Number(id)} 
          files={files}
          onUploadFile={handleUploadFile}
          onDeleteFile={handleDeleteFile}
        />
      </CustomerTabs>
    </div>
  );
};

export default CustomerProfile;
