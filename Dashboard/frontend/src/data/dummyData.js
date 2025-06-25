// Emotion labels mapping
export const emotion_labels = {
    0: "Neutral",
    1: "Happy",
    2: "Sad",
    3: "Angry",
    4: "Fearful",
    5: "Disgusted",
    6: "Surprised"
};

// Stimulus types mapping
export const stimulus_types = {
    0: "None",
    1: "Visual",
    2: "Audio",
    3: "Proximity"
};

// Sample data that matches the JSONL format
export const dummyData = [
    // Initial neutral state
    {
        "TrackableId": "player_character",
        "StimulusType": 0,
        "Phase": 1,
        "Time": 0.0,
        "Emotion": {
            "Time": 0.0,
            "Label": 0,
            "Valence": 0.0,
            "Arousal": 0.2,
            "Confidence": 0.95
        },
        "FeatureName": "distance",
        "FeatureValue": 0.0
    },
    // Visual stimulus - seeing an enemy
    {
        "TrackableId": "enemy_1",
        "StimulusType": 1,
        "Phase": 1,
        "Time": 5.234,
        "Emotion": {
            "Time": 5.234,
            "Label": 4,
            "Valence": -0.3,
            "Arousal": 0.7,
            "Confidence": 0.92
        },
        "FeatureName": "distance",
        "FeatureValue": 0.85
    },
    // Audio stimulus - battle music
    {
        "TrackableId": "battle_music",
        "StimulusType": 2,
        "Phase": 1,
        "Time": 5.5,
        "Emotion": {
            "Time": 5.5,
            "Label": 3,
            "Valence": -0.2,
            "Arousal": 0.8,
            "Confidence": 0.88
        },
        "FeatureName": "volume",
        "FeatureValue": 0.75
    },
    // Proximity stimulus - enemy approaching
    {
        "TrackableId": "enemy_2",
        "StimulusType": 3,
        "Phase": 1,
        "Time": 8.123,
        "Emotion": {
            "Time": 8.123,
            "Label": 4,
            "Valence": -0.4,
            "Arousal": 0.9,
            "Confidence": 0.95
        },
        "FeatureName": "distance",
        "FeatureValue": 0.2
    },
    // Visual stimulus - seeing treasure
    {
        "TrackableId": "treasure_chest",
        "StimulusType": 1,
        "Phase": 1,
        "Time": 10.456,
        "Emotion": {
            "Time": 10.456,
            "Label": 1,
            "Valence": 0.6,
            "Arousal": 0.7,
            "Confidence": 0.90
        },
        "FeatureName": "distance",
        "FeatureValue": 0.3
    },
    // Audio stimulus - victory fanfare
    {
        "TrackableId": "victory_music",
        "StimulusType": 2,
        "Phase": 1,
        "Time": 11.789,
        "Emotion": {
            "Time": 11.789,
            "Label": 1,
            "Valence": 0.8,
            "Arousal": 0.7,
            "Confidence": 0.93
        },
        "FeatureName": "volume",
        "FeatureValue": 0.85
    },
    // Proximity stimulus - danger zone
    {
        "TrackableId": "danger_zone",
        "StimulusType": 3,
        "Phase": 1,
        "Time": 15.234,
        "Emotion": {
            "Time": 15.234,
            "Label": 4,
            "Valence": -0.5,
            "Arousal": 0.8,
            "Confidence": 0.91
        },
        "FeatureName": "distance",
        "FeatureValue": 0.1
    },
    // Visual stimulus - cutscene
    {
        "TrackableId": "cutscene_1",
        "StimulusType": 1,
        "Phase": 1,
        "Time": 20.123,
        "Emotion": {
            "Time": 20.123,
            "Label": 2,
            "Valence": -0.3,
            "Arousal": 0.4,
            "Confidence": 0.89
        },
        "FeatureName": "duration",
        "FeatureValue": 0.6
    },
    // Audio stimulus - ambient sounds
    {
        "TrackableId": "ambient_sounds",
        "StimulusType": 2,
        "Phase": 1,
        "Time": 25.456,
        "Emotion": {
            "Time": 25.456,
            "Label": 0,
            "Valence": 0.1,
            "Arousal": 0.3,
            "Confidence": 0.96
        },
        "FeatureName": "volume",
        "FeatureValue": 0.4
    }
];

// Helper function to calculate statistics from the data
export const calculateStats = (data) => {
    const stats = {
        emotionDistribution: {},
        stimulusDistribution: {},
        emotionByStimulus: {},
        timeDistribution: {},
        averageValence: 0,
        averageArousal: 0,
        averageConfidence: 0
    };

    // Calculate emotion and stimulus distributions
    data.forEach(log => {
        // Emotion distribution
        const emotionLabel = log.Emotion.Label;
        stats.emotionDistribution[emotionLabel] = (stats.emotionDistribution[emotionLabel] || 0) + 1;

        // Stimulus distribution
        const stimulusType = log.StimulusType;
        stats.stimulusDistribution[stimulusType] = (stats.stimulusDistribution[stimulusType] || 0) + 1;

        // Emotion by stimulus
        if (!stats.emotionByStimulus[stimulusType]) {
            stats.emotionByStimulus[stimulusType] = {};
        }
        stats.emotionByStimulus[stimulusType][emotionLabel] = 
            (stats.emotionByStimulus[stimulusType][emotionLabel] || 0) + 1;

        // Time distribution (by hour)
        const hour = Math.floor(log.Time / 3600);
        stats.timeDistribution[hour] = (stats.timeDistribution[hour] || 0) + 1;

        // Running averages
        stats.averageValence += log.Emotion.Valence;
        stats.averageArousal += log.Emotion.Arousal;
        stats.averageConfidence += log.Emotion.Confidence;
    });

    // Calculate final averages
    const count = data.length;
    stats.averageValence /= count;
    stats.averageArousal /= count;
    stats.averageConfidence /= count;

    return stats;
}; 