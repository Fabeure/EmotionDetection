// Assets/Scripts/EmotionDriven/Runtime/EmotionDebugHUD.cs
using UnityEngine;

namespace EmotionDriven
{
    /// <summary>
    /// Simple on‑screen HUD showing latest emotion label + confidence.
    /// Toggle with F9 by default.
    /// </summary>
    public class EmotionDebugHUD : MonoBehaviour
    {
        public KeyCode toggleKey = KeyCode.F9;
        public bool visible = true;
        private GUIStyle _style;

        void Awake()
        {
            _style = new GUIStyle { fontSize = 16, normal = { textColor = Color.white } };
        }

        void Update()
        {
            if (Input.GetKeyDown(toggleKey)) visible = !visible;
        }

        void OnGUI()
        {
            if (!visible) return;
            var e = EmotionManager.Instance != null ? EmotionManager.Instance.Latest : new EmotionSample();
            string txt = $"Emotion: {e.Label}  (conf {e.Confidence:P0})\nValence: {e.Valence:F2}  Arousal: {e.Arousal:F2}";
            GUI.Label(new Rect(10, 10, 300, 60), txt, _style);
        }
    }
}
