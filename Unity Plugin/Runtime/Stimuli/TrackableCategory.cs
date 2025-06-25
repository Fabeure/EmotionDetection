// Assets/Scripts/EmotionDriven/Runtime/TrackableCategory.cs
using System;
using UnityEngine;

namespace EmotionDriven
{
    /// <summary>Design-time taxonomy used by TrackableObject for filtering.</summary>
    [CreateAssetMenu(
        menuName = "Emotion-Driven/Category",
        fileName = "New Category")]
    public sealed class TrackableCategory : ScriptableObject
    {
        [HideInInspector] public string categoryGuid;   // stable once generated
        public string displayName = "New Category";
        public Color  color       = Color.white;
        public TrackableCategory parent;                // optional hierarchy

        private void OnValidate()                       // runs in Editor only
        {
            if (string.IsNullOrEmpty(categoryGuid))
                categoryGuid = Guid.NewGuid().ToString("N");
        }
    }
}
