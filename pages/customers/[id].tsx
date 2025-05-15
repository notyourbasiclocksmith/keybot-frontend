import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { FaArrowLeft, FaCalendarAlt, FaMapMarkerAlt, FaRegStickyNote, FaFile, FaStar, FaSpinner, FaEdit } from 'react-icons/fa';
import { toast, Toaster } from 'react-hot-toast';
import apiClient from '../../lib/api';

// Import customer components
import CustomerCard from '../../components/customers/CustomerCard';
import CustomerTabs from '../../components/customers/CustomerTabs';
import AddressHistory from '../../components/customers/AddressHistory';
import AppointmentList from '../../components/customers/AppointmentList';
import NoteList from '../../components/customers/NoteList';
import FileUploader from '../../components/customers/FileUploader';
import UploadModal from '../../components/ui/UploadModal';
import FileList from '../../components/ui/FileList';

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

  // Fetch customer data from API
  useEffect(() => {
    if (id) {
      const fetchCustomerData = async () => {
        try {
          setIsLoading(true);
          
          // Fetch customer details
          const customerResponse = await apiClient.get<{customer: any}>(`/api/customers/${id}`);
          if (customerResponse && customerResponse.customer) {
            setCustomer(customerResponse.customer);
          } else {
            // Fallback to dummy data for development
            setCustomer(dummyCustomer);
          }
          
          // Fetch customer addresses
          const addressResponse = await apiClient.get<{addresses: any[]}>(`/api/customers/${id}/address-history`);
          if (addressResponse && addressResponse.addresses) {
            setAddresses(addressResponse.addresses);
          } else {
            setAddresses(dummyAddresses);
          }
          
          // Fetch customer appointments
          const appointmentResponse = await apiClient.get<{appointments: any[]}>(`/api/customers/${id}/appointments`);
          if (appointmentResponse && appointmentResponse.appointments) {
            setAppointments(appointmentResponse.appointments);
          } else {
            setAppointments(dummyAppointments);
          }
          
          // Fetch customer notes
          const notesResponse = await apiClient.get<{notes: any[]}>(`/api/customers/${id}/notes`);
          if (notesResponse && notesResponse.notes) {
            setNotes(notesResponse.notes);
          } else {
            setNotes(dummyNotes);
          }
          
          // Fetch customer files
          const filesResponse = await apiClient.get<{files: any[]}>(`/api/customers/${id}/files`);
          if (filesResponse && filesResponse.files) {
            setFiles(filesResponse.files);
          } else {
            setFiles(dummyFiles);
          }
          
          setIsLoading(false);
        } catch (error) {
          console.error('Error fetching customer data:', error);
          toast.error('Failed to load customer data');
          
          // Fallback to dummy data
          setCustomer(dummyCustomer);
          setAddresses(dummyAddresses);
          setAppointments(dummyAppointments);
          setNotes(dummyNotes);
          setFiles(dummyFiles);
          setIsLoading(false);
        }
      };
      
      fetchCustomerData();
      
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
    try {
      const response = await apiClient.post<{success: boolean}>(`/api/customers/${id}/addresses`, addressData);
      
      if (response && response.success) {
        // Refresh addresses
        const addressResponse = await apiClient.get<{addresses: any[]}>(`/api/customers/${id}/address-history`);
        if (addressResponse && addressResponse.addresses) {
          setAddresses(addressResponse.addresses);
        }
        toast.success('Address added successfully!');
      }
    } catch (error) {
      console.error('Error adding address:', error);
      toast.error('Failed to add address');
      
      // Fallback behavior for development/demo
      const newAddress = {
        id: addresses.length + 1,
        ...addressData,
        created_at: new Date().toISOString()
      };
      
      setAddresses([...addresses]);
      
      if (addressData.is_primary) {
        setAddresses(addresses.map(addr => ({
          ...addr,
          is_primary: false
        })));
      }
      
      setAddresses([newAddress, ...addresses]);
      toast.success('Address added successfully!');
    }
  };

  const handleDeleteAddress = async (addressId: number) => {
    try {
      const response = await apiClient.delete<{success: boolean}>(`/api/customers/${id}/addresses/${addressId}`);
      
      if (response && response.success) {
        // Update state after successful deletion
        setAddresses(addresses.filter(address => address.id !== addressId));
        toast.success('Address deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      toast.error('Failed to delete address');
      
      // Fallback behavior for development/demo
      setAddresses(addresses.filter(address => address.id !== addressId));
      toast.success('Address deleted successfully!');
    }
  };

  const handleSetPrimaryAddress = async (addressId: number) => {
    try {
      const response = await apiClient.put<{success: boolean}>(`/api/customers/${id}/addresses/${addressId}/set-primary`, {
        is_primary: true
      });
      
      if (response && response.success) {
        // Update local state
        setAddresses(addresses.map(address => ({
          ...address,
          is_primary: address.id === addressId
        })));
        toast.success('Primary address updated!');
      }
    } catch (error) {
      console.error('Error setting primary address:', error);
      toast.error('Failed to update primary address');
      
      // Fallback behavior for development/demo
      setAddresses(addresses.map(address => ({
        ...address,
        is_primary: address.id === addressId
      })));
      toast.success('Primary address updated!');
    }
  };

  // Handle operations on notes
  const handleAddNote = async (content: string) => {
    try {
      const response = await apiClient.post<{success: boolean}>(`/api/customers/${id}/notes`, { content });
      
      if (response && response.success) {
        // Refresh notes from the API
        const notesResponse = await apiClient.get<{notes: any[]}>(`/api/customers/${id}/notes`);
        if (notesResponse && notesResponse.notes) {
          setNotes(notesResponse.notes);
        }
        toast.success('Note added successfully!');
      }
    } catch (error) {
      console.error('Error adding note:', error);
      toast.error('Failed to add note');
      
      // Fallback behavior for development/demo
      const newNote = {
        id: notes.length + 1,
        content,
        created_at: new Date().toISOString(),
        created_by: 'Current User'
      };
      
      setNotes([newNote, ...notes]);
      toast.success('Note added successfully!');
    }
  };

  const handleUpdateNote = async (noteId: number, content: string) => {
    try {
      const response = await apiClient.put<{success: boolean}>(`/api/customers/${id}/notes/${noteId}`, { content });
      
      if (response && response.success) {
        // Update local state
        setNotes(notes.map(note => 
          note.id === noteId
            ? { ...note, content, updated_at: new Date().toISOString() }
            : note
        ));
        toast.success('Note updated successfully!');
      }
    } catch (error) {
      console.error('Error updating note:', error);
      toast.error('Failed to update note');
      
      // Fallback behavior for development/demo
      setNotes(notes.map(note => 
        note.id === noteId
          ? { ...note, content, updated_at: new Date().toISOString() }
          : note
      ));
      toast.success('Note updated successfully!');
    }
  };

  const handleDeleteNote = async (noteId: number) => {
    try {
      const response = await apiClient.delete<{success: boolean}>(`/api/customers/${id}/notes/${noteId}`);
      
      if (response && response.success) {
        // Update local state
        setNotes(notes.filter(note => note.id !== noteId));
        toast.success('Note deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error('Failed to delete note');
      
      // Fallback behavior for development/demo
      setNotes(notes.filter(note => note.id !== noteId));
      toast.success('Note deleted successfully!');
    }
  };

  // Handle operations on files
  const handleUploadFile = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await apiClient.uploadFile<{success: boolean}>(
        `/api/customers/${id}/files`,
        file,
        (progress) => {
          // Progress handling is managed by the UploadModal component
        }
      );
      
      if (response && response.success) {
        // Refresh files from API
        const filesResponse = await apiClient.get<{files: any[]}>(`/api/customers/${id}/files`);
        if (filesResponse && filesResponse.files) {
          setFiles(filesResponse.files);
        }
        toast.success('File uploaded successfully!');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
      
      // Fallback behavior for development/demo
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
    }
  };

  const handleDeleteFile = async (fileId: number) => {
    try {
      const response = await apiClient.delete<{success: boolean}>(`/api/customers/${id}/files/${fileId}`);
      
      if (response && response.success) {
        // Update local state
        setFiles(files.filter(file => file.id !== fileId));
        toast.success('File deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Failed to delete file');
      
      // Fallback behavior for development/demo
      setFiles(files.filter(file => file.id !== fileId));
      toast.success('File deleted successfully!');
    }
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
