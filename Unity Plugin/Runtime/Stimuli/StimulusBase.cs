// Assets/Scripts/EmotionDriven/Runtime/StimulusBase.cs
using System;
using System.Linq;
using UnityEngine;

namespace EmotionDriven
{
    [DisallowMultipleComponent]
    [RequireComponent(typeof(TrackableObject))]
    public abstract class StimulusBase : MonoBehaviour
    {
        // ───────── Settings ─────────
        [Header("General")]
        [HideInInspector] public StimulusType Type;
        
        public TrackableObject ParentTrackable;

        [Header("Trigger Options")]
        [Min(0)]                public float cooldown            = 0f;
        public bool             onlyOnce             = false;
        public EmotionLabel[]   emotionFilter        = Array.Empty<EmotionLabel>();
        [Range(0f,1f)]          public float confidenceThreshold = 0f;

        // ───────── Internals ─────────
        private double _lastTriggerTime = -9999;
        private bool   _hasTriggered;

        protected void TryTrigger(
            StimulusPhase phase,
            string        featureName,
            float         featureValue)
        {
            double now = Time.timeAsDouble;

            if (now - _lastTriggerTime < cooldown) return;
            if (onlyOnce && _hasTriggered)         return;

            var emotion = EmotionManager.Instance != null ? EmotionManager.Instance.Latest : default;
            if (emotion.Confidence < confidenceThreshold) return;
            if (emotionFilter.Length > 0 && !emotionFilter.Contains(emotion.Label)) return;

            var evt = new StimulusEvent {
                TrackableId  = ParentTrackable != null ? ParentTrackable.ObjectGuid : name,
                StimulusType = Type,
                Phase        = phase,
                Time         = now,
                Emotion      = emotion,
                CheckpointIndex = ParentTrackable != null ? ParentTrackable.CheckpointIndex : -1,
                FeatureName  = featureName,
                FeatureValue = featureValue
            };

            EmotionManager.Instance?.RaiseStimulus(evt);
            _lastTriggerTime = now;
            _hasTriggered    = true;
        }

        /// <summary>Main update performed by derived stimuli (called from manager loop).</summary>
        public abstract void Tick(Vector3 playerPos, Camera playerCam);
    }
}
