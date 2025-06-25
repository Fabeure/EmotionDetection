#if UNITY_EDITOR
using UnityEditor;
using UnityEngine;
using System.IO;
using System.Collections.Generic;

namespace EmotionDriven.EditorTools
{
    public static class TrackableCategoryImporter
    {
        private class TrackableCategoryDTO
        {
            public string guid;
            public string displayName;
            public string color;
            public string parentGuid;
        }

        private class TrackableCategoryImportWrapper
        {
            public List<TrackableCategoryDTO> categories;
        }

        [MenuItem("Tools/Emotion-Driven/Categories/Import Categories from JSON")]
        public static void Import()
        {
            string path = "Assets/Export/trackable_categories.json";
            if (!File.Exists(path))
            {
                Debug.LogError("❌ JSON file not found: " + path);
                return;
            }

            string json = File.ReadAllText(path);
            var wrapper = JsonUtility.FromJson<TrackableCategoryImportWrapper>(json);
            if (wrapper?.categories == null)
            {
                Debug.LogError("❌ Failed to parse JSON.");
                return;
            }

            string assetDir = "Assets/TrackableCategories";
            Directory.CreateDirectory(assetDir);

            // First pass: create all categories
            Dictionary<string, TrackableCategory> created = new();
            foreach (var dto in wrapper.categories)
            {
                var asset = ScriptableObject.CreateInstance<TrackableCategory>();
                asset.name = dto.displayName;
                asset.categoryGuid = dto.guid;
                asset.displayName = dto.displayName;
                if (ColorUtility.TryParseHtmlString("#" + dto.color, out var color))
                    asset.color = color;

                string assetPath = Path.Combine(assetDir, dto.guid + ".asset");
                AssetDatabase.CreateAsset(asset, assetPath);
                created[dto.guid] = asset;
            }

            // Second pass: assign parents
            foreach (var dto in wrapper.categories)
            {
                if (!string.IsNullOrEmpty(dto.parentGuid) && created.TryGetValue(dto.guid, out var child) && created.TryGetValue(dto.parentGuid, out var parent))
                {
                    child.parent = parent;
                    EditorUtility.SetDirty(child);
                }
            }

            AssetDatabase.SaveAssets();
            AssetDatabase.Refresh();
            Debug.Log($"✅ Imported and regenerated {created.Count} TrackableCategory assets.");
        }
    }
}
#endif
