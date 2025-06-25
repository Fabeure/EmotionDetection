import { useMemo } from "react";
import { emotion_labels, stimulus_types } from "../../data/dummyData";
import "./Overview.scss";

const Overview = ({ data }) => {
    const sessionStats = useMemo(() => {
        if (!data || data.length === 0) return null;

        // Session timing and duration
        const sessionStart = Math.min(...data.map(log => log.Time));
        const sessionEnd = Math.max(...data.map(log => log.Time));
        const sessionDuration = sessionEnd - sessionStart;

        // Trackable and feature analysis
        const uniqueTrackables = new Set(data.map(log => log.TrackableId));
        const uniqueFeatures = new Set(data.map(log => log.FeatureName));
        const phases = new Set(data.map(log => log.Phase));

        // Emotional intensity analysis
        const highArousalEvents = data.filter(log => log.Emotion.Arousal > 0.7).length;
        const negativeValenceEvents = data.filter(log => log.Emotion.Valence < -0.3).length;
        const highConfidenceEvents = data.filter(log => log.Emotion.Confidence > 0.9).length;

        // Emotional state transitions
        const emotionTransitions = data.reduce((transitions, log, index) => {
            if (index > 0) {
                const prevEmotion = data[index - 1].Emotion.Label;
                const currentEmotion = log.Emotion.Label;
                const key = `${emotion_labels[prevEmotion]} → ${emotion_labels[currentEmotion]}`;
                transitions[key] = (transitions[key] || 0) + 1;
            }
            return transitions;
        }, {});

        // Most common emotion transitions
        const topTransitions = Object.entries(emotionTransitions)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3);

        // Emotional state duration
        const emotionDurations = data.reduce((durations, log, index) => {
            if (index > 0) {
                const duration = log.Time - data[index - 1].Time;
                const emotion = emotion_labels[log.Emotion.Label];
                if (!durations[emotion]) {
                    durations[emotion] = { total: 0, count: 0 };
                }
                durations[emotion].total += duration;
                durations[emotion].count += 1;
            }
            return durations;
        }, {});

        // Calculate average duration for each emotion
        const avgEmotionDurations = Object.entries(emotionDurations).map(([emotion, data]) => ({
            emotion,
            avgDuration: data.total / data.count
        })).sort((a, b) => b.avgDuration - a.avgDuration);

        // Engagement analysis
        const engagementSegments = data.reduce((segments, log, index) => {
            if (index > 0) {
                const prevLog = data[index - 1];
                const timeDiff = log.Time - prevLog.Time;
                const arousalDiff = Math.abs(log.Emotion.Arousal - prevLog.Emotion.Arousal);
                
                if (arousalDiff > 0.3) {
                    segments.push({
                        start: prevLog.Time,
                        end: log.Time,
                        duration: timeDiff,
                        arousalChange: arousalDiff
                    });
                }
            }
            return segments;
        }, []);

        // Find longest engagement segment
        const longestEngagement = engagementSegments
            .sort((a, b) => b.duration - a.duration)[0];

        return {
            sessionDuration,
            sessionStart,
            sessionEnd,
            uniqueTrackables: uniqueTrackables.size,
            uniqueFeatures: uniqueFeatures.size,
            phases: Array.from(phases),
            highArousalEvents,
            negativeValenceEvents,
            highConfidenceEvents,
            topTransitions,
            avgEmotionDurations,
            longestEngagement
        };
    }, [data]);

    if (!sessionStats) return <div>No data available</div>;

    return (
        <div className="overview">
            <h2>Session Insights</h2>
            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Session Duration</h3>
                    <div className="value">{sessionStats.sessionDuration.toFixed(2)}s</div>
                    <div className="label">
                        Start: {sessionStats.sessionStart.toFixed(2)}s
                        <br />
                        End: {sessionStats.sessionEnd.toFixed(2)}s
                    </div>
                </div>

                <div className="stat-card">
                    <h3>Emotional Transitions</h3>
                    <div className="value">
                        {sessionStats.topTransitions.map(([transition, count], index) => (
                            <div key={index} className="transition-item">
                                {transition}
                                <small>{count} times</small>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="stat-card">
                    <h3>Emotional Intensity</h3>
                    <div className="value">
                        <div>High Arousal: {sessionStats.highArousalEvents}</div>
                        <div>Negative Valence: {sessionStats.negativeValenceEvents}</div>
                        <div>High Confidence: {sessionStats.highConfidenceEvents}</div>
                    </div>
                </div>

                <div className="stat-card">
                    <h3>Longest Emotional States</h3>
                    <div className="value">
                        {sessionStats.avgEmotionDurations.slice(0, 3).map(({ emotion, avgDuration }, index) => (
                            <div key={index} className="duration-item">
                                {emotion}
                                <small>{avgDuration.toFixed(2)}s avg</small>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="stat-card">
                    <h3>Engagement Analysis</h3>
                    <div className="value">
                        {sessionStats.longestEngagement && (
                            <>
                                <div>Longest Engagement: {sessionStats.longestEngagement.duration.toFixed(2)}s</div>
                                <div>Arousal Change: {(sessionStats.longestEngagement.arousalChange * 100).toFixed(1)}%</div>
                            </>
                        )}
                    </div>
                </div>

                <div className="stat-card">
                    <h3>Session Coverage</h3>
                    <div className="value">
                        <div>Trackables: {sessionStats.uniqueTrackables}</div>
                        <div>Features: {sessionStats.uniqueFeatures}</div>
                        <div>Phases: {sessionStats.phases.length}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Overview;