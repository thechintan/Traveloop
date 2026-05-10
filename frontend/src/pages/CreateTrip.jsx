import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Camera, Calendar, Map, Check } from 'lucide-react';
import './CreateTrip.css';

function CreateTrip() {
  const { api } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    cover_image: ''
  });

  // Simple hardcoded images for demo
  const coverOptions = [
    'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=1931&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=2020&auto=format&fit=crop'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const trip = await api('/api/trips', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          cover_image: formData.cover_image || coverOptions[Math.floor(Math.random() * coverOptions.length)]
        })
      });
      navigate(`/trips/${trip.id}/build`);
    } catch (err) {
      setError(err.message || 'Failed to create trip');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container create-trip-container">
      <div className="page-header">
        <h1>Create a New Trip</h1>
        <p>Give your trip a name and dates to start building your itinerary.</p>
      </div>

      <div className="card">
        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="cover-image-picker" onClick={() => setFormData({...formData, cover_image: coverOptions[Math.floor(Math.random() * coverOptions.length)]})}>
            {formData.cover_image ? (
              <>
                <img src={formData.cover_image} alt="Cover" />
                <div className="cover-overlay">
                  <span className="btn btn-secondary"><Camera size={16} /> Change Cover</span>
                </div>
              </>
            ) : (
              <>
                <Camera size={40} style={{ marginBottom: '12px', opacity: 0.5 }} />
                <span>Click to select a random cover photo</span>
              </>
            )}
          </div>

          <div className="input-group" style={{ marginBottom: '20px' }}>
            <label>Trip Name <span style={{ color: 'var(--danger)' }}>*</span></label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="e.g. Summer in Europe, Backpacking Asia..." 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required 
              style={{ fontSize: '1.2rem', padding: '14px' }}
            />
          </div>

          <div className="date-inputs" style={{ marginBottom: '20px' }}>
            <div className="input-group">
              <label>Start Date</label>
              <div style={{ position: 'relative' }}>
                <Calendar size={18} style={{ position: 'absolute', left: 14, top: 12, color: 'var(--text-muted)' }} />
                <input 
                  type="date" 
                  className="input-field" 
                  style={{ paddingLeft: 40 }}
                  value={formData.start_date}
                  onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                />
              </div>
            </div>
            <div className="input-group">
              <label>End Date</label>
              <div style={{ position: 'relative' }}>
                <Calendar size={18} style={{ position: 'absolute', left: 14, top: 12, color: 'var(--text-muted)' }} />
                <input 
                  type="date" 
                  className="input-field" 
                  style={{ paddingLeft: 40 }}
                  value={formData.end_date}
                  onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="input-group" style={{ marginBottom: '30px' }}>
            <label>Description (Optional)</label>
            <textarea 
              className="input-field" 
              placeholder="What's the purpose of this trip?"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            ></textarea>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button type="button" className="btn btn-ghost" onClick={() => navigate('/trips')}>Cancel</button>
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading || !formData.name}>
              {loading ? 'Creating...' : <><Map size={20} /> Create Trip</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTrip;
