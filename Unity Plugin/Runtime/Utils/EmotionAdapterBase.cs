// Assets/Scripts/EmotionDriven/Runtime/EmotionAdapterBase.cs
using System.Linq;
using UnityEngine;

namespace EmotionDriven
{
    /// <summary>
    /// Derive from this base to react to StimulusEvents without rewriting filter boilerplate.
    /// </summary>
    [DisallowMultipleComponent]
    public abstract class EmotionAdapterBase : MonoBehaviour, IEmotionAdapter
    {
        [Header("Adapter Filters")]
        public EmotionLabel[] labelFilter = new EmotionLabel[0];
        public StimulusType[] typeFilter = new StimulusType[0];

        protected virtual void OnEnable()  => EmotionEvents.Any += OnAnyEvent;
        protected virtual void OnDisable() => EmotionEvents.Any -= OnAnyEvent;

        private void OnAnyEvent(StimulusEvent e)
        {
            if (labelFilter.Length > 0 && !labelFilter.Contains(e.Emotion.Label)) return;
            if (typeFilter.Length  > 0 && !typeFilter.Contains(e.StimulusType))   return;
            HandleEvent(e);
        }

        /// <summary>
        /// Implement your adaptation here.
        /// </summary>
        public abstract void HandleEvent(StimulusEvent e);
    }

    public interface IEmotionAdapter
    {
        void HandleEvent(StimulusEvent e);
    }
}
