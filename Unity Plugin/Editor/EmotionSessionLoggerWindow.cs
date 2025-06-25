#if UNITY_EDITOR
using UnityEditor;
using UnityEngine;
using System;
using System.IO;
using EmotionDriven;

public class EmotionSessionLoggerWindow : EditorWindow
{
    private string sessionName = "Session_" + DateTime.Now.ToString("yyyyMMdd_HHmmss");
    private string testerName  = "";
    private string tags        = "";

    private EmotionLoggerMode loggerMode = EmotionLoggerMode.Manual;
    private EmotionLogTarget  logTarget  = EmotionLogTarget.JSON;
    private float flushInterval = 10f;

    private string localPath = "Logs/EmotionSessions";
    private string mongoURI  = "mongodb://localhost:27017";

    private string apiURL    = "http://localhost:3000/sessions/upload";
    private string authToken = "";

    private bool sessionActive;
    private DateTime lastEventTime;

    [MenuItem("Tools/Emotion-Driven/Emotion Logger/Session Manager")]
    public static void ShowWindow() =>
        GetWindow<EmotionSessionLoggerWindow>("Emotion Session Logger");

    private void OnEnable()
    {
        EditorApplication.playModeStateChanged += OnPlayModeChanged;
    }

    private void OnDisable()
    {
        EditorApplication.playModeStateChanged -= OnPlayModeChanged;
    }

    private void OnPlayModeChanged(PlayModeStateChange state)
    {
        if (state == PlayModeStateChange.ExitingPlayMode)
            sessionActive = false;
    }

    private void OnGUI()
    {
        GUILayout.Label("📁 Session Metadata", EditorStyles.boldLabel);

        EditorGUILayout.BeginHorizontal();
        sessionName = EditorGUILayout.TextField("Session Name", sessionName);
        if (GUILayout.Button("🔄", GUILayout.Width(28)))
            sessionName = "Session_" + DateTime.Now.ToString("yyyyMMdd_HHmmss");
        EditorGUILayout.EndHorizontal();

        testerName = EditorGUILayout.TextField("Tester Name", testerName);
        tags       = EditorGUILayout.TextField("Tags", tags);

        GUILayout.Space(10);
        GUILayout.Label("🔧 Logging Settings", EditorStyles.boldLabel);

        loggerMode    = (EmotionLoggerMode)EditorGUILayout.EnumPopup("Logger Mode", loggerMode);
        logTarget     = (EmotionLogTarget)EditorGUILayout.EnumPopup("Log Target",  logTarget);
        flushInterval = EditorGUILayout.Slider("Flush Interval (s)", flushInterval, 1f, 60f);

        if (logTarget is EmotionLogTarget.JSON or EmotionLogTarget.Both)
            localPath = EditorGUILayout.TextField("Save Path", localPath);

        if (logTarget is EmotionLogTarget.MongoDB or EmotionLogTarget.Both)
            mongoURI = EditorGUILayout.TextField("Mongo URI", mongoURI);

        if (logTarget == EmotionLogTarget.API)
        {
            apiURL    = EditorGUILayout.TextField("API URL", apiURL);
            authToken = EditorGUILayout.PasswordField("Auth Token", authToken);
        }

        GUILayout.Space(10);
        GUILayout.Label("🧪 Manual Controls", EditorStyles.boldLabel);

        bool inPlayMode = Application.isPlaying;

        // Start Session enabled only in Play Mode and when not active
        EditorGUI.BeginDisabledGroup(!inPlayMode || sessionActive);
        if (GUILayout.Button("Start Session")) StartSession();
        EditorGUI.EndDisabledGroup();

        // Other buttons only when session is active
        EditorGUI.BeginDisabledGroup(!sessionActive);
        using (new EditorGUILayout.HorizontalScope())
        {
            if (GUILayout.Button("Save Now"))  EmotionLogger.ForceSave();
            if (GUILayout.Button("Log Dummy")) LogDummyEvent();
            if (GUILayout.Button("Clear Log")) ClearLog();
        }
        EditorGUI.EndDisabledGroup();

        if (GUILayout.Button("📂 Open Log Folder"))
        {
            string path = Path.Combine(Application.persistentDataPath, localPath);
            Directory.CreateDirectory(path);
            EditorUtility.RevealInFinder(path);
        }

        GUILayout.Space(10);
        GUILayout.Label("📊 Status", EditorStyles.boldLabel);
        EditorGUILayout.LabelField("Play Mode", Application.isPlaying ? "Yes" : "No");
        EditorGUILayout.LabelField("Session Active", sessionActive ? "Yes" : "No");
        EditorGUILayout.LabelField("Last Event", sessionActive ? lastEventTime.ToString("HH:mm:ss") : "None");
    }

    private void StartSession()
    {
        if (!Application.isPlaying)
        {
            EditorUtility.DisplayDialog("Start Session Denied",
                "Sessions can only be started in Play Mode.", "OK");
            return;
        }

        sessionActive = true;

        EmotionLogger.StartSession(new EmotionSessionData
        {
            SessionName   = sessionName,
            SceneName     = UnityEngine.SceneManagement.SceneManager.GetActiveScene().name,
            TesterName    = testerName,
            Tags          = tags,
            LoggerMode    = loggerMode,
            LogTarget     = logTarget,
            LocalPath     = localPath,
            MongoURI      = mongoURI,

            FlushInterval = flushInterval
        },   apiURL,authToken);
    }

    private void LogDummyEvent()
    {
        if (!sessionActive) return;

        EmotionLogger.LogEvent(new StimulusEvent
        {
            TrackableId  = "DummyObject",
            StimulusType = StimulusType.Custom,
            Phase        = StimulusPhase.Enter,
            Time         = Time.realtimeSinceStartup,
            Emotion = new EmotionSample
            {
                Time       = Time.realtimeSinceStartup,
                Label      = EmotionLabel.Happy,
                Valence    = 0.85f,
                Arousal    = 0.8f,
                Confidence = 1f
            }
        });
        lastEventTime = DateTime.Now;
    }

    private void ClearLog()
    {
        EmotionLogger.EndSession();
        sessionActive = false;
    }
}
#endif
