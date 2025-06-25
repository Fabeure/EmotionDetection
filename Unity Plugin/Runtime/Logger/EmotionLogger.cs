// FILE: Assets/Scripts/EmotionDriven/Runtime/EmotionLogger.cs
using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using UnityEngine;
using MongoDB.Bson;
using MongoDB.Driver;

namespace EmotionDriven
{
    //────────────────── ENUMS ──────────────────//
    public enum EmotionLogTarget { JSON, MongoDB, API, Both }
    public enum EmotionLoggerMode { Manual, Batch, Realtime }

    //────────────────── SESSION DATA ───────────//
    [Serializable]
    public struct EmotionSessionData
    {
        public string SessionName;
        public string SceneName;
        public string TesterName;
        public string Tags;
        public EmotionLoggerMode LoggerMode;
        public EmotionLogTarget LogTarget;
        public string LocalPath;
        public string MongoURI;
        public float  FlushInterval;
    }

    //────────────────── LOGGER ─────────────────//
    public static class EmotionLogger
    {
        private static List<StimulusEvent> _buffer = new();
        private static EmotionSessionData  _session;
        private static double              _lastFlushTime;
        private static StreamWriter        _streamWriter;
        private static string              _jsonFilePath;
        private static bool                _started;
        private static string _apiURL;
private static string _authToken;


        // MongoDB
        private static IMongoCollection<BsonDocument> _mongoCollection;

        //────────────────── PUBLIC API ──────────//
public static void StartSession(EmotionSessionData session, string apiURL = null, string authToken = null)
{
    EndSession();
    _session    = session;
    _started    = true;
    _buffer.Clear();
    _lastFlushTime = Time.realtimeSinceStartup;

    _apiURL    = apiURL;
    _authToken = authToken;

    // Création du fichier
    string dir = Path.Combine(Application.persistentDataPath, session.LocalPath);
    Directory.CreateDirectory(dir);

    _jsonFilePath = Path.Combine(dir, session.SessionName + ".jsonl");
    _streamWriter = new StreamWriter(_jsonFilePath, false) { AutoFlush = true };
    _streamWriter.WriteLine("#SESSION " + JsonUtility.ToJson(session, true));

    // MongoDB
    if (session.LogTarget is EmotionLogTarget.MongoDB or EmotionLogTarget.Both)
    {
        try
        {
            _mongoCollection = new MongoClient(session.MongoURI)
                               .GetDatabase("EmotionLogger")
                               .GetCollection<BsonDocument>(session.SessionName);
            Debug.Log("[EmotionLogger] MongoDB connected.");
        }
        catch (Exception ex) { Debug.LogError("[EmotionLogger] MongoDB error: " + ex.Message); }
    }

    EmotionManager.Instance.OnStimulus += HandleStimulus;


            Debug.Log($"[EmotionLogger] Session '{session.SessionName}' started.");
        }

        public static void LogEvent(StimulusEvent evt) => HandleStimulus(evt);

        public static void ForceSave()
        {
            FlushBuffer();
            _streamWriter?.Flush();                       // s’assurer que tout est sur disque
            Debug.Log("[EmotionLogger] ForceSave → flush to disk");
            if (_session.LogTarget == EmotionLogTarget.API)
            {
                Debug.Log("[EmotionLogger] ForceSave → upload API");
                _ = UploadFileToApiAsync(_apiURL, _authToken, _jsonFilePath);
            }
        }

        public static void Clear()
        {
            _buffer.Clear();
            _streamWriter?.Dispose(); _streamWriter = null;
            _started = false;
            if (EmotionManager.Instance != null)
                EmotionManager.Instance.OnStimulus -= HandleStimulus;
            _mongoCollection = null;
        }

        //────────────────── INTERNAL ───────────//
        private static void HandleStimulus(StimulusEvent evt)
        {
            if (!_started) return;

            switch (_session.LoggerMode)
            {
                case EmotionLoggerMode.Realtime:
                    AppendEvent(evt);
                    break;

                case EmotionLoggerMode.Batch:
                    _buffer.Add(evt);
                    if (Time.realtimeSinceStartup - _lastFlushTime >= _session.FlushInterval)
                        FlushBuffer();
                    break;

                case EmotionLoggerMode.Manual:
                    _buffer.Add(evt);
                    break;
            }
        }

        private static void FlushBuffer()
        {
            if (_buffer.Count == 0) return;

            // JSON
            foreach (var e in _buffer)
                _streamWriter.WriteLine(JsonUtility.ToJson(e));

            // Mongo
            if ((_session.LogTarget is EmotionLogTarget.MongoDB or EmotionLogTarget.Both)
                && _mongoCollection != null)
            {
                try
                {
                    var docs = new List<BsonDocument>();
                    foreach (var e in _buffer)
                        docs.Add(BsonDocument.Parse(JsonUtility.ToJson(e)));
                    _mongoCollection.InsertMany(docs);
                }
                catch (Exception ex) { Debug.LogError("[EmotionLogger] Mongo flush: " + ex.Message); }
            }

            _buffer.Clear();
            _lastFlushTime = Time.realtimeSinceStartup;
        }

        private static void AppendEvent(StimulusEvent evt)
        {
            _streamWriter.WriteLine(JsonUtility.ToJson(evt));

            if ((_session.LogTarget is EmotionLogTarget.MongoDB or EmotionLogTarget.Both)
                && _mongoCollection != null)
            {
                try { _mongoCollection.InsertOne(BsonDocument.Parse(JsonUtility.ToJson(evt))); }
                catch (Exception ex) { Debug.LogError("[EmotionLogger] Mongo insert: " + ex.Message); }
            }
        }

        public static void EndSession()
        {
            if (!_started) return;
            FlushBuffer();
            _streamWriter?.Dispose();

            if (_session.LogTarget == EmotionLogTarget.API)
                _ = UploadFileToApiAsync(_apiURL, _authToken, _jsonFilePath);

            Clear();
        }

        //────────────────── API UPLOAD ──────────//
private static async Task UploadFileToApiAsync(string url, string token, string filePath)
{
    try
    {
        using var client = new HttpClient();
        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", token);

        using var form = new MultipartFormDataContent();

        // ⚠️ ouverture en partage lecture/écriture → plus de "sharing violation"
        using var fs = new FileStream(filePath,
                                      FileMode.Open,
                                      FileAccess.Read,
                                      FileShare.ReadWrite);
        var fileContent = new StreamContent(fs);                // lit en streaming
        fileContent.Headers.ContentType =
            new MediaTypeHeaderValue("application/octet-stream");

        form.Add(fileContent, "jsonlFile", Path.GetFileName(filePath));

        var response = await client.PostAsync(url, form);
        if (response.IsSuccessStatusCode)
            Debug.Log("[EmotionLogger] API upload successful.");
        else
            Debug.LogError($"[EmotionLogger] API upload failed: {(int)response.StatusCode} – {await response.Content.ReadAsStringAsync()}");
    }
    catch (Exception ex)
    {
        Debug.LogError("[EmotionLogger] API upload error: " + ex.Message);
    }
}


        //────────────────── AUTO-CLEAN ─────────//
#if UNITY_EDITOR
        [UnityEditor.InitializeOnLoadMethod]
        private static void RegisterExitPlaymode()
        {
            UnityEditor.EditorApplication.playModeStateChanged += state =>
            {
                if (state == UnityEditor.PlayModeStateChange.ExitingPlayMode)
                    EndSession();
            };
        }
#endif
    }
}
