// Assets/Scripts/EmotionDriven/Stimuli/AudioStimulus.cs
using UnityEngine;

namespace EmotionDriven
{
    [AddComponentMenu("Emotion-Driven/Stimuli/Audio Stimulus")]
    [RequireComponent(typeof(AudioSource))]
    public class AudioStimulus : StimulusBase
    {
        [Header("Detection")]
        [Range(0f,1f)] public float audibleThreshold = 0.05f;   // volume min pour prise en compte
        public float maxPitch = 3f;                              // pour normaliser le pitch

        [Header("Tracked Features")]
        public bool trackVolume   = true;
        public bool trackPitch    = true;
        public bool trackDistance = false;

        private AudioSource _src;

        private void Reset() { Type = StimulusType.Audio; }
        private void Start() { _src = GetComponent<AudioSource>(); }

        public override void Tick(Vector3 playerPos, Camera playerCam)
        {
            if (_src == null || !_src.isPlaying) return;

            // Volume perceptif (distance atténuation linéaire ∼ Unity par défaut)
            float dist      = Vector3.Distance(transform.position, playerPos);
            float volAtt    = 1f - Mathf.Clamp01(dist / _src.maxDistance);
            float volActual = _src.volume * volAtt;

            if (volActual < audibleThreshold) return;  // Trop faible ⇒ pas de stimulus

            // ─── Volume ─────────────────────────────────────────────────────
            if (trackVolume)
            {
                float volNorm = Mathf.Clamp01(volActual); // déjà 0-1
                TryTrigger(StimulusPhase.Stay, "volume", volNorm);
            }

            // ─── Pitch ──────────────────────────────────────────────────────
            if (trackPitch)
            {
                float pitchNorm = Mathf.Clamp01(_src.pitch / maxPitch); // 0-1
                TryTrigger(StimulusPhase.Stay, "pitch", pitchNorm);
            }

            // ─── Distance optionnelle ─────────────────────────────────────
            if (trackDistance)
            {
                float distNorm = Mathf.Clamp01(dist / _src.maxDistance);
                TryTrigger(StimulusPhase.Stay, "distance", distNorm);
            }
        }
    }
}
