// Assets/Scripts/EmotionDriven/Runtime/TrackableObject.cs
using System;
using UnityEngine;

namespace EmotionDriven
{
    [AddComponentMenu("Emotion-Driven/Trackable Object")]
    [DisallowMultipleComponent]
    public sealed class TrackableObject : MonoBehaviour
    {
        [Header("Identity")]
        [SerializeField] private string objectGuid; // persists in .scene
        public string             displayName = string.Empty;       // override for UI
        public TrackableCategory  category;              
        public int CheckpointIndex = -1; // for checkpointing systems           

        private StimulusBase[] _stimuli;
        private Camera         _mainCam;

        public string ObjectGuid
        {
            get { if (string.IsNullOrEmpty(objectGuid)) objectGuid = Guid.NewGuid().ToString("N"); return objectGuid; }
        }

        private void Awake()
        {
            // ensure GUID & display name are set *once* and stay the same
            if (string.IsNullOrEmpty(objectGuid)) objectGuid = Guid.NewGuid().ToString("N");
            if (string.IsNullOrWhiteSpace(displayName))      displayName = name;

            _stimuli = GetComponents<StimulusBase>();
            foreach (var s in _stimuli) s.ParentTrackable = this;

            _mainCam = Camera.main;
        }

        private void LateUpdate()
        {
            if (_stimuli.Length == 0 || _mainCam == null) return;

            var playerPos = _mainCam.transform.position;
            foreach (var s in _stimuli)
                s.Tick(playerPos, _mainCam);
        }

#if UNITY_EDITOR
        private void OnValidate()   // assure l’unicité même en mode Edit
        {
            if (string.IsNullOrEmpty(objectGuid))
                objectGuid = Guid.NewGuid().ToString("N");
            if (string.IsNullOrWhiteSpace(displayName))
                displayName = name;
        }
#endif
    }
}
