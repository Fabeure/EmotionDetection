using UnityEngine;
using EmotionDriven;

public class StimulusLogger : MonoBehaviour
{
    void OnEnable()  => EmotionManager.Instance.OnStimulus += Log;
    void OnDisable() => EmotionManager.Instance.OnStimulus -= Log;

    void Log(StimulusEvent e)
    {
        Debug.Log($"[{e.Time:F2}] {e.TrackableId} {e.StimulusType}/{e.Phase} → {e.Emotion.Label} ({e.Emotion.Confidence:P0})");
    }
}
