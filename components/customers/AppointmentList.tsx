import React, { useState } from 'react';
import { FaCalendarAlt, FaClock, FaUserClock, FaMapMarkerAlt, FaComments, FaPlus, FaEllipsisH } from 'react-icons/fa';

interface Appointment {
  id: number;
  date: string;
  time: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  service_type: string;
  technician: string;
  location: string;
  notes?: string;
}

interface AppointmentListProps {
  customerId: number;
  appointments: Appointment[];
  onAddAppointment?: () => void;
  onViewDetails?: (appointmentId: number) => void;
  onCancelAppointment?: (appointmentId: number) => Promise<void>;
}

const AppointmentList: React.FC<AppointmentListProps> = ({
  customerId,
  appointments,
  onAddAppointment,
  onViewDetails,
  onCancelAppointment
}) => {
  const [expandedAppointment, setExpandedAppointment] = useState<number | null>(null);

  const getStatusBadgeClasses = (status: Appointment['status']) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'no-show':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (time: string) => {
    try {
      const [hours, minutes] = time.split(':');
      const date = new Date();
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));
      
      return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    } catch (error) {
      return time;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    } catch (error) {
      return dateString;
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedAppointment(expandedAppointment === id ? null : id);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Appointments</h3>
        {onAddAppointment && (
          <button
            onClick={onAddAppointment}
            className="text-sm flex items-center text-blue-600 hover:text-blue-800"
          >
            <FaPlus className="mr-1" /> Schedule Appointment
          </button>
        )}
      </div>

      {appointments.length === 0 ? (
        <div className="text-center p-6 bg-gray-50 border border-gray-200 rounded-md">
          <FaCalendarAlt className="mx-auto text-gray-400 text-3xl mb-2" />
          <p className="text-gray-500">No appointments found for this customer.</p>
          {onAddAppointment && (
            <button
              onClick={onAddAppointment}
              className="mt-2 text-blue-600 hover:text-blue-800"
            >
              Schedule an appointment
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm"
            >
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div className={`${getStatusBadgeClasses(appointment.status)} p-2 rounded-full mr-3`}>
                      <FaCalendarAlt />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{appointment.service_type}</h4>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <FaCalendarAlt className="mr-1" />
                        <span>{formatDate(appointment.date)}</span>
                        <span className="mx-1">•</span>
                        <FaClock className="mr-1" />
                        <span>{formatTime(appointment.time)}</span>
                        <span className="mx-1">•</span>
                        <span>{appointment.duration} min</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className={`mr-3 px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClasses(appointment.status)}`}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span>
                    <button 
                      onClick={() => toggleExpand(appointment.id)} 
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <FaEllipsisH />
                      <span className="sr-only">Show details</span>
                    </button>
                  </div>
                </div>
                
                {expandedAppointment === appointment.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm flex items-center text-gray-500 mb-2">
                          <FaUserClock className="mr-2" />
                          <span className="font-medium">Technician:</span>
                          <span className="ml-1">{appointment.technician}</span>
                        </p>
                        <p className="text-sm flex items-center text-gray-500">
                          <FaMapMarkerAlt className="mr-2" />
                          <span className="font-medium">Location:</span>
                          <span className="ml-1">{appointment.location}</span>
                        </p>
                      </div>
                      
                      {appointment.notes && (
                        <div>
                          <p className="text-sm flex items-start text-gray-500">
                            <FaComments className="mr-2 mt-1" />
                            <span>
                              <span className="font-medium">Notes:</span>
                              <span className="ml-1 block">{appointment.notes}</span>
                            </span>
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end space-x-3">
                      {onViewDetails && (
                        <button
                          onClick={() => onViewDetails(appointment.id)}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          View Details
                        </button>
                      )}
                      
                      {onCancelAppointment && appointment.status === 'scheduled' && (
                        <button
                          onClick={() => onCancelAppointment(appointment.id)}
                          className="text-sm text-red-600 hover:text-red-800"
                        >
                          Cancel Appointment
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppointmentList;
