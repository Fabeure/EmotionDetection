import { useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from "recharts";
import { emotion_labels, stimulus_types } from "../../data/dummyData";
import "./StimulusAnalysis.scss";

const COLORS = {
    0: "#95a5a6", // Neutral
    1: "#2ecc71", // Happy
    2: "#3498db", // Sad
    3: "#e74c3c", // Angry
    4: "#f1c40f", // Fearful
    5: "#8e44ad", // Disgusted
    6: "#e67e22"  // Surprised
};

const STIMULUS_COLORS = {
    1: "#3498db", // Visual
    2: "#e74c3c", // Audio
    3: "#2ecc71"  // Proximity
};

const StimulusAnalysis = ({ data }) => {
    const [selectedStimulus, setSelectedStimulus] = useState(null);

    const chartData = useMemo(() => {
        // Group data by stimulus type
        const stimulusGroups = data.reduce((acc, log) => {
            const stimulusType = log.StimulusType;
            if (!acc[stimulusType]) {
                acc[stimulusType] = {
                    stimulusId: stimulusType,
                    stimulus: stimulus_types[stimulusType],
                    count: 0,
                    emotions: {},
                    totalValence: 0,
                    totalArousal: 0,
                    totalConfidence: 0,
                    features: new Set(),
                    trackables: new Set()
                };
            }
            
            const group = acc[stimulusType];
            group.count++;
            group.emotions[log.Emotion.Label] = (group.emotions[log.Emotion.Label] || 0) + 1;
            group.totalValence += log.Emotion.Valence;
            group.totalArousal += log.Emotion.Arousal;
            group.totalConfidence += log.Emotion.Confidence;
            group.features.add(log.FeatureName);
            group.trackables.add(log.TrackableId);
            
            return acc;
        }, {});

        // Convert to array and calculate averages
        return Object.values(stimulusGroups)
            .filter(group => group.stimulusId !== 0) // Exclude "None" stimulus
            .map(group => ({
                ...group,
                avgValence: group.totalValence / group.count,
                avgArousal: group.totalArousal / group.count,
                avgConfidence: group.totalConfidence / group.count,
                featureCount: group.features.size,
                trackableCount: group.trackables.size,
                emotionDistribution: Object.entries(group.emotions).map(([emotionId, count]) => ({
                    emotionId: parseInt(emotionId),
                    emotion: emotion_labels[emotionId],
                    count,
                    percentage: (count / group.count * 100).toFixed(1)
                }))
            }))
            .sort((a, b) => b.count - a.count);
    }, [data]);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="custom-tooltip">
                    <p className="stimulus" style={{ color: STIMULUS_COLORS[data.stimulusId] }}>
                        {data.stimulus}
                    </p>
                    <p>Total Events: {data.count}</p>
                    <p>Avg Valence: {data.avgValence.toFixed(2)}</p>
                    <p>Avg Arousal: {data.avgArousal.toFixed(2)}</p>
                    <p>Avg Confidence: {(data.avgConfidence * 100).toFixed(1)}%</p>
                    <p>Unique Features: {data.featureCount}</p>
                    <p>Unique Trackables: {data.trackableCount}</p>
                </div>
            );
        }
        return null;
    };

    const handleStimulusClick = (stimulus) => {
        setSelectedStimulus(selectedStimulus?.stimulusId === stimulus.stimulusId ? null : stimulus);
    };

    return (
        <div className="stimulus-analysis">
            <h2>Stimulus Impact Analysis</h2>
            <div className="chart-container">
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="stimulus" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar
                            dataKey="count"
                            fill="#3498db"
                            name="Event Count"
                            onClick={(data) => handleStimulusClick(data)}
                            style={{ cursor: 'pointer' }}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="stimulus-cards">
                {chartData.map(stimulus => (
                    <div 
                        key={stimulus.stimulusId} 
                        className={`stimulus-card ${selectedStimulus?.stimulusId === stimulus.stimulusId ? 'selected' : ''}`}
                        onClick={() => handleStimulusClick(stimulus)}
                    >
                        <h3 style={{ color: STIMULUS_COLORS[stimulus.stimulusId] }}>
                            {stimulus.stimulus}
                        </h3>
                        <div className="stats">
                            <div className="stat">
                                <div className="label">Events</div>
                                <div className="value">{stimulus.count}</div>
                            </div>
                            <div className="stat">
                                <div className="label">Avg Valence</div>
                                <div className="value">{stimulus.avgValence.toFixed(2)}</div>
                            </div>
                            <div className="stat">
                                <div className="label">Avg Arousal</div>
                                <div className="value">{stimulus.avgArousal.toFixed(2)}</div>
                            </div>
                        </div>
                        <div className="emotion-breakdown">
                            <h4>Emotional Response</h4>
                            {stimulus.emotionDistribution
                                .sort((a, b) => b.count - a.count)
                                .map(emotion => (
                                    <div key={emotion.emotionId} className="emotion-stat">
                                        <span className="emotion" style={{ color: COLORS[emotion.emotionId] }}>
                                            {emotion.emotion}
                                        </span>
                                        <span className="count">{emotion.count}</span>
                                        <span className="percentage">{emotion.percentage}%</span>
                                    </div>
                                ))}
                        </div>
                        {selectedStimulus?.stimulusId === stimulus.stimulusId && (
                            <div className="detailed-stats">
                                <h4>Detailed Analysis</h4>
                                <div className="pie-chart">
                                    <ResponsiveContainer width="100%" height={200}>
                                        <PieChart>
                                            <Pie
                                                data={stimulus.emotionDistribution}
                                                dataKey="count"
                                                nameKey="emotion"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={80}
                                                label
                                            >
                                                {stimulus.emotionDistribution.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[entry.emotionId]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="additional-stats">
                                    <div className="stat">
                                        <div className="label">Unique Trackables</div>
                                        <div className="value">{stimulus.trackableCount}</div>
                                    </div>
                                    <div className="stat">
                                        <div className="label">Unique Features</div>
                                        <div className="value">{stimulus.featureCount}</div>
                                    </div>
                                    <div className="stat">
                                        <div className="label">Avg Confidence</div>
                                        <div className="value">{(stimulus.avgConfidence * 100).toFixed(1)}%</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StimulusAnalysis; 