import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Calendar, MapPin, ChevronRight, Compass } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

function Dashboard() {
  const { user, api } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tripsData, citiesData] = await Promise.all([
          api('/api/trips'),
          api('/api/cities?q=&limit=4') // Get some popular cities
        ]);
        setTrips(tripsData.slice(0, 3)); // Show only 3 recent trips
        setCities(citiesData.slice(0, 4));
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="page-container">
      <div className="welcome-banner">
        <div className="welcome-content">
          <h2>Welcome back, {user?.name?.split(' ')[0]}!</h2>
          <p>Where are we going next? The world is yours to explore.</p>
          <Link to="/trips/new" className="btn btn-primary">
            <Plus size={18} /> Plan New Trip
          </Link>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-main">
          <div className="section-header">
            <h3 className="section-title">Upcoming Trips</h3>
            {trips.length > 0 && (
              <Link to="/trips" className="btn btn-ghost btn-sm">
                View All <ChevronRight size={16} />
              </Link>
            )}
          </div>

          {loading ? (
            <div className="empty-state" style={{ padding: '40px' }}>Loading...</div>
          ) : trips.length > 0 ? (
            <div className="trips-list">
              {trips.map(trip => (
                <div key={trip.id} className="trip-card-mini" onClick={() => navigate(`/trips/${trip.id}/itinerary`)}>
                  <img src={trip.cover_image || 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop'} alt={trip.name} className="trip-img" />
                  <div className="trip-info">
                    <h4>{trip.name}</h4>
                    <p>
                      <Calendar size={14} /> 
                      {trip.start_date ? new Date(trip.start_date).toLocaleDateString() : 'Dates TBD'}
                      {trip.stop_count > 0 && <span style={{ marginLeft: '12px' }}><MapPin size={14} style={{ marginRight: '4px' }}/>{trip.stop_count} Stops</span>}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card-flat empty-state" style={{ padding: '40px 20px' }}>
              <Compass size={40} />
              <h3>No trips planned yet</h3>
              <p>Start organizing your next great adventure today.</p>
              <Link to="/trips/new" className="btn btn-primary" style={{ marginTop: '10px' }}>
                Create Your First Trip
              </Link>
            </div>
          )}
        </div>

        <div className="dashboard-sidebar">
          <div className="section-header">
            <h3 className="section-title">Inspiration</h3>
            <Link to="/explore/cities" className="btn btn-ghost btn-sm">More</Link>
          </div>
          
          <div className="grid-2">
            {cities.map(city => (
              <div key={city.id} className="city-suggestion" onClick={() => navigate(`/explore/cities?q=${city.name}`)}>
                <img src={city.image_url || `https://source.unsplash.com/400x300/?${city.name},city`} alt={city.name} onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=2070&auto=format&fit=crop'} />
                <div className="city-overlay">
                  <h4>{city.name}</h4>
                  <p>{city.country}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="card-flat" style={{ marginTop: '24px' }}>
            <h4 style={{ marginBottom: '12px', fontFamily: 'var(--font-display)' }}>Travel Tip</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Always pack a portable charger and universal adapter. Keep important documents backed up digitally.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
