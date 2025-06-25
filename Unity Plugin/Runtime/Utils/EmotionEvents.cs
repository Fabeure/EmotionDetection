// Assets/Scripts/EmotionDriven/Runtime/EmotionEvents.cs
using System;

namespace EmotionDriven
{
    /// <summary>
    /// Central event bus every runtime component can subscribe to.
    /// </summary>
    public static class EmotionEvents
    {
        /// <summary>
        /// Fires for every StimulusEvent published by EmotionManager.
        /// </summary>
        public static event Action<StimulusEvent> Any;

        /// <summary>
        /// Internal: called by EmotionManager.RaiseStimulus.
        /// </summary>
        internal static void Raise(StimulusEvent e) => Any?.Invoke(e);

        /// <summary>
        /// Subscribe to events with a specific label filter helper.
        /// </summary>
        public static void Subscribe(EmotionLabel labelFilter, Action<StimulusEvent> cb)
        {
            Any += e => { if (e.Emotion.Label == labelFilter) cb?.Invoke(e); };
        }
    }
}
