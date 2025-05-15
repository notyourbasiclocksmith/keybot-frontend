import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { FaCalendarAlt, FaSpinner, FaSave, FaTimes } from 'react-icons/fa';
import { CalendarSkeleton } from '../components/SkeletonLoader';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

interface Appointment {
  id: string;
  title: string;
  start: string;
  end: string;
  customer_name: string;
  phone_number: string;
  service_type: string;
  technician_name: string;
  notes?: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

interface AppointmentFormData {
  customer_name: string;
  phone_number: string;
  service_type: string;
  technician_name: string;
  date: string;
  time: string;
  duration: number;
  notes: string;
}

export default function CalendarPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const calendarRef = useRef<any>(null);
  
  // Form state
  const [formData, setFormData] = useState<AppointmentFormData>({
    customer_name: '',
    phone_number: '',
    service_type: 'key_replacement',
    technician_name: 'John Doe',
    date: '',
    time: '09:00',
    duration: 60,
    notes: ''
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE}/appointments`);
      
      if (response.data && response.data.success) {
        setAppointments(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleDateClick = (info: any) => {
    const clickedDate = info.dateStr;
    setSelectedDate(clickedDate);
    setFormData(prev => ({ ...prev, date: clickedDate }));
    setShowModal(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Convert date and time to ISO format for API
      const startDateTime = new Date(`${formData.date}T${formData.time}`);
      const endDateTime = new Date(startDateTime.getTime() + formData.duration * 60000);
      
      const appointmentData = {
        customer_name: formData.customer_name,
        phone_number: formData.phone_number,
        service_type: formData.service_type,
        technician_name: formData.technician_name,
        start: startDateTime.toISOString(),
        end: endDateTime.toISOString(),
        notes: formData.notes,
        status: 'confirmed'
      };
      
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE}/appointments`, 
        appointmentData
      );
      
      if (response.data && response.data.success) {
        toast.success('Appointment created successfully');
        setShowModal(false);
        
        // Reset form
        setFormData({
          customer_name: '',
          phone_number: '',
          service_type: 'key_replacement',
          technician_name: 'John Doe',
          date: '',
          time: '09:00',
          duration: 60,
          notes: ''
        });
        
        // Refresh appointments
        fetchAppointments();
      } else {
        throw new Error(response.data?.message || 'Failed to create appointment');
      }
    } catch (error: any) {
      console.error('Error creating appointment:', error);
      toast.error(error?.response?.data?.message || error.message || 'Error creating appointment');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format appointments for FullCalendar
  const events = appointments.map(appointment => ({
    id: appointment.id,
    title: `${appointment.customer_name} - ${appointment.service_type}`,
    start: appointment.start,
    end: appointment.end,
    extendedProps: {
      customer_name: appointment.customer_name,
      phone_number: appointment.phone_number,
      service_type: appointment.service_type,
      technician_name: appointment.technician_name,
      notes: appointment.notes,
      status: appointment.status
    },
    backgroundColor: appointment.status === 'confirmed' ? '#4CAF50' : 
                      appointment.status === 'pending' ? '#FFC107' : 
                      '#F44336' // cancelled
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>Appointment Calendar - KeyBot</title>
      </Head>
      
      <Toaster position="top-right" />
      
      {/* Calendar header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <FaCalendarAlt className="mr-2 text-blue-600" />
          Appointment Calendar
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center"
        >
          <FaCalendarAlt className="mr-2" /> Schedule Appointment
        </button>
      </div>
      
      {/* Main calendar */}
      <div className="bg-white rounded-lg shadow-md p-4">
        {loading ? (
          <CalendarSkeleton />
        ) : (
          <div className="h-[700px]">
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
              }}
              events={events}
              dateClick={handleDateClick}
              eventClick={(info) => {
                toast(info.event.title, {
                  icon: '📋',
                  duration: 3000
                });
              }}
              height="100%"
              slotMinTime="07:00:00"
              slotMaxTime="20:00:00"
              allDaySlot={false}
              nowIndicator={true}
              businessHours={{
                daysOfWeek: [1, 2, 3, 4, 5],
                startTime: '08:00',
                endTime: '18:00',
              }}
            />
          </div>
        )}
      </div>
      
      {/* Appointment Form Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-800">Schedule New Appointment</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                  <select
                    name="duration"
                    value={formData.duration}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="30">30 minutes</option>
                    <option value="60">60 minutes</option>
                    <option value="90">90 minutes</option>
                    <option value="120">120 minutes</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                  <input
                    type="text"
                    name="customer_name"
                    value={formData.customer_name}
                    onChange={handleFormChange}
                    placeholder="John Smith"
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleFormChange}
                    placeholder="(555) 123-4567"
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
                  <select
                    name="service_type"
                    value={formData.service_type}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="key_replacement">Key Replacement</option>
                    <option value="key_duplication">Key Duplication</option>
                    <option value="lock_repair">Lock Repair</option>
                    <option value="emergency_lockout">Emergency Lockout</option>
                    <option value="consultation">Consultation</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Technician</label>
                  <select
                    name="technician_name"
                    value={formData.technician_name}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="John Doe">John Doe</option>
                    <option value="Jane Smith">Jane Smith</option>
                    <option value="Mike Johnson">Mike Johnson</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleFormChange}
                    placeholder="Any special instructions or requirements"
                    className="w-full px-3 py-2 border rounded-md h-24"
                  ></textarea>
                </div>
              </div>
              
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center justify-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" /> Scheduling...
                    </>
                  ) : (
                    <>
                      <FaSave className="mr-2" /> Schedule Appointment
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}