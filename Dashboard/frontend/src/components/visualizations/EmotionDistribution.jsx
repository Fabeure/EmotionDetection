import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { emotion_labels } from "../../data/dummyData";
import "./EmotionDistribution.scss";

const COLORS = {
    0: "#95a5a6", // Neutral
    1: "#2ecc71", // Happy
    2: "#3498db", // Sad
    3: "#e74c3c", // Angry
    4: "#f1c40f", // Fearful
    5: "#8e44ad", // Disgusted
    6: "#e67e22"  // Surprised
};

const EmotionDistribution = ({ data, stats }) => {
    const chartData = useMemo(() => {
        return Object.entries(stats.emotionDistribution).map(([emotionId, count]) => ({
            name: emotion_labels[emotionId],
            value: count,
            emotionId: parseInt(emotionId)
        }));
    }, [stats]);

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="custom-tooltip">
                    <p className="emotion">{data.name}</p>
                    <p className="count">{data.value} occurrences</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="emotion-distribution">
            <h2>Emotion Distribution</h2>
            <div className="chart-container">
                <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={150}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {chartData.map((entry) => (
                                <Cell key={`cell-${entry.emotionId}`} fill={COLORS[entry.emotionId]} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="emotion-details">
                <h3>Emotion Statistics</h3>
                <div className="stats">
                    {chartData.map((entry) => (
                        <div key={entry.emotionId} className="stat">
                            <div className="label" style={{ color: COLORS[entry.emotionId] }}>
                                {entry.name}
                            </div>
                            <div className="value">
                                {entry.value} ({((entry.value / data.length) * 100).toFixed(1)}%)
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EmotionDistribution; 