using System.Collections.Generic;
using System.Linq;
using UnityEngine;

namespace EmotionDriven
{
    /// <summary>
    /// Maintains rolling averages of valence/arousal over a window for easy querying.
    /// </summary>
    public static class MoodService
    {
        private static readonly Queue<(float t,float v,float a)> q = new();
        public static float Window = 5f; // seconds

        public static float Valence { get; private set; }
        public static float Arousal { get; private set; }

        static MoodService()
        {
            EmotionEvents.Any += AddSample;
        }

        private static void AddSample(StimulusEvent e)
        {
            q.Enqueue((Time.time, e.Emotion.Valence, e.Emotion.Arousal));
            // drop old samples
            while (q.Count > 0 && q.Peek().t < Time.time - Window) q.Dequeue();
            if (q.Count == 0) { Valence = Arousal = 0; return; }
            Valence = q.Average(s => s.v);
            Arousal = q.Average(s => s.a);
        }
    }
}
