#if UNITY_EDITOR
using UnityEditor;
using UnityEngine;
using System.Linq;

namespace EmotionDriven.EditorTools
{
    public static class TrackableCleaner
    {
        [MenuItem("Tools/Emotion-Driven/Cleanup/Remove All Trackables & Stimuli")]
        public static void RemoveAllTrackablesAndStimuli()
        {
            int trackableCount = 0;
            int stimuliCount = 0;

            var allObjects = UnityEngine.Object.FindObjectsOfType<GameObject>(true);

            foreach (var obj in allObjects)
            {
                // Remove all MonoBehaviours that inherit from StimulusBase
                var components = obj.GetComponents<MonoBehaviour>();
                foreach (var comp in components)
                {
                    if (comp == null) continue;

                    var type = comp.GetType();
                    if (type.IsSubclassOf(typeof(EmotionDriven.StimulusBase)))
                    {
                        UnityEngine.Object.DestroyImmediate(comp);
                        stimuliCount++;
                    }
                }
                // Remove TrackableObject component if present
                var trackable = obj.GetComponent<EmotionDriven.TrackableObject>();
                if (trackable != null)
                {
                    UnityEngine.Object.DestroyImmediate(trackable);
                    trackableCount++;
                }

                
            }

            Debug.Log($"✅ Removed {trackableCount} TrackableObject(s) and {stimuliCount} StimulusBase-derived component(s).");
        }
    }
}
#endif
