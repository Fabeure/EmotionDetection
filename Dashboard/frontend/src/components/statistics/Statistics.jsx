import { useMemo } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { emotion_labels, stimulus_types } from "../../data/dummyData";
import "./Statistics.scss";

const COLORS = {
    0: "#95a5a6", // Neutral
    1: "#2ecc71", // Happy
    2: "#3498db", // Sad
    3: "#e74c3c", // Angry
    4: "#f1c40f", // Fearful
    5: "#8e44ad", // Disgusted
    6: "#e67e22"  // Surprised
};

const Statistics = ({ data }) => {
    const stats = useMemo(() => {
        if (!data || data.length === 0) return null;

        // Basic session info
        const sessionStart = Math.min(...data.map(log => log.Time));
        const sessionEnd = Math.max(...data.map(log => log.Time));
        const sessionDuration = sessionEnd - sessionStart;

        // Emotion distribution
        const emotionCounts = data.reduce((counts, log) => {
            const label = log.Emotion.Label;
            counts[label] = (counts[label] || 0) + 1;
            return counts;
        }, {});

        const emotionDistribution = Object.entries(emotionCounts).map(([label, count]) => ({
            emotion: emotion_labels[label],
            count,
            percentage: (count / data.length * 100).toFixed(1)
        }));

        // Stimulus distribution
        const stimulusCounts = data.reduce((counts, log) => {
            const type = log.StimulusType;
            counts[type] = (counts[type] || 0) + 1;
            return counts;
        }, {});

        const stimulusDistribution = Object.entries(stimulusCounts)
            .filter(([type]) => type !== "0") // Exclude "None" stimulus
            .map(([type, count]) => ({
                stimulus: stimulus_types[type],
                count,
                percentage: (count / data.length * 100).toFixed(1)
            }));

        // Calculate averages
        const avgValence = data.reduce((sum, log) => sum + log.Emotion.Valence, 0) / data.length;
        const avgArousal = data.reduce((sum, log) => sum + log.Emotion.Arousal, 0) / data.length;
        const avgConfidence = data.reduce((sum, log) => sum + log.Emotion.Confidence, 0) / data.length;

        // Emotional intensity metrics
        const highArousalEvents = data.filter(log => log.Emotion.Arousal > 0.7).length;
        const negativeValenceEvents = data.filter(log => log.Emotion.Valence < -0.3).length;
        const highConfidenceEvents = data.filter(log => log.Emotion.Confidence > 0.9).length;

        // Trackable and feature analysis
        const uniqueTrackables = new Set(data.map(log => log.TrackableId));
        const uniqueFeatures = new Set(data.map(log => log.FeatureName));
        const phases = new Set(data.map(log => log.Phase));

        // Time-based metrics
        const timeDistribution = data.reduce((dist, log) => {
            const minute = Math.floor(log.Time / 60);
            dist[minute] = (dist[minute] || 0) + 1;
            return dist;
        }, {});

        const timeSeriesData = Object.entries(timeDistribution).map(([minute, count]) => ({
            time: `${minute}m`,
            count
        }));

        return {
            sessionDuration,
            sessionStart,
            sessionEnd,
            emotionDistribution,
            stimulusDistribution,
            avgValence,
            avgArousal,
            avgConfidence,
            highArousalEvents,
            negativeValenceEvents,
            highConfidenceEvents,
            uniqueTrackables: uniqueTrackables.size,
            uniqueFeatures: uniqueFeatures.size,
            phases: Array.from(phases),
            timeSeriesData
        };
    }, [data]);

    if (!stats) return <div>No data available</div>;

    return (
        <div className="statistics">
            <h2>Session Statistics</h2>
            
            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Session Duration</h3>
                    <div className="value">{stats.sessionDuration.toFixed(2)}s</div>
                    <div className="label">
                        Start: {stats.sessionStart.toFixed(2)}s
                        <br />
                        End: {stats.sessionEnd.toFixed(2)}s
                    </div>
                </div>

                <div className="stat-card">
                    <h3>Average Values</h3>
                    <div className="value">
                        <div>Valence: {stats.avgValence.toFixed(2)}</div>
                        <div>Arousal: {stats.avgArousal.toFixed(2)}</div>
                        <div>Confidence: {(stats.avgConfidence * 100).toFixed(1)}%</div>
                    </div>
                </div>

                <div className="stat-card">
                    <h3>Emotional Intensity</h3>
                    <div className="value">
                        <div>High Arousal: {stats.highArousalEvents}</div>
                        <div>Negative Valence: {stats.negativeValenceEvents}</div>
                        <div>High Confidence: {stats.highConfidenceEvents}</div>
                    </div>
                </div>

                <div className="stat-card">
                    <h3>Session Coverage</h3>
                    <div className="value">
                        <div>Trackables: {stats.uniqueTrackables}</div>
                        <div>Features: {stats.uniqueFeatures}</div>
                        <div>Phases: {stats.phases.length}</div>
                    </div>
                </div>
            </div>

            <div className="charts-grid">
                <div className="chart-card">
                    <h3>Emotion Distribution</h3>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={stats.emotionDistribution}
                                    dataKey="count"
                                    nameKey="emotion"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    label={false}
                                >
                                    {stats.emotionDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[Object.keys(emotion_labels).find(key => emotion_labels[key] === entry.emotion)]} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    formatter={(value, name) => [`${value} (${((value / stats.emotionDistribution.reduce((sum, item) => sum + item.count, 0)) * 100).toFixed(1)}%)`, name]}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-card">
                    <h3>Stimulus Distribution</h3>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={stats.stimulusDistribution}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="stimulus" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#3498db" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-card">
                    <h3>Event Frequency Over Time</h3>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={stats.timeSeriesData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="time" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#2ecc71" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Statistics; 