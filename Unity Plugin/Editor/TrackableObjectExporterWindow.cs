// FILE: Assets/Scripts/EmotionDriven/Editor/TrackableObjectExporterWindow.cs
using UnityEditor;
using UnityEngine;
using System;
using System.IO;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using EmotionDriven;               // runtime namespace

public sealed class TrackableObjectExporterWindow : EditorWindow
{
    private string apiURL    = "http://localhost:3000/api/trackable-objects/upload";
    private string authToken = "";

    // ─────────────── Persisted toggles ───────────────
    private bool _name       { get => GetPref(nameof(_name),      true ); set => SetPref(nameof(_name),      value); }
    private bool _guid       { get => GetPref(nameof(_guid),      true ); set => SetPref(nameof(_guid),      value); }
    private bool _category   { get => GetPref(nameof(_category),  true ); set => SetPref(nameof(_category),  value); }
    private bool _pos        { get => GetPref(nameof(_pos),       true ); set => SetPref(nameof(_pos),       value); }
    private bool _rot        { get => GetPref(nameof(_rot),       false); set => SetPref(nameof(_rot),       value); }
    private bool _scale      { get => GetPref(nameof(_scale),     false); set => SetPref(nameof(_scale),     value); }
    private bool _materials  { get => GetPref(nameof(_materials), false); set => SetPref(nameof(_materials), value); }
    private bool _audio      { get => GetPref(nameof(_audio),     false); set => SetPref(nameof(_audio),     value); }

    [MenuItem("Tools/Emotion-Driven/Export Trackable Objects…")]
    public static void ShowWindow() => GetWindow<TrackableObjectExporterWindow>("Export Trackable Objects");

    private void OnGUI()
    {
        EditorGUILayout.LabelField("📦 Fields to Export", EditorStyles.boldLabel);
        using (new EditorGUI.IndentLevelScope())
        {
            _name      = EditorGUILayout.ToggleLeft("Name",      _name);
            _guid      = EditorGUILayout.ToggleLeft("GUID",      _guid);
            _category  = EditorGUILayout.ToggleLeft("Category",  _category);
            _pos       = EditorGUILayout.ToggleLeft("Position",  _pos);
            _rot       = EditorGUILayout.ToggleLeft("Rotation",  _rot);
            _scale     = EditorGUILayout.ToggleLeft("Scale",     _scale);
            _materials = EditorGUILayout.ToggleLeft("Materials", _materials);
            _audio     = EditorGUILayout.ToggleLeft("Audio Source", _audio);
        }

        GUILayout.Space(6);
        if (GUILayout.Button("Export as JSON", GUILayout.Height(32)))
            Export();

        GUILayout.Space(6);
        apiURL = EditorGUILayout.TextField("API URL", apiURL);
        authToken = EditorGUILayout.PasswordField("Auth Token", authToken);
        if (GUILayout.Button("📤 Upload Last Export to API", GUILayout.Height(24)))
            _ = UploadLastExportAsync();
    }

    private string _lastExportPath;

    private void Export()
    {
        var trackables = FindObjectsOfType<TrackableObject>(true);
        if (trackables.Length == 0)
        {
            EditorUtility.DisplayDialog("Trackable Objects", "No TrackableObject found in open scene(s).", "OK");
            return;
        }

        string path = EditorUtility.SaveFilePanel(
            "Save Trackable Objects JSON",
            Environment.GetFolderPath(Environment.SpecialFolder.Desktop),
            "TrackableObjects.json",
            "json");
        if (string.IsNullOrEmpty(path)) return;

        var list = new List<ObjectEntry>();
        foreach (var tr in trackables)
        {
            var entry = new ObjectEntry();

            if (_name)     entry.name     = tr.displayName;
            if (_guid)     entry.guid     = tr.ObjectGuid;
            if (_category) entry.category = tr.category != null ? tr.category.name : "Uncategorized";

            if (_pos)   entry.position = tr.transform.position;
            if (_rot)   entry.rotation = tr.transform.rotation.eulerAngles;
            if (_scale) entry.scale    = tr.transform.localScale;

            if (_materials)
            {
                if (tr.TryGetComponent(out Renderer renderer) && renderer.sharedMaterials != null)
                {
                    var mats = new List<MaterialInfo>();
                    foreach (var m in renderer.sharedMaterials)
                    {
                        if (m == null) continue;
                        mats.Add(new MaterialInfo {
                            name = m.name,
#if UNITY_EDITOR
                            path = AssetDatabase.GetAssetPath(m),
#endif
                        });
                    }
                    if (mats.Count > 0) entry.materials = mats.ToArray();
                }
            }

            if (_audio)
            {
                if (tr.TryGetComponent(out AudioSource src) && src.clip != null)
                {
                    entry.audio = new AudioInfo {
                        clipName     = src.clip.name,
#if UNITY_EDITOR
                        clipPath     = AssetDatabase.GetAssetPath(src.clip),
#endif
                        volume       = src.volume,
                        pitch        = src.pitch,
                        spatialBlend = src.spatialBlend
                    };
                }
            }

            list.Add(entry);
        }

        var wrapper = new Wrapper { objects = list };
        File.WriteAllText(path, JsonUtility.ToJson(wrapper, true));

        _lastExportPath = path;
        EditorUtility.RevealInFinder(path);
        Debug.Log($"✅ Exported {list.Count} objects to {path}");
    }

    private async Task UploadLastExportAsync()
    {
        if (string.IsNullOrEmpty(_lastExportPath) || !File.Exists(_lastExportPath))
        {
            EditorUtility.DisplayDialog("No Export", "You must export a file first.", "OK");
            return;
        }

        try
        {
            using var client = new HttpClient();
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", authToken);

            using var form = new MultipartFormDataContent();
            using var fs = new FileStream(_lastExportPath, FileMode.Open, FileAccess.Read, FileShare.ReadWrite);
            var fileContent = new StreamContent(fs);
            fileContent.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
            form.Add(fileContent, "jsonFile", Path.GetFileName(_lastExportPath));

            var response = await client.PostAsync(apiURL, form);
            if (response.IsSuccessStatusCode)
                Debug.Log("✅ Upload successful.");
            else
                Debug.LogError($"❌ Upload failed: {(int)response.StatusCode} – {await response.Content.ReadAsStringAsync()}");
        }
        catch (Exception ex)
        {
            Debug.LogError("❌ Upload error: " + ex.Message);
        }
    }

    [Serializable] private class MaterialInfo
    {
        public string name;
#if UNITY_EDITOR
        public string path;
#endif
    }

    [Serializable] private class AudioInfo
    {
        public string clipName;
#if UNITY_EDITOR
        public string clipPath;
#endif
        public float volume;
        public float pitch;
        public float spatialBlend;
    }

    [Serializable] private class ObjectEntry
    {
        public string  name;
        public string  guid;
        public string  category;
        public Vector3 position;
        public Vector3 rotation;
        public Vector3 scale;
        public MaterialInfo[] materials;
        public AudioInfo       audio;
    }

    [Serializable] private class Wrapper { public List<ObjectEntry> objects; }

    private static bool GetPref(string k, bool def) => EditorPrefs.GetBool($"ED_TrackableExport_{k}", def);
    private static void SetPref(string k, bool v)  => EditorPrefs.SetBool($"ED_TrackableExport_{k}", v);
}
