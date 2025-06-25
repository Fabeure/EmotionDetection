// Assets/Scripts/EmotionDriven/Runtime/EmotionManager.cs
using System;
using System.Collections.Generic;
using UnityEngine;
using UnityEditor;
namespace EmotionDriven
{
    public enum EmotionLabel { Neutral, Happy, Sad, Angry, Fear, Surprise }
    public enum StimulusType  { Visual, Audio, Proximity, Custom }
    public enum StimulusPhase { Enter, Stay, Exit }

    // -------------------------------------------------------------------------
    [Serializable]
    public struct EmotionSample
    {
        public double Time;
        public EmotionLabel Label;
        [Range(-1f, 1f)] public float Valence;
        [Range(0f, 1f)] public float Arousal;
        [Range(0f, 1f)] public float Confidence;
    }

    // -------------------------------------------------------------------------
    [Serializable]
    public struct StimulusEvent
    {
        public string TrackableId;
        public StimulusType StimulusType;
        public StimulusPhase Phase;
        public double Time;
        public EmotionSample Emotion;
        public int CheckpointIndex;
        public string FeatureName;   // ex. "volume"
        public float FeatureValue;   // ex. 0.78f
    }

    // -------------------------------------------------------------------------
    [AddComponentMenu("Emotion-Driven/Emotion Manager (Singleton)")]
    public class EmotionManager : MonoBehaviour
    {
        public static EmotionManager Instance { get; private set; }

        [SerializeField] private EmotionSample _latest;
        public EmotionSample Latest => _latest;

        [Header("Passive Logging (no stimulus)")]
        public bool passiveLoggingEnabled = false;

        private List<EmotionSample> _passiveLog = new();

        public event Action<StimulusEvent> OnStimulus;
        public event Action<EmotionSample> OnEmotionUpdated;

        private void Awake()
        {
            if (Instance != null && Instance != this) { Destroy(gameObject); return; }
            Instance = this;
            DontDestroyOnLoad(gameObject);
        }

        public void UpdateEmotion(EmotionSample sample)
        {
            Debug.Log($"Emotion Updated: {sample.Label}, Valence: {sample.Valence}, Arousal: {sample.Arousal}, Confidence: {sample.Confidence}");
            _latest = sample;
            OnEmotionUpdated?.Invoke(sample);

            if (passiveLoggingEnabled)
                _passiveLog.Add(sample);
        }

        internal void RaiseStimulus(StimulusEvent evt)
        {
            OnStimulus?.Invoke(evt);
        }

        /// <summary>Returns all passively logged emotion samples.</summary>
        public List<EmotionSample> GetPassiveLog() => new(_passiveLog);

        /// <summary>Clears the passive log.</summary>
        public void ClearPassiveLog() => _passiveLog.Clear();
    }
}
