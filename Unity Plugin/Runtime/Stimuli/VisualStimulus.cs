// Assets/Scripts/EmotionDriven/Stimuli/VisualStimulus.cs
using UnityEngine;

namespace EmotionDriven
{
    [AddComponentMenu("Emotion-Driven/Stimuli/Visual Stimulus")]
    [RequireComponent(typeof(Renderer))]
    public class VisualStimulus : StimulusBase
    {
        [Header("Tracked Features")]
        public bool trackScreenDistance = true;

        private Renderer _rend;
        private bool     _wasVisible;

        private void Reset() { Type = StimulusType.Visual; }
        private void Start() { _rend = GetComponent<Renderer>(); }

        public override void Tick(Vector3 playerPos, Camera playerCam)
        {
            if (_rend == null) return;

            var planes  = GeometryUtility.CalculateFrustumPlanes(playerCam);
            bool inside = GeometryUtility.TestPlanesAABB(planes, _rend.bounds);

            // ─── Enter / Exit ─────────────────────────────────────────────
            if (inside && !_wasVisible)
                TryTrigger(StimulusPhase.Enter, "visible", 1f);
            if (!inside && _wasVisible)
                TryTrigger(StimulusPhase.Exit,  "visible", 0f);

            // ─── Continuous metrics ───────────────────────────────────────
            if (inside && trackScreenDistance)
            {
                Vector3 viewPos = playerCam.WorldToViewportPoint(_rend.bounds.center);
                float   dx      = viewPos.x - 0.5f;
                float   dy      = viewPos.y - 0.5f;
                float   distCtr = Mathf.Sqrt(dx*dx + dy*dy) / 0.7071f; // 0-1, 0 = centre
                distCtr = Mathf.Clamp01(distCtr);

                TryTrigger(StimulusPhase.Stay, "screenDistance", distCtr);
            }

            _wasVisible = inside;
        }
    }
}
