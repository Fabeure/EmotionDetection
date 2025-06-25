// Assets/Scripts/EmotionDriven/Editor/EmotionSetupWizard.cs
#if UNITY_EDITOR
using System.Linq;
using UnityEditor;
using UnityEngine;
using UnityEngine.SceneManagement;

namespace EmotionDriven.Editor
{
    /// <summary>
    /// One‑stop "Getting Started" wizard: overview, quick actions, health checks.
    /// Menu: Emotion‑Driven ▶ Setup Wizard…
    /// </summary>
    public class EmotionSetupWizard : EditorWindow
    {
        private Vector2 _scroll;
        private GUIStyle _header;

        [MenuItem("Tools/Emotion-Driven/Setup Wizard…", priority = 0)]
        private static void Open() => GetWindow<EmotionSetupWizard>(false, "Emotion Setup Wizard", true);

        private void OnEnable()
        {
            _header = new GUIStyle(EditorStyles.boldLabel) { fontSize = 14 };
        }

        private void OnGUI()
        {
            _scroll = EditorGUILayout.BeginScrollView(_scroll);
            DrawOverview();
            EditorGUILayout.Space(8);
            DrawSceneStatus();
            EditorGUILayout.Space(8);
            DrawQuickActions();
            EditorGUILayout.Space(8);
            DrawLinks();
            EditorGUILayout.EndScrollView();
        }

        // ───────────────────────────────────────────────────────────── Overview
        private void DrawOverview()
        {
            EditorGUILayout.LabelField("Emotion‑Driven Gameplay Toolkit", _header);
            EditorGUILayout.HelpBox("This wizard helps you set up the core components, access auxiliary windows, and validate that your scene is ready to capture emotions.", MessageType.Info);
        }

        // ─────────────────────────────────────────────────────────── SceneStatus
        private void DrawSceneStatus()
        {
            EditorGUILayout.LabelField("Scene status", _header);
            var trackables = FindObjectsOfType<EmotionDriven.TrackableObject>(true);
            var stimuli    = FindObjectsOfType<EmotionDriven.StimulusBase>(true);
            var manager    = FindObjectOfType<EmotionDriven.EmotionManager>(true);

            EditorGUILayout.LabelField("EmotionManager", manager ? "✅ Present" : "❌ Missing");
            EditorGUILayout.LabelField("Trackable Objects", trackables.Length.ToString());
            EditorGUILayout.LabelField("Stimuli components", stimuli.Length.ToString());
        }

        // ─────────────────────────────────────────────────────────── QuickActions
        private void DrawQuickActions()
        {
            EditorGUILayout.LabelField("Quick actions", _header);

            // row 1
            EditorGUILayout.BeginHorizontal();
            if (GUILayout.Button("Add EmotionManager", GUILayout.Height(30))) EnsureEmotionManager();
            if (GUILayout.Button("Open Session Logger", GUILayout.Height(30)))
                EditorApplication.ExecuteMenuItem("Tools/Emotion-Driven/Emotion Logger/Session Manager");
            EditorGUILayout.EndHorizontal();

            // row 2
            EditorGUILayout.BeginHorizontal();
            if (GUILayout.Button("Category Manager",GUILayout.Height(30)))
                EditorApplication.ExecuteMenuItem("Tools/Emotion-Driven/Categories/Category Manager");
            if (GUILayout.Button("Trackable Cleaner",GUILayout.Height(30)))
                EditorApplication.ExecuteMenuItem("Tools/Emotion-Driven/Cleanup/Remove All Trackables & Stimuli");
            EditorGUILayout.EndHorizontal();
        }

        private void EnsureEmotionManager()
        {
            if (FindObjectOfType<EmotionDriven.EmotionManager>(true))
            {
                ShowNotification(new GUIContent("EmotionManager already exists."));
                return;
            }
            var go = new GameObject("EmotionManager");
            go.AddComponent<EmotionDriven.EmotionManager>();
            Undo.RegisterCreatedObjectUndo(go, "Create EmotionManager");
            ShowNotification(new GUIContent("EmotionManager created."));
        }

        // ──────────────────────────────────────────────────────────── Links / Docs
        private void DrawLinks()
        {
            EditorGUILayout.LabelField("More help", _header);
            if (GUILayout.Button("Open Documentation (README)"))
            {
                string readmePath = AssetDatabase.FindAssets("README_EmotionDriven").FirstOrDefault();
                if (!string.IsNullOrEmpty(readmePath))
                    AssetDatabase.OpenAsset(AssetDatabase.LoadAssetAtPath<TextAsset>(AssetDatabase.GUIDToAssetPath(readmePath)));
                else
                    Application.OpenURL("https://github.com/your-repo/EmotionDrivenToolkit#readme");
            }
            if (GUILayout.Button("GitHub / Issues"))
                Application.OpenURL("https://github.com/your-repo/EmotionDrivenToolkit/issues");
        }
    }
}
#endif
