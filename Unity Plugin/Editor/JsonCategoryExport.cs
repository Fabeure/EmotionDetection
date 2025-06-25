#if UNITY_EDITOR
using UnityEditor;
using UnityEngine;
using System.Linq;
using System.IO;
using System.Collections.Generic;

namespace EmotionDriven.EditorTools
{
    public static class TrackableCategoryExporter
    {
        [System.Serializable]
        public class TrackableCategoryDTO
        {
            public string guid;
            public string displayName;
            public string color;
            public string parentGuid;
        }

        [System.Serializable]
        public class TrackableCategoryExportWrapper
        {
            public List<TrackableCategoryDTO> categories;
        }

        [MenuItem("Tools/Emotion-Driven/Categories/Export Categories to JSON")]
        public static void Export()
        {
            var guids = AssetDatabase.FindAssets("t:TrackableCategory");
            var list = new List<TrackableCategoryDTO>();

            foreach (var guid in guids)
            {
                var path = AssetDatabase.GUIDToAssetPath(guid);
                var cat = AssetDatabase.LoadAssetAtPath<TrackableCategory>(path);
                if (cat == null) continue;

                list.Add(new TrackableCategoryDTO
                {
                    guid = cat.categoryGuid,
                    displayName = cat.displayName,
                    color = ColorUtility.ToHtmlStringRGB(cat.color),
                    parentGuid = cat.parent ? cat.parent.categoryGuid : ""
                });
            }

            var wrapper = new TrackableCategoryExportWrapper { categories = list };
            string json = JsonUtility.ToJson(wrapper, true);

            string filePath = "Assets/Export/trackable_categories.json";
            Directory.CreateDirectory("Assets/Export");
            File.WriteAllText(filePath, json);
            AssetDatabase.Refresh();
            Debug.Log($"✅ Exported {list.Count} categories to: {filePath}");
        }
    }
}
#endif
