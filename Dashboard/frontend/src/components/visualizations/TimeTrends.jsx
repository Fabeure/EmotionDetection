import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine, AreaChart, Area } from "recharts";
import { emotion_labels, stimulus_types } from "../../data/dummyData";
import "./TimeTrends.scss";

const COLORS = {
    0: "#95a5a6", // Neutral
    1: "#2ecc71", // Happy
    2: "#3498db", // Sad
    3: "#e74c3c", // Angry
    4: "#f1c40f", // Fearful
    5: "#8e44ad", // Disgusted
    6: "#e67e22"  // Surprised
};

const TimeTrends = ({ data }) => {
    const chartData = useMemo(() => {
        if (!data || data.length === 0) return null;

        // Sort data by time
        const sortedData = [...data].sort((a, b) => a.Time - b.Time);

        // Create time series data with emotion and intensity information
        const timeSeriesData = sortedData.map(log => ({
            time: log.Time.toFixed(2),
            emotion: emotion_labels[log.Emotion.Label],
            emotionId: log.Emotion.Label,
            valence: log.Emotion.Valence,
            arousal: log.Emotion.Arousal,
            confidence: log.Emotion.Confidence,
            stimulus: stimulus_types[log.StimulusType],
            stimulusId: log.StimulusType,
            trackableId: log.TrackableId,
            featureName: log.FeatureName,
            featureValue: log.FeatureValue
        }));

        // Calculate significant events (high arousal or strong valence)
        const significantEvents = timeSeriesData.filter(
            point => Math.abs(point.valence) > 0.5 || point.arousal > 0.7
        );

        // Calculate emotion transitions
        const transitions = timeSeriesData.reduce((acc, point, index) => {
            if (index > 0) {
                const prevPoint = timeSeriesData[index - 1];
                if (prevPoint.emotion !== point.emotion) {
                    acc.push({
                        time: point.time,
                        from: prevPoint.emotion,
                        to: point.emotion,
                        duration: point.time - prevPoint.time
                    });
                }
            }
            return acc;
        }, []);

        // Calculate engagement segments
        const engagementSegments = timeSeriesData.reduce((segments, point, index) => {
            if (index > 0) {
                const prevPoint = timeSeriesData[index - 1];
                const arousalDiff = Math.abs(point.arousal - prevPoint.arousal);
                
                if (arousalDiff > 0.3) {
                    segments.push({
                        start: prevPoint.time,
                        end: point.time,
                        duration: point.time - prevPoint.time,
                        arousalChange: arousalDiff
                    });
                }
            }
            return segments;
        }, []);

        return {
            timeSeriesData,
            significantEvents,
            transitions,
            engagementSegments
        };
    }, [data]);

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="custom-tooltip">
                    <p className="time">Time: {data.time}s</p>
                    <p className="emotion" style={{ color: COLORS[data.emotionId] }}>
                        Emotion: {data.emotion}
                    </p>
                    <p>Stimulus: {data.stimulus}</p>
                    <p>Trackable: {data.trackableId}</p>
                    <p>Feature: {data.featureName} ({data.featureValue})</p>
                    <p>Valence: {data.valence.toFixed(2)}</p>
                    <p>Arousal: {data.arousal.toFixed(2)}</p>
                    <p>Confidence: {(data.confidence * 100).toFixed(1)}%</p>
                </div>
            );
        }
        return null;
    };

    if (!chartData) return <div>No data available</div>;

    return (
        <div className="time-trends">
            <h2>Emotional Progression</h2>
            
            <div className="chart-container">
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={chartData.timeSeriesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                            dataKey="time" 
                        />
                        <YAxis 
                            label={{ value: 'Emotion', angle: -90, position: 'insideLeft' }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="emotionId"
                            stroke="#3498db"
                            dot={false}
                            name="Emotion"
                        />
                        {chartData.significantEvents.map((event, index) => (
                            <ReferenceLine
                                key={index}
                                x={event.time}
                                stroke="#e74c3c"
                                strokeDasharray="3 3"
                                label={{ value: event.emotion, position: 'top' }}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="summary">
                <div className="summary-item">
                    <h3>Emotional Intensity (Valence)</h3>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={200}>
                            <AreaChart data={chartData.timeSeriesData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="time" />
                                <YAxis domain={[-1, 1]} />
                                <Tooltip />
                                <Area
                                    type="monotone"
                                    dataKey="valence"
                                    stroke="#3498db"
                                    fill="#3498db"
                                    fillOpacity={0.3}
                                />
                                <ReferenceLine y={0} stroke="#95a5a6" strokeDasharray="3 3" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="summary-item">
                    <h3>Engagement Level (Arousal)</h3>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={200}>
                            <AreaChart data={chartData.timeSeriesData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="time" />
                                <YAxis domain={[0, 1]} />
                                <Tooltip />
                                <Area
                                    type="monotone"
                                    dataKey="arousal"
                                    stroke="#2ecc71"
                                    fill="#2ecc71"
                                    fillOpacity={0.3}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="analysis-grid">
                <div className="analysis-card">
                    <h3>Emotion Transitions</h3>
                    <div className="transitions-list">
                        {chartData.transitions.slice(0, 5).map((transition, index) => (
                            <div key={index} className="transition-item">
                                <span className="time">{transition.time}s</span>
                                <span className="transition">
                                    {transition.from} → {transition.to}
                                </span>
                                <span className="duration">({transition.duration.toFixed(2)}s)</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="analysis-card">
                    <h3>Engagement Segments</h3>
                    <div className="segments-list">
                        {chartData.engagementSegments
                            .sort((a, b) => b.duration - a.duration)
                            .slice(0, 5)
                            .map((segment, index) => (
                                <div key={index} className="segment-item">
                                    <span className="time">
                                        {segment.start}s - {segment.end}s
                                    </span>
                                    <span className="duration">({segment.duration.toFixed(2)}s)</span>
                                    <span className="change">
                                        Arousal Change: {(segment.arousalChange * 100).toFixed(1)}%
                                    </span>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TimeTrends; 