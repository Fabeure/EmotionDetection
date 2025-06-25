using UnityEngine;
using EmotionDriven;

[AddComponentMenu("Emotion-Driven/Mock Emotion Stream")]
public class MockEmotionStream : MonoBehaviour
{
    [Header("Manual Emotion Override")]
    public bool useManualEmotion = false;
    public EmotionLabel manualLabel = EmotionLabel.Happy;
    [Range(-1f, 1f)] public float manualValence = 0f;
    [Range(0f, 1f)] public float manualArousal = 0.5f;
    [Range(0f, 1f)] public float manualConfidence = 1f;

    void Update()
    {
        EmotionSample sample;

        if (useManualEmotion)
        {
            sample = new EmotionSample {
                Time = Time.timeAsDouble,
                Label = manualLabel,
                Valence = manualValence,
                Arousal = manualArousal,
                Confidence = manualConfidence
            };
        }
        else
        {
            sample = new EmotionSample {
                Time = Time.timeAsDouble,
                Label = (EmotionLabel)(Random.Range(0, 6)),
                Valence = Random.Range(-1f, 1f),
                Arousal = Random.Range(0f, 1f),
                Confidence = 1f
            };
        }

        EmotionManager.Instance.UpdateEmotion(sample);
    }
}
