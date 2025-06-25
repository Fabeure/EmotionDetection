// Assets/Scripts/EmotionDriven/Editor/CategoryManagerWindow.cs
#if UNITY_EDITOR
using System.Collections.Generic;
using System.Linq;
using UnityEditor;
using UnityEngine;

namespace EmotionDriven
{
    public sealed class CategoryManagerWindow : EditorWindow
    {
        private List<TrackableCategory> _cats;
        private Vector2 _scroll;

        [MenuItem("Tools/Emotion-Driven/Categories/Category Manager")]
        private static void Open() => GetWindow<CategoryManagerWindow>("Category Manager");

        private void OnEnable() => Refresh();

        private void Refresh() =>
            _cats = AssetDatabase.FindAssets("t:TrackableCategory")
                   .Select(g => AssetDatabase.LoadAssetAtPath<TrackableCategory>(AssetDatabase.GUIDToAssetPath(g)))
                   .OrderBy(c => c.displayName).ToList();

        private void OnGUI()
        {
            if (_cats == null) Refresh();

            _scroll = EditorGUILayout.BeginScrollView(_scroll);
            foreach (var cat in _cats.ToArray())
{
    EditorGUILayout.BeginHorizontal();

    EditorGUI.BeginChangeCheck();
    cat.displayName = EditorGUILayout.TextField(cat.displayName);
    cat.color       = EditorGUILayout.ColorField(cat.color, GUILayout.Width(60));
    if (EditorGUI.EndChangeCheck())
    {
        EditorUtility.SetDirty(cat);
        AssetDatabase.SaveAssets();
    }

    if (GUILayout.Button("×", GUILayout.Width(20)))
    {
        if (EditorUtility.DisplayDialog("Delete Category",
            $"Delete category '{cat.displayName}'?", "Yes", "No"))
        {
            string path = AssetDatabase.GetAssetPath(cat);
            AssetDatabase.DeleteAsset(path);
            _cats.Remove(cat);
            continue;
        }
    }
    EditorGUILayout.EndHorizontal();
}

            EditorGUILayout.EndScrollView();

            GUILayout.FlexibleSpace();
            if (GUILayout.Button("+ New Category", GUILayout.Height(25)))
            {
                string path = EditorUtility.SaveFilePanelInProject(
                    "Create Category", "New Category", "asset", "Save category asset");
                if (!string.IsNullOrEmpty(path))
                {
                    var cat = ScriptableObject.CreateInstance<TrackableCategory>();
                    cat.displayName = System.IO.Path.GetFileNameWithoutExtension(path);
                    AssetDatabase.CreateAsset(cat, path);
                    AssetDatabase.SaveAssets();
                    Refresh();
                }
            }
        }
    }
}
#endif
