import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import axios from 'axios';
import { FaFileAudio, FaUpload, FaSpinner, FaPlay, FaPause } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';

interface RecordingData {
  url: string;
  customer_name: string;
  created_at: string;
  quote_number: string;
}

export default function RecordingPage() {
  const router = useRouter();
  const { quote_number } = router.query;
  
  const [recording, setRecording] = useState<RecordingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  // Fetch recording data when quote number is available from URL
  useEffect(() => {
    if (!quote_number) return;
    
    const fetchRecording = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE}/recordings/${quote_number}`);
        
        if (response.data && response.data.success && response.data.data) {
          setRecording(response.data.data);
        } else {
          toast.error('No recording found for this quote');
        }
      } catch (error) {
        // Error handled by toast notification
        toast.error('Failed to load recording');
      } finally {
        setLoading(false);
      }
    };

    fetchRecording();
  }, [quote_number]);

  // Initialize audio player
  useEffect(() => {
    if (recording && recording.url) {
      const audio = new Audio(recording.url);
      audio.addEventListener('ended', () => {
        setPlaying(false);
      });
      setAudioElement(audio);

      return () => {
        audio.pause();
        audio.src = '';
      };
    }
  }, [recording]);

  const togglePlayPause = () => {
    if (!audioElement) return;
    
    if (playing) {
      audioElement.pause();
    } else {
      audioElement.play().catch(err => {
        // Error playing audio handled by notification
        toast.error('Error playing recording');
      });
    }
    
    setPlaying(!playing);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      // Check if file is audio
      if (file.type.startsWith('audio/')) {
        setUploadFile(file);
      } else {
        toast.error('Please select an audio file');
      }
    }
  };

  const handleUpload = async () => {
    if (!uploadFile || !quote_number) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('quote_number', quote_number as string);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE}/recordings/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        toast.success('Recording uploaded successfully');
        setUploadFile(null);
        // Refresh recording data
        const recordingRes = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE}/recordings/${quote_number}`);
        if (recordingRes.data && recordingRes.data.success && recordingRes.data.data) {
          setRecording(recordingRes.data.data);
        }
      } else {
        toast.error(response.data.message || 'Upload failed');
      }
    } catch (error: any) {
      // Error handled by toast notification
      toast.error(error.response?.data?.message || 'Error uploading recording');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>Recording - Quote #{quote_number} | KeyBot</title>
      </Head>
      
      <Toaster position="top-right" />
      
      <div className="flex items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <FaFileAudio className="mr-2 text-blue-600" /> Recording for Quote #{quote_number}
        </h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Recording */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-blue-500">Current Recording</h2>
          
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <FaSpinner className="animate-spin text-blue-600 text-2xl" />
              <span className="ml-2 text-gray-600">Loading recording...</span>
            </div>
          ) : recording && recording.url ? (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                <div><span className="font-medium">Customer:</span> {recording.customer_name}</div>
                <div><span className="font-medium">Quote #:</span> {recording.quote_number}</div>
                <div><span className="font-medium">Added on:</span> {new Date(recording.created_at).toLocaleString()}</div>
                <div><span className="font-medium">Recording URL:</span> <a href={recording.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate block overflow-ellipsis">{recording.url}</a></div>
              </div>
              
              <div>
                <p className="font-medium mb-2">Play Recording:</p>
                <div className="bg-gray-100 p-3 rounded-lg flex items-center">
                  <button 
                    onClick={togglePlayPause}
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${playing ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                  >
                    {playing ? <FaPause /> : <FaPlay />}
                  </button>
                  <div className="ml-4 flex-1">
                    <p className="text-sm text-gray-500">
                      {playing ? 'Now playing...' : 'Click to play recording'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Recording for quote #{quote_number}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-gray-500 text-sm">
                  You can also download the recording directly from 
                  <a 
                    href={`https://keybot-recordings.nyc3.digitaloceanspaces.com/${quote_number}.mp3`} 
                    download 
                    className="text-blue-600 hover:underline mx-1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    DigitalOcean Spaces
                  </a>
                  if needed.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-center">
              <p className="text-yellow-700">No recording available for this quote.</p>
              <p className="text-yellow-600 mt-2 text-sm">Upload a recording using the form on the right.</p>
            </div>
          )}
        </div>
        
        {/* Upload New Recording */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-blue-500">Upload New Recording</h2>
          
          <div className="space-y-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Audio File</label>
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </div>
            
            {uploadFile && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                <p className="font-semibold">Selected File:</p>
                <p className="text-gray-700">{uploadFile.name}</p>
                <p className="text-gray-500 text-sm">{Math.round(uploadFile.size / 1024)} KB</p>
              </div>
            )}
            
            <button 
              onClick={handleUpload} 
              disabled={!uploadFile || uploading}
              className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center justify-center w-full ${(!uploadFile || uploading) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {uploading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" /> Uploading...
                </>
              ) : (
                <>
                  <FaUpload className="mr-2" /> Upload Recording
                </>
              )}
            </button>
            
            <div className="bg-gray-50 border border-gray-200 rounded-md p-3 text-sm">
              <p className="font-medium mb-1">Note:</p>
              <ul className="list-disc pl-5 space-y-1 text-gray-600">
                <li>Accepted audio formats: MP3, WAV, M4A</li>
                <li>Maximum file size: 10MB</li>
                <li>Recording will be associated with quote #{quote_number}</li>
                <li>Uploading a new recording will replace any existing one</li>
              </ul>
            </div>
            
            <p className="text-xs text-gray-500">
              By uploading a recording, you confirm that you have the necessary permissions to share this audio and that it complies with all privacy regulations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}