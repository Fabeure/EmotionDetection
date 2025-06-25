import React, { useMemo } from 'react';
import './Heatmap.scss';

const COLORS = {
    0: "#95a5a6", // Neutral
    1: "#2ecc71", // Happy
    2: "#3498db", // Sad
    3: "#e74c3c", // Angry
    4: "#f1c40f", // Fearful
    5: "#8e44ad", // Disgusted
    6: "#e67e22"  // Surprised
};

const EMOTION_NAMES = {
    0: "Neutral",
    1: "Happy",
    2: "Sad",
    3: "Angry",
    4: "Fearful",
    5: "Disgusted",
    6: "Surprised"
};

const GRID_SIZE = 40; // Define the number of cells in the grid (e.g., 40x40)

const Heatmap = ({ data }) => {
  console.log("Initial data:", data);

  const processedData = useMemo(() => {
    if (!data?.length) {
      console.log("No data available");
      return [];
    }

    // Get and parse trackable objects
    const getTrackableObjects = () => {
      try {
        const serialized = localStorage.getItem('currentTrackableObjects');
        console.log("Raw localStorage data:", serialized);
        
        if (!serialized) {
          console.log("No trackable objects in localStorage");
          return [];
        }
        
        const parsed = JSON.parse(serialized);
        console.log("parsed before: ", parsed);

        // This will return an array of the object values
        const valuesArray = Object.values(parsed);
        console.log("parsed: ", valuesArray);
        return valuesArray;
      } catch (error) {
        console.error('Error parsing trackable objects:', error);
        return [];
      }
    };

    const trackableObjects = getTrackableObjects();
    console.log("fetched trackable objects: ", trackableObjects);

    // Create a map of trackable object IDs to their data entries
    const trackableDataMap = new Map();
    data.forEach(entry => {
      if (!entry?.TrackableId || !entry?.Emotion) {
        // console.log("Skipping invalid entry:", entry);
        return;
      }
      
      const trackableId = entry.TrackableId;
      if (!trackableDataMap.has(trackableId)) {
        trackableDataMap.set(trackableId, []);
      }
      trackableDataMap.get(trackableId).push(entry);
    });

    console.log("map of trackable IDs to data entries:", trackableDataMap);
    console.log("trackable objects:", trackableObjects);

    // Combine trackable object positions with their data entries
    const dataPointsWithPositions = trackableObjects
      .filter(obj => obj?.guid && trackableDataMap.has(obj.guid))
      .flatMap(obj => {
        const entries = trackableDataMap.get(obj.guid);
        const position = obj.position || { x: 0, y: 0, z: 0 };
        return entries.map(entry => ({ ...entry, position }));
      });

    console.log("Data points with positions:", dataPointsWithPositions);

    if (dataPointsWithPositions.length === 0) {
        console.log("No data points with valid positions and emotions.");
        return [];
    }

    // Calculate the bounds of the scene
    const bounds = dataPointsWithPositions.reduce((acc, item) => ({
      minX: Math.min(acc.minX, item.position.x),
      maxX: Math.max(acc.maxX, item.position.x),
      minY: Math.min(acc.minY, item.position.y),
      maxY: Math.max(acc.maxY, item.position.y)
    }), {
      minX: Infinity,
      maxX: -Infinity,
      minY: Infinity,
      maxY: -Infinity
    });

    // Add padding to the bounds, ensure minimum dimensions
    const padding = 5;
    bounds.minX = isFinite(bounds.minX) ? bounds.minX - padding : -10;
    bounds.maxX = isFinite(bounds.maxX) ? bounds.maxX + padding : 10;
    bounds.minY = isFinite(bounds.minY) ? bounds.minY - padding : -10;
    bounds.maxY = isFinite(bounds.maxY) ? bounds.maxY + padding : 10;

    const sceneWidth = Math.max(bounds.maxX - bounds.minX, 20);
    const sceneHeight = Math.max(bounds.maxY - bounds.minY, 20);

    console.log("Scene bounds:", bounds);
    console.log("Scene dimensions:", { width: sceneWidth, height: sceneHeight });

    // Create a grid and populate it with emotion data
    const grid = Array(GRID_SIZE).fill(null).map(() => 
      Array(GRID_SIZE).fill(null).map(() => ({
        emotions: {}, // { emotionLabel: count }
        totalIntensity: 0,
        count: 0
      }))
    );

    dataPointsWithPositions.forEach(item => {
        const { Arousal = 0, Valence = 0, Label } = item.Emotion;
        const intensity = Math.sqrt(Arousal * Arousal + Valence * Valence); // Use magnitude for intensity
        
        // Calculate grid cell coordinates
        const gridX = Math.floor(((item.position.x - bounds.minX) / sceneWidth) * GRID_SIZE);
        const gridY = Math.floor(((item.position.y - bounds.minY) / sceneHeight) * GRID_SIZE);

        // Ensure coordinates are within bounds
        if (gridX >= 0 && gridX < GRID_SIZE && gridY >= 0 && gridY < GRID_SIZE) {
            const cell = grid[gridY][gridX];
            cell.totalIntensity += intensity;
            cell.count += 1;
            if (Label !== undefined) {
                cell.emotions[Label] = (cell.emotions[Label] || 0) + 1;
            }
        }
    });

    console.log("Populated grid:", grid);

    // Process the grid to determine dominant emotion and average intensity for each cell
    const processedGrid = grid.flatMap((row, y) => 
        row.map((cell, x) => {
            const emotionEntries = Object.entries(cell.emotions);
            const dominantEmotion = emotionEntries.length 
                ? parseInt(emotionEntries.sort((a, b) => b[1] - a[1])[0][0]) 
                : null;
            
            const avgIntensity = cell.count > 0 ? cell.totalIntensity / cell.count : 0;

            // Calculate cell position relative to bounds (for potential future use)
            const cellCenterX = bounds.minX + (x + 0.5) * (sceneWidth / GRID_SIZE);
            const cellCenterY = bounds.minY + (y + 0.5) * (sceneHeight / GRID_SIZE);

            return {
                x,
                y,
                dominantEmotion,
                avgIntensity,
                count: cell.count,
                position: { x: cellCenterX, y: cellCenterY }
            };
        })
    );

    console.log("Processed grid data:", processedGrid);

    return { grid: processedGrid, bounds, sceneDimensions: { width: sceneWidth, height: sceneHeight } };

  }, [data]);

  const gridCells = processedData.grid || [];
  const bounds = processedData.bounds || { minX: 0, maxX: 10, minY: 0, maxY: 10 };
  const sceneDimensions = processedData.sceneDimensions || { width: 10, height: 10 };

  if (!data?.length || gridCells.length === 0) {
    console.log("No data or grid data to display");
    return (
      <div className="heatmap-container">
        <div className="no-data">No emotional data with positional information available</div>
      </div>
    );
  }

  // Calculate cell size based on scene dimensions and grid size
  const cellWidth = 100 / GRID_SIZE;
  const cellHeight = 100 / GRID_SIZE;

  return (
    <div className="heatmap-container">
      <h2>Emotional Heatmap by Location</h2>
      <div className="heatmap-wrapper">
        <div 
            className="heatmap-grid"
            style={{
                width: '100%',
                height: '100%',
                display: 'grid',
                gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
                gap: '1px' // Optional: adds a small gap between cells
            }}
        >
          {gridCells.map((cell, index) => {
            const color = cell.dominantEmotion !== null ? COLORS[cell.dominantEmotion] : '#ffffff'; // White for no dominant emotion
            // Scale intensity to affect opacity or color lightness
            // Use a minimum intensity threshold to ensure low intensity is close to white
            const displayIntensity = cell.count > 0 ? Math.min(cell.avgIntensity / 5, 1) : 0; // Normalize and cap intensity
            const opacity = cell.count > 0 ? 0.2 + (displayIntensity * 0.8) : 0; // Vary opacity based on intensity
            
            return (
              <div
                key={index}
                className="heatmap-cell"
                style={{
                  backgroundColor: color,
                  opacity: opacity,
                //   outline: cell.count > 0 ? '1px solid rgba(0,0,0,0.05)' : 'none', // Optional cell border
                }}
                title={
                    cell.count > 0 
                    ? `Count: ${cell.count}\nDominant Emotion: ${cell.dominantEmotion !== null ? EMOTION_NAMES[cell.dominantEmotion] : 'None'}\nAvg Intensity: ${cell.avgIntensity.toFixed(2)}`
                    : 'No data points'
                }
              />
            );
          })}
        </div>
      </div>
      <div className="heatmap-legend">
        {Object.entries(EMOTION_NAMES).map(([key, name]) => (
          <div key={key} className="legend-item">
            <span className="legend-color" style={{ backgroundColor: COLORS[key] }}></span>
            <span>{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Heatmap;