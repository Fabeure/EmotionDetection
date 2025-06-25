import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Sessions.scss';
import Overview from '../../components/overview/Overview';
import EmotionDistribution from '../../components/visualizations/EmotionDistribution';
import TimeTrends from '../../components/visualizations/TimeTrends';
import ValenceArousal from '../../components/visualizations/ValenceArousal';
import StimulusAnalysis from '../../components/visualizations/StimulusAnalysis';
import Statistics from '../../components/statistics/Statistics';
import RawLogs from '../../components/RawLogs/RawLogs';

const STIMULUS_TYPES = {
  0: 'Visual',
  1: 'Audio',
  2: 'Proximity',
  3: 'Custom'
};

const EMOTION_LABELS = {
  0: 'Neutral',
  1: 'Happy',
  2: 'Sad',
  3: 'Angry',
  4: 'Fearful',
  5: 'Disgusted',
  6: 'Surprised'
};

const FEATURE_NAMES = {
  'volume': 'Volume',
  'pitch': 'Pitch',
  'distance': 'Distance'
};

const getStimulusTypeName = (type) => {
  return STIMULUS_TYPES[type] || 'Unknown';
};

const getEmotionLabelName = (label) => {
  return EMOTION_LABELS[label] || 'Unknown';
};

const getFeatureName = (name) => {
  return FEATURE_NAMES[name] || name;
};

const Sessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSession] = useState(null);
  const [showOnlySceneSessions, setShowOnlySceneSessions] = useState(false);
  const [showOnlyStimulusSessions, setShowOnlyStimulusSessions] = useState(false);
  const [showOnlyEmotionSessions, setShowOnlyEmotionSessions] = useState(false);
  const [showOnlyFeatureSessions, setShowOnlyFeatureSessions] = useState(false);
  const [groupBy, setGroupBy] = useState('none');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Retrieved token:', token);

        if (!token) {
          console.log('No token found, redirecting to login');
          navigate('/login');
          return;
        }

        console.log('Making API requests with token');
        const [sessionsResponse, trackableObjectsResponse] = await Promise.all([
          fetch('http://localhost:3000/api/sessions', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }),
          fetch('http://localhost:3000/api/trackable-objects', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
        ]);

        if (!sessionsResponse.ok || !trackableObjectsResponse.ok) {
          const errorData = await sessionsResponse.json();
          console.error('API Error:', errorData);
          throw new Error(errorData.message || 'Failed to fetch data');
        }

        const sessionsData = await sessionsResponse.json();
        const trackableObjectsData = await trackableObjectsResponse.json();
        
        console.log('Raw sessions data:', sessionsData);
        console.log('Raw trackable objects data:', trackableObjectsData);
        
        // Store raw trackable objects data for later use
        localStorage.setItem('allTrackableObjects', JSON.stringify(trackableObjectsData));
        
        // Parse the session data
        const parsedSessions = sessionsData.map(session => {
          try {
            console.log('Processing session:', session._id);
            
            // Split the content by new lines
            const lines = session.content.split('\n');
            
            // Get metadata from first 11 lines
            const metadataLines = lines.slice(0, 11);
            const metadataJson = metadataLines
              .map(line => line.replace('#SESSION', '').trim())
              .join('\n');
            
            console.log('Metadata JSON:', metadataJson);
            const metadata = JSON.parse(metadataJson);
            
            // Get data entries from remaining lines
            const dataEntries = lines.slice(11)
              .filter(line => line.trim() !== '')
              .map(line => {
                try {
                  const entry = JSON.parse(line);
                  return entry;
                } catch (e) {
                  console.error('Error parsing data line:', line, e);
                  return null;
                }
              })
              .filter(entry => entry !== null);
            
            console.log('Data entries count:', dataEntries.length);
            
            // Get stimulus type, emotion label, and feature name from first data entry if it exists
            const stimulusType = dataEntries.length > 0 ? dataEntries[0].StimulusType : undefined;
            const emotionLabel = dataEntries.length > 0 ? dataEntries[0].Emotion?.Label : undefined;
            const featureName = dataEntries.length > 0 ? dataEntries[0].FeatureName : undefined;
            
            return {
              ...session,
              metadata,
              dataEntries,
              entryCount: dataEntries.length,
              isSceneSession: metadata.SessionName === '#SCENENAMESESSION',
              isStimulusSession: metadata.SessionName === '#STIMULUSTYPESESSION',
              isEmotionSession: metadata.SessionName === '#EMOTIONLABELSESSION',
              isFeatureSession: metadata.SessionName === '#FEATURENAMESESSION',
              stimulusType,
              stimulusTypeName: getStimulusTypeName(stimulusType),
              emotionLabel,
              emotionLabelName: getEmotionLabelName(emotionLabel),
              featureName,
              featureNameDisplay: getFeatureName(featureName)
            };
          } catch (err) {
            console.error('Error parsing session:', err);
            return {
              ...session,
              metadata: null,
              dataEntries: [],
              entryCount: 0,
              error: err.message
            };
          }
        });

        console.log('Final parsed sessions:', parsedSessions);
        setSessions(parsedSessions);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [navigate]);

  const handleSessionClick = (session) => {
    // Extract unique TrackableIds from data entries
    const uniqueTrackableIds = [...new Set(
      session.dataEntries
        .filter(entry => entry.TrackableId)
        .map(entry => entry.TrackableId)
    )];

    // Get all trackable objects from localStorage
    const allTrackableObjects = JSON.parse(localStorage.getItem('allTrackableObjects') || '[]');

    // Create a map of trackable objects by their IDs
    const trackableObjectsMap = new Map();

    allTrackableObjects.forEach(trackable => {
      try {
        // First parse the outer content string
        const parsedContent = JSON.parse(trackable.content);
        
        // Then parse the inner objects array (if exists)
        const content = typeof parsedContent === 'string' ? 
          JSON.parse(parsedContent) : 
          parsedContent;
        
        // Get the objects array (either directly or from objects property)
        const objects = Array.isArray(content) ? 
          content : 
          (content.objects || [content]);
        
        // Process each object
        objects.forEach(obj => {
          if (obj.guid) {
            trackableObjectsMap.set(obj.guid, obj);
          }
        });
      } catch (e) {
        console.error('Error parsing trackable objects:', e, 'Content:', trackable.content);
      }
    });

    // Create an object containing all trackable objects that match the found IDs
    const sessionTrackableObjects = uniqueTrackableIds.reduce((acc, trackableId) => {
      const trackableObject = trackableObjectsMap.get(trackableId);
      if (trackableObject) {
        acc[trackableId] = trackableObject;
      }
      return acc;
    }, {});

    // Store both the session data and trackable objects in localStorage
    console.log("session objects:", sessionTrackableObjects)
    localStorage.setItem('currentSessionData', JSON.stringify(session.dataEntries));
    localStorage.setItem('currentTrackableObjects', JSON.stringify(sessionTrackableObjects));
    
    // Navigate to home page
    navigate('/');
  };


  const filteredSessions = sessions.filter(session => {
    if (showOnlySceneSessions) return session.isSceneSession;
    if (showOnlyStimulusSessions) return session.isStimulusSession;
    if (showOnlyEmotionSessions) return session.isEmotionSession;
    if (showOnlyFeatureSessions) return session.isFeatureSession;
    return !session.isSceneSession && !session.isStimulusSession && !session.isEmotionSession && !session.isFeatureSession; // Show regular sessions by default
  });

  const groupedSessions = groupBy === 'scene' 
    ? filteredSessions.reduce((groups, session) => {
        const sceneName = session.metadata?.SceneName || 'Unknown Scene';
        if (!groups[sceneName]) {
          groups[sceneName] = [];
        }
        groups[sceneName].push(session);
        return groups;
      }, {})
    : groupBy === 'stimulus'
    ? filteredSessions.reduce((groups, session) => {
        const stimulusType = session.stimulusTypeName || 'Unknown Stimulus';
        if (!groups[stimulusType]) {
          groups[stimulusType] = [];
        }
        groups[stimulusType].push(session);
        return groups;
      }, {})
    : groupBy === 'emotion'
    ? filteredSessions.reduce((groups, session) => {
        const emotionLabel = session.emotionLabelName || 'Unknown Emotion';
        if (!groups[emotionLabel]) {
          groups[emotionLabel] = [];
        }
        groups[emotionLabel].push(session);
        return groups;
      }, {})
    : groupBy === 'feature'
    ? filteredSessions.reduce((groups, session) => {
        const featureName = session.featureNameDisplay || 'Unknown Feature';
        if (!groups[featureName]) {
          groups[featureName] = [];
        }
        groups[featureName].push(session);
        return groups;
      }, {})
    : { 'All Sessions': filteredSessions };

  if (loading) {
    return (
      <div className="sessions-container">
        <div className="loading">Loading sessions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="sessions-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="sessions-container">
      <div className="sessions-header">
        <h1>Your Sessions</h1>
        <div className="sessions-controls">
          <select 
            className="group-select"
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value)}
          >
            <option value="none">No Grouping</option>
            <option value="scene">Group by Scene</option>
            <option value="stimulus">Group by Stimulus Type</option>
            <option value="emotion">Group by Emotion</option>
            <option value="feature">Group by Feature</option>
          </select>
          <div className="filter-buttons">
            <button 
              className={`filter-toggle ${showOnlySceneSessions ? 'active' : ''}`}
              onClick={() => {
                setShowOnlySceneSessions(!showOnlySceneSessions);
                setShowOnlyStimulusSessions(false);
                setShowOnlyEmotionSessions(false);
                setShowOnlyFeatureSessions(false);
              }}
            >
              {showOnlySceneSessions ? 'Show Regular Sessions' : 'Show Scene Sessions'}
            </button>
            <button 
              className={`filter-toggle ${showOnlyStimulusSessions ? 'active' : ''}`}
              onClick={() => {
                setShowOnlyStimulusSessions(!showOnlyStimulusSessions);
                setShowOnlySceneSessions(false);
                setShowOnlyEmotionSessions(false);
                setShowOnlyFeatureSessions(false);
              }}
            >
              {showOnlyStimulusSessions ? 'Show Regular Sessions' : 'Show Stimulus Sessions'}
            </button>
            <button 
              className={`filter-toggle ${showOnlyEmotionSessions ? 'active' : ''}`}
              onClick={() => {
                setShowOnlyEmotionSessions(!showOnlyEmotionSessions);
                setShowOnlySceneSessions(false);
                setShowOnlyStimulusSessions(false);
                setShowOnlyFeatureSessions(false);
              }}
            >
              {showOnlyEmotionSessions ? 'Show Regular Sessions' : 'Show Emotion Sessions'}
            </button>
            <button 
              className={`filter-toggle ${showOnlyFeatureSessions ? 'active' : ''}`}
              onClick={() => {
                setShowOnlyFeatureSessions(!showOnlyFeatureSessions);
                setShowOnlySceneSessions(false);
                setShowOnlyStimulusSessions(false);
                setShowOnlyEmotionSessions(false);
              }}
            >
              {showOnlyFeatureSessions ? 'Show Regular Sessions' : 'Show Feature Sessions'}
            </button>
          </div>
        </div>
      </div>
      
      {filteredSessions.length === 0 ? (
        <div className="no-sessions">
          <p>No sessions found.</p>
        </div>
      ) : (
        <div className="sessions-grid-container">
          {Object.entries(groupedSessions).map(([groupName, groupSessions]) => (
            <div key={groupName} className="session-group">
              {groupBy !== 'none' && <h2 className="group-title">{groupName}</h2>}
              <div className="sessions-grid">
                {groupSessions.map((session) => (
                  <div 
                    key={session._id} 
                    className={`session-card ${selectedSession?._id === session._id ? 'selected' : ''}`}
                    onClick={() => handleSessionClick(session)}
                    title={
                      session.isStimulusSession 
                        ? `Stimulus Type: ${session.stimulusTypeName}`
                        : session.isEmotionSession
                        ? `Emotion: ${session.emotionLabelName}`
                        : session.isFeatureSession
                        ? `Feature: ${session.featureNameDisplay}`
                        : undefined
                    }
                  >
                    <div className="session-header">
                      <h3>{session.metadata?.SessionName || 'Unnamed Session'}</h3>
                      <span className="date">
                        {new Date(session.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="session-content">
                      <div className="session-meta">
                        <p><strong>Scene:</strong> {session.metadata?.SceneName || 'N/A'}</p>
                        <p><strong>Tester:</strong> {session.metadata?.TesterName || 'N/A'}</p>
                        {session.metadata?.Tags && (
                          <p><strong>Tags:</strong> {session.metadata.Tags}</p>
                        )}
                        <p><strong>Entries:</strong> {session.entryCount}</p>
                        {session.isStimulusSession && (
                          <p><strong>Stimulus Type:</strong> {session.stimulusTypeName}</p>
                        )}
                        {session.isEmotionSession && (
                          <p><strong>Emotion:</strong> {session.emotionLabelName}</p>
                        )}
                        {session.isFeatureSession && (
                          <p><strong>Feature:</strong> {session.featureNameDisplay}</p>
                        )}
                      </div>
                      
                      <div className="session-stats">
                        <p><strong>Logger Mode:</strong> {session.metadata?.LoggerMode || 'N/A'}</p>
                        <p><strong>Log Target:</strong> {session.metadata?.LogTarget || 'N/A'}</p>
                        <p><strong>Flush Interval:</strong> {session.metadata?.FlushInterval || 'N/A'}s</p>
                        <p><strong>Local Path:</strong> {session.metadata?.LocalPath || 'N/A'}</p>
                      </div>
                    </div>
                    
                    {session.error && (
                      <div className="session-error">
                        <p>Error parsing session data: {session.error}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Sessions;