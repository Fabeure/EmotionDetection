import { useMemo } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { emotion_labels } from "../../data/dummyData";
import "./ValenceArousal.scss";

const COLORS = {
    0: "#95a5a6", // Neutral
    1: "#2ecc71", // Happy
    2: "#3498db", // Sad
    3: "#e74c3c", // Angry
    4: "#f1c40f", // Fearful
    5: "#8e44ad", // Disgusted
    6: "#e67e22"  // Surprised
};

const ValenceArousal = ({ data }) => {
    const chartData = useMemo(() => {
        return data.map(log => ({
            x: log.Emotion.Valence,
            y: log.Emotion.Arousal,
            emotion: emotion_labels[log.Emotion.Label],
            emotionId: log.Emotion.Label,
            confidence: log.Emotion.Confidence
        }));
    }, [data]);

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="custom-tooltip">
                    <p className="emotion" style={{ color: COLORS[data.emotionId] }}>
                        {data.emotion}
                    </p>
                    <p>Valence: {data.x.toFixed(2)}</p>
                    <p>Arousal: {data.y.toFixed(2)}</p>
                    <p>Confidence: {(data.confidence * 100).toFixed(1)}%</p>
                </div>
            );
        }
        return null;
    };

    const quadrants = [
        { name: "High Arousal, Positive Valence", count: 0 },
        { name: "High Arousal, Negative Valence", count: 0 },
        { name: "Low Arousal, Negative Valence", count: 0 },
        { name: "Low Arousal, Positive Valence", count: 0 }
    ];

    // Count points in each quadrant
    chartData.forEach(point => {
        if (point.y >= 0.5 && point.x >= 0) quadrants[0].count++;
        else if (point.y >= 0.5 && point.x < 0) quadrants[1].count++;
        else if (point.y < 0.5 && point.x < 0) quadrants[2].count++;
        else quadrants[3].count++;
    });

    return (
        <div className="valence-arousal">
            <h2>Valence-Arousal Analysis</h2>
            <div className="chart-container">
                <ResponsiveContainer width="100%" height={500}>
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid />
                        <XAxis 
                            type="number" 
                            dataKey="x" 
                            name="Valence" 
                            domain={[-1, 1]}
                            label={{ value: 'Valence', position: 'bottom' }}
                        />
                        <YAxis 
                            type="number" 
                            dataKey="y" 
                            name="Arousal" 
                            domain={[0, 1]}
                            label={{ value: 'Arousal', angle: -90, position: 'left' }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        {Object.entries(emotion_labels).map(([id, name]) => (
                            <Scatter
                                key={id}
                                name={name}
                                data={chartData.filter(point => point.emotionId === parseInt(id))}
                                fill={COLORS[id]}
                            />
                        ))}
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
            <div className="quadrant-info">
                {quadrants.map((quadrant, index) => (
                    <div key={index} className="quadrant">
                        <h3>{quadrant.name}</h3>
                        <p>{quadrant.count} points</p>
                        <p>{((quadrant.count / data.length) * 100).toFixed(1)}% of total</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ValenceArousal; 