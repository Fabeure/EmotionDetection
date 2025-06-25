// Assets/Scripts/EmotionDriven/Stimuli/ProximityStimulus.cs
using UnityEngine;

namespace EmotionDriven
{
    [AddComponentMenu("Emotion-Driven/Stimuli/Proximity Stimulus")]
    public class ProximityStimulus : StimulusBase
    {
        [Header("Detection")]
        public float radius = 5f;

        [Header("Tracked Features")]
        public bool trackDistance = true;

        private bool _inside;

        private void Reset() { Type = StimulusType.Proximity; }

        public override void Tick(Vector3 playerPos, Camera playerCam)
        {
            float dist  = Vector3.Distance(playerPos, transform.position);
            bool  inside = dist <= radius;
            float distNorm = Mathf.Clamp01(dist / radius); // 0 = collé, 1 = bord

            // ─── Phase events ────────────────────────────────────────────────
            if (inside && !_inside) TryTrigger(StimulusPhase.Enter, "distance", distNorm);
            if (!inside && _inside) TryTrigger(StimulusPhase.Exit,  "distance", distNorm);
            if (inside && trackDistance)         TryTrigger(StimulusPhase.Stay,  "distance", distNorm);

            _inside = inside;
        }

        private void OnDrawGizmosSelected()
        {
            Gizmos.color = Color.yellow;
            Gizmos.DrawWireSphere(transform.position, radius);
        }
    }
}
