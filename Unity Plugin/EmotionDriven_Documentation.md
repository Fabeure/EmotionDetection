# 📚 Emotion-Driven Gameplay Toolkit - Complete Documentation

## Table of Contents
1. [Introduction](#introduction)
2. [Installation & Dependencies](#installation--dependencies)
3. [Project Folder Structure](#project-folder-structure)
4. [Quick-Start Wizard](#quick-start-wizard)
5. [Core Runtime](#core-runtime)
6. [Logging System](#logging-system)
7. [Editor Tooling](#editor-tooling)
8. [Utilities](#utilities)
9. [Extending the Toolkit](#extending-the-toolkit)
10. [Best Practices & Performance Tips](#best-practices--performance-tips)
11. [Troubleshooting & FAQ](#troubleshooting--faq)
12. [Conclusion](#conclusion)

---

## 1. Introduction

The **Emotion-Driven Gameplay Toolkit** is a comprehensive Unity plugin that transforms camera-based emotion detection into a plug-and-play gameplay layer. It provides a complete ecosystem for capturing, logging, and reacting to player emotions in real-time, enabling adaptive gameplay experiences, UX research, and post-launch analytics.

### Key Features
- **Real-time emotion processing** with configurable confidence thresholds
- **Multi-modal stimulus detection** (Visual, Audio, Proximity, Custom)
- **Flexible logging system** supporting JSON, MongoDB, and API endpoints
- **Designer-friendly editor tools** for scene setup and data management
- **Extensible architecture** for custom emotion adapters and stimuli
- **Production-ready** with built-in cleanup tools

---

## 2. Installation & Dependencies

### Unity Requirements
| Component | Version |
|-----------|---------|
| Unity | 2021 LTS or newer (Mono / IL2CPP) |
| .NET | API Compatibility Level = ".NET Standard 2.1" |

### Importing the Package
1. Clone/copy the `EmotionDriven/` folder into your `Assets/` directory
2. Or import the `.unitypackage` file directly
3. Unity will compile the toolkit into two assemblies:
   - `EmotionDriven.Runtime.dll` (everything under `Runtime/`)
   - `EmotionDriven.Editor.dll` (everything under `Editor/`)

### Optional – MongoDB Support
To enable MongoDB logging capabilities:

1. **Add MongoDB DLLs** to `Assets/Plugins/`:
   - `MongoDB.Bson.dll`
   - `MongoDB.Driver.dll`
   - `MongoDB.Driver.Core.dll`
   - `System.Buffers.dll`
   - `DnsClient.dll`

2. **Add Scripting Define Symbol**:
   - Go to `Project Settings` → `Player` → `Scripting Define Symbols`
   - Add: `ENABLE_MONGODB`

3. **Configure MongoDB URI** in the Session Logger window (e.g., `mongodb://localhost:27017`)

---

## 3. Project Folder Structure

```
Assets/EmotionDriven/
├─ Editor/
│  ├─ CategoryManagerWindow.cs          # Category management UI
│  ├─ EmotionSessionLoggerWindow.cs     # Session logging interface
│  ├─ EmotionSetupWizard.cs             # "Getting Started" wizard
│  ├─ TrackableObjectExporterWindow.cs  # Export trackable objects
│  └─ TrackableCleaner.cs               # Bulk cleanup tool
├─ Runtime/
│  ├─ Logger/
│  │  ├─ EmotionLogger.cs               # Core logging system
│  │  └─ StimulusLogger.cs              # Debug stimulus logging
│  ├─ Stimuli/
│  │  ├─ StimulusBase.cs                # Abstract stimulus base
│  │  ├─ VisualStimulus.cs              # Screen visibility detection
│  │  ├─ AudioStimulus.cs               # Audio source tracking
│  │  ├─ ProximityStimulus.cs           # Distance-based detection
│  │  ├─ TrackableCategory.cs           # Category asset definition
│  │  └─ TrackableObject.cs             # Scene object wrapper
│  ├─ Utils/
│  │  ├─ EmotionEvents.cs               # Event bus system
│  │  ├─ EmotionAdapterBase.cs          # Adapter base class
│  │  ├─ MoodService.cs                 # Rolling emotion averages
│  │  └─ SceneGuidCache.cs              # GUID persistence
│  ├─ Tests/
│  │  ├─ EmotionDebugHUD.cs             # On-screen debug display
│  │  └─ MockEmotionStream.cs           # Test emotion data
│  ├─ UdpEmotionReceiver.cs             # Network emotion input
│  └─ EmotionManager.cs                 # Core singleton manager
├─ Plugins/                              # MongoDB DLLs (optional)
└─ Prefabs/                              # Sample prefabs
    ├─ Audio.prefab
    ├─ Proximity.prefab
    └─ Visual.prefab
```

---

## 4. Quick-Start Wizard

**Menu**: `Tools` → `Emotion-Driven` → `Setup Wizard…`

The Setup Wizard provides a one-stop interface for getting started with the toolkit:

### Overview Panel
- One-paragraph recap of the toolkit's capabilities
- Link to full documentation

### Scene Status Panel
- ✅/❌ **EmotionManager present** - Shows if the core singleton exists
- **Trackable Objects count** - Number of tagged objects in the scene
- **Stimuli components count** - Number of active stimulus detectors

### Quick Actions Panel
- **Create EmotionManager** - Instantly adds the core singleton
- **Open Session Logger** - Launches the logging interface
- **Category Manager** - Opens category management
- **Trackable Cleaner** - Bulk removal tool

### More Help Panel
- Opens local README or GitHub documentation
- Direct link to issues/feature requests

**Tip**: Keep the Wizard docked while working - it live-updates as you add/remove components.

---

## 5. Core Runtime

### 5.1 EmotionManager

The central singleton that manages emotion data and coordinates all stimulus events.

```csharp
// Core properties
public static EmotionManager Instance { get; private set; }
public EmotionSample Latest { get; }                    // Most recent emotion
public bool passiveLoggingEnabled { get; set; }         // Log all emotions

// Events
public event Action<StimulusEvent> OnStimulus;          // Fired for every stimulus
public event Action<EmotionSample> OnEmotionUpdated;    // Fired for every emotion update

// Core API
public void UpdateEmotion(EmotionSample sample);        // Call from your ML pipeline
public List<EmotionSample> GetPassiveLog();             // Get all logged emotions
public void ClearPassiveLog();                          // Clear passive log
```

**Usage Example**:
```csharp
// From your webcam/ML thread
EmotionManager.Instance.UpdateEmotion(new EmotionSample {
    Time = Time.timeAsDouble,
    Label = EmotionLabel.Happy,
    Valence = 0.8f,
    Arousal = 0.6f,
    Confidence = 0.95f
});
```

### 5.2 EmotionEvents Bus

A static event bus that provides easy subscription to stimulus events across your entire project.

```csharp
// Subscribe to all events
void OnEnable()  => EmotionEvents.Any += HandleAnyStimulus;
void OnDisable() => EmotionEvents.Any -= HandleAnyStimulus;

// Subscribe to specific emotion types
EmotionEvents.Subscribe(EmotionLabel.Happy, e => Debug.Log($"Happy event: {e.TrackableId}"));

// Subscribe to specific stimulus types
EmotionEvents.Subscribe(EmotionLabel.Fear, e => {
    if (e.StimulusType == StimulusType.Visual) {
        // Handle visual fear stimuli
    }
});
```

### 5.3 Stimulus Architecture

The toolkit provides a flexible stimulus system with three built-in types and easy extensibility.

#### StimulusBase (Abstract)
```csharp
public abstract class StimulusBase : MonoBehaviour
{
    // Configuration
    public StimulusType Type;                           // Visual/Audio/Proximity/Custom
    public TrackableObject ParentTrackable;             // Associated trackable object
    
    // Trigger Options
    public float cooldown = 0f;                         // Minimum time between triggers
    public bool onlyOnce = false;                       // Trigger only once ever
    public EmotionLabel[] emotionFilter;                // Only trigger for specific emotions
    public float confidenceThreshold = 0f;              // Minimum confidence required
    
    // Core API
    protected void TryTrigger(StimulusPhase phase, string featureName, float featureValue);
    public abstract void Tick(Vector3 playerPos, Camera playerCam);
}
```

#### Built-in Stimulus Types

**VisualStimulus** - Detects when objects enter/exit the camera viewport
```csharp
[AddComponentMenu("Emotion-Driven/Stimuli/Visual Stimulus")]
public class VisualStimulus : StimulusBase
{
    public bool trackScreenDistance = true;              // Track distance from screen center
    
    // Automatically triggers:
    // - Enter: Object becomes visible
    // - Exit: Object leaves viewport
    // - Stay: Continuous distance tracking (if enabled)
}
```

**AudioStimulus** - Monitors audio sources for volume, pitch, and distance
```csharp
[AddComponentMenu("Emotion-Driven/Stimuli/Audio Stimulus")]
public class AudioStimulus : StimulusBase
{
    [Range(0f,1f)] public float audibleThreshold = 0.05f;  // Minimum volume to trigger
    public float maxPitch = 3f;                              // Pitch normalization
    
    public bool trackVolume = true;                          // Monitor volume changes
    public bool trackPitch = true;                           // Monitor pitch changes
    public bool trackDistance = false;                       // Monitor distance changes
}
```

**ProximityStimulus** - Distance-based detection with configurable radius
```csharp
[AddComponentMenu("Emotion-Driven/Stimuli/Proximity Stimulus")]
public class ProximityStimulus : StimulusBase
{
    public float radius = 5f;                               // Detection radius
    public bool trackDistance = true;                       // Continuous distance tracking
    
    // Automatically triggers:
    // - Enter: Player enters radius
    // - Exit: Player leaves radius
    // - Stay: Continuous distance updates (if enabled)
}
```

#### Custom Stimulus Creation
```csharp
public class HeadshotStimulus : StimulusBase
{
    void Awake() { Type = StimulusType.Custom; }
    
    public override void Tick(Vector3 playerPos, Camera playerCam) {
        // No per-frame logic needed
    }
    
    // Call this from your game logic
    void OnPlayerHeadshot() => TryTrigger(StimulusPhase.Enter, "headshot", 1f);
}
```

### 5.4 TrackableObject & Categories

The glue between scene objects, stimuli, and analytics.

#### TrackableObject
```csharp
[AddComponentMenu("Emotion-Driven/Trackable Object")]
public sealed class TrackableObject : MonoBehaviour
{
    [SerializeField] private string objectGuid;         // Stable GUID (auto-generated)
    public string displayName = string.Empty;            // UI display name
    public TrackableCategory category;                   // Associated category
    public int CheckpointIndex = -1;                     // For checkpointing systems
    
    public string ObjectGuid { get; }                    // Stable identifier
    
    // Automatically manages all StimulusBase components
    // Calls Tick() on all stimuli every frame
}
```

#### TrackableCategory
```csharp
[CreateAssetMenu(menuName = "Emotion-Driven/Category")]
public sealed class TrackableCategory : ScriptableObject
{
    [HideInInspector] public string categoryGuid;        // Stable identifier
    public string displayName = "New Category";          // Display name
    public Color color = Color.white;                    // Visual color
    public TrackableCategory parent;                     // Optional hierarchy
}
```

#### Setup Workflow
1. **Create Categories**: Use `Tools` → `Emotion-Driven` → `Categories` → `Category Manager`
2. **Add TrackableObject**: Add component to any GameObject
3. **Choose Category**: Select from dropdown in inspector
4. **Add Stimuli**: Add Visual/Audio/Proximity/Custom stimulus components
5. **Configure**: Adjust radius, thresholds, and tracking options

**Note**: Object GUIDs are automatically generated and persist across scene reloads via `SceneGuidCache`.

---

## 6. Logging System

The EmotionLogger provides comprehensive data capture with multiple output formats and modes.

### 6.1 Session Lifecycle

**Session Phases**:
1. **Start**: `EmotionLogger.StartSession()` or Session Logger → Start
2. **Runtime**: Automatic event capture based on mode
3. **Flush**: Automatic (batch timer) or manual `ForceSave()`
4. **End**: `EndSession()` or leaving Play Mode

### 6.2 Logger Modes

| Mode | Behavior | Use Case |
|------|----------|----------|
| **Realtime** | Each event written immediately | Live dashboards, low-latency metrics |
| **Batch** | Events buffered, flushed every N seconds | High-volume scenes, reduce I/O |
| **Manual** | Events stay in memory until `ForceSave()` | QA sessions, user-controlled saves |

### 6.3 JSONL File Format

```json
#SESSION {
  "SessionName": "Playtest_2025-01-15_14-30",
  "SceneName": "Level_03_Ruins",
  "TesterName": "Alice",
  "Tags": "QA,VR",
  "LoggerMode": 1,
  "LogTarget": 2,
  "FlushInterval": 5
}
{"TrackableId":"d1f29ab...","StimulusType":"Visual","Phase":"Enter","Time":12.34,
 "Emotion":{"Time":12.30,"Label":4,"Valence":-0.4,"Arousal":0.7,"Confidence":0.83}}
{"TrackableId":"d1f29ab...","StimulusType":"Visual","Phase":"Stay","Time":12.35,
 "Emotion":{"Time":12.32,"Label":4,"Valence":-0.3,"Arousal":0.6,"Confidence":0.79},
 "FeatureName":"screenDistance","FeatureValue":0.45}
```

### 6.4 MongoDB Schema

**Database**: `emotion_logs`

**Collections**:
```javascript
// sessions collection
{
  "_id": ObjectId("..."),
  "session": "Playtest_2025-01-15_14-30",
  "scene": "Level_03_Ruins", 
  "tester": "Alice",
  "tags": "QA,VR",
  "start": ISODate("2025-01-15T14:30:00Z")
}

// events collection
{
  "_id": ObjectId("..."),
  "session": "Playtest_2025-01-15_14-30",
  "scene": "Level_03_Ruins",
  "trackable": "d1f29ab...",
  "type": "Visual",
  "phase": "Enter", 
  "time": 12.34,
  "label": "Fear",
  "valence": -0.4,
  "arousal": 0.7,
  "confidence": 0.83
}
```

**Recommended Index**:
```javascript
db.events.createIndex({ session: 1, trackable: 1, time: 1 })
```

### 6.5 Session Logger Window

**Menu**: `Tools` → `Emotion-Driven` → `Emotion Logger` → `Session Manager`

**Configuration Fields**:
- **Session Name**: Auto-generated timestamp or custom name
- **Tester Name**: Player/tester identifier
- **Tags**: Comma-separated tags for filtering
- **Logger Mode**: Manual/Batch/Realtime
- **Log Target**: JSON/MongoDB/API/Both
- **Flush Interval**: Seconds between batch flushes
- **Save Path**: Local file path (for JSON)
- **Mongo URI**: MongoDB connection string
- **API URL**: HTTP endpoint for uploads
- **Auth Token**: Bearer token for API authentication

**Controls**:
- **Start Session**: Begin logging (Play Mode only)
- **Save Now**: Force flush to disk/network
- **Log Dummy**: Test event for debugging
- **Clear Log**: End session and clear buffer
- **Open Log Folder**: Reveal log files in Explorer

### 6.6 Runtime API

```csharp
// Start a session
EmotionLogger.StartSession(new EmotionSessionData {
    SessionName = "Build313_Bob",
    SceneName = SceneManager.GetActiveScene().name,
    LoggerMode = EmotionLoggerMode.Batch,
    LogTarget = EmotionLogTarget.Both,
    FlushInterval = 10,
    LocalPath = "Logs/Beta",
    MongoURI = "mongodb://localhost:27017"
}, apiURL: "http://api.example.com/upload", authToken: "bearer_token");

// Log custom events
EmotionLogger.LogEvent(customStimulusEvent);

// Force save (e.g., on level complete)
EmotionLogger.ForceSave();

// End session manually
EmotionLogger.EndSession();
```

### 6.7 Troubleshooting

| Symptom | Check | Fix |
|---------|-------|-----|
| No JSON file created | Console shows "Failed to create JSONL file" | Verify write permissions to `Application.persistentDataPath` |
| MongoDB insert errors | Console red error lines | Confirm URI, credentials, firewall; DB must allow `insertMany` |
| Huge file sizes | High logging frequency | Lower frequency (Batch mode, longer interval) or enable stimulus cooldown |
| Duplicate sessions | Multiple sessions running | Ensure `EndSession()` on scene reloads or enable "End Session on Play-Exit" |

---

## 7. Editor Tooling

### 7.1 Setup Wizard

**Menu**: `Tools` → `Emotion-Driven` → `Setup Wizard…`

The central hub for getting started and managing the toolkit.

### 7.2 Session Logger Window

**Menu**: `Tools` → `Emotion-Driven` → `Emotion Logger` → `Session Manager`

Complete session management interface with real-time status monitoring.

### 7.3 Category Manager

**Menu**: `Tools` → `Emotion-Driven` → `Categories` → `Category Manager`

**Features**:
- Create, rename, and delete `TrackableCategory` assets
- Set display names and colors
- Hierarchical category support
- Bulk operations

### 7.4 Trackable Objects Exporter

**Menu**: `Tools` → `Emotion-Driven` → `Export Trackable Objects…`

**Features**:
- Export all `TrackableObject` data to JSON
- Configurable field selection (GUID, category, transform, materials, audio)
- Settings persisted in EditorPrefs
- Direct API upload capability

**Exportable Fields**:
- **Name**: Display name
- **GUID**: Stable object identifier
- **Category**: Associated category name
- **Position**: World position
- **Rotation**: Euler angles
- **Scale**: Local scale
- **Materials**: Material names and paths
- **Audio**: AudioSource properties (clip, volume, pitch, spatial blend)

**Output Format**:
```json
{
  "objects": [
    {
      "name": "Crate_Red",
      "guid": "d1f29ab...",
      "category": "Pickup",
      "position": {"x": 12.3, "y": 0, "z": -7.1},
      "rotation": {"x": 0, "y": 45, "z": 0},
      "scale": {"x": 1, "y": 1, "z": 1},
      "materials": [
        {
          "name": "Crate_Red_Mat",
          "path": "Assets/Materials/Crate_Red_Mat.mat"
        }
      ],
      "audio": {
        "clipName": "SpawnPop",
        "clipPath": "Assets/Audio/SpawnPop.wav",
        "volume": 0.8,
        "pitch": 1.0,
        "spatialBlend": 1.0
      }
    }
  ]
}
```

### 7.5 Trackable Cleaner

**Menu**: `Tools` → `Emotion-Driven` → `Cleanup` → `Remove All Trackables & Stimuli`

**Purpose**: Bulk removal of all instrumentation components before shipping builds.

**Removes**:
- All `TrackableObject` components
- All `StimulusBase`-derived components (Visual, Audio, Proximity, Custom)
- Marks scenes as dirty for saving

---

## 8. Utilities

### 8.1 MoodService

Maintains rolling averages of valence and arousal over a configurable time window.

```csharp
public static class MoodService
{
    public static float Window = 5f;        // Rolling window in seconds
    public static float Valence { get; }    // Average valence over window
    public static float Arousal { get; }    // Average arousal over window
    
    // Automatically subscribes to EmotionEvents.Any
    // Updates averages on every stimulus event
}
```

**Usage**:
```csharp
// Check current mood state
if (MoodService.Valence > 0.7f && MoodService.Arousal > 0.8f) {
    // Player is in a positive, excited state
    PlayUpbeatMusic();
}
```

### 8.2 EmotionDebugHUD

Simple on-screen debug display showing current emotion state.

```csharp
public class EmotionDebugHUD : MonoBehaviour
{
    public KeyCode toggleKey = KeyCode.F9;   // Toggle visibility
    public bool visible = true;              // Initial visibility state
}
```

**Display Format**:
```
Emotion: Happy  (conf 95%)
Valence: 0.85  Arousal: 0.60
```

### 8.3 EmotionAdapterBase

Base class for creating custom emotion-driven gameplay adapters.

```csharp
public abstract class EmotionAdapterBase : MonoBehaviour
{
    [Header("Adapter Filters")]
    public EmotionLabel[] labelFilter;      // Only react to specific emotions
    public StimulusType[] typeFilter;       // Only react to specific stimulus types
    
    // Override this method to implement your adaptation
    public abstract void HandleEvent(StimulusEvent e);
}
```

**Example Implementation**:
```csharp
public class MusicController : EmotionAdapterBase
{
    public AudioSource happyMusic;
    public AudioSource sadMusic;
    
    public override void HandleEvent(StimulusEvent e)
    {
        switch (e.Emotion.Label)
        {
            case EmotionLabel.Happy:
                happyMusic.Play();
                sadMusic.Stop();
                break;
            case EmotionLabel.Sad:
                sadMusic.Play();
                happyMusic.Stop();
                break;
        }
    }
}
```

---

## 9. Extending the Toolkit

### 9.1 Creating Custom Stimuli

1. **Derive from StimulusBase**:
```csharp
public class CustomStimulus : StimulusBase
{
    void Awake() { Type = StimulusType.Custom; }
    
    public override void Tick(Vector3 playerPos, Camera playerCam)
    {
        // Implement your detection logic
        if (YourCustomCondition())
            TryTrigger(StimulusPhase.Enter, "customFeature", 1f);
    }
}
```

2. **Add to AddComponentMenu**:
```csharp
[AddComponentMenu("Emotion-Driven/Stimuli/Custom Stimulus")]
```

3. **Configure in Inspector**:
- Set cooldown, emotion filters, confidence threshold
- Add custom serialized fields as needed

### 9.2 Writing Custom Adapters

1. **Derive from EmotionAdapterBase**:
```csharp
public class DifficultyAdjuster : EmotionAdapterBase
{
    public override void HandleEvent(StimulusEvent e)
    {
        // Implement your adaptation logic
        AdjustDifficulty(e.Emotion.Valence, e.Emotion.Arousal);
    }
}
```

2. **Configure Filters**:
- Set `labelFilter` to specific emotions
- Set `typeFilter` to specific stimulus types
- Leave empty to react to all events

### 9.3 Custom Emotion Sources

Integrate your own emotion detection pipeline:

```csharp
public class WebcamEmotionDetector : MonoBehaviour
{
    void Update()
    {
        // Your emotion detection logic here
        var emotion = DetectEmotionFromWebcam();
        
        // Feed to EmotionManager
        EmotionManager.Instance.UpdateEmotion(emotion);
    }
}
```

### 9.4 Network Integration

Use `UdpEmotionReceiver` for network-based emotion input:

```csharp
// Configure in inspector or via code
UdpEmotionReceiver receiver;
receiver.port = 8080;
receiver.StartListening();
```

---

## 10. Best Practices & Performance Tips

### 10.1 Performance Optimization

**Stimulus Management**:
- Use appropriate cooldowns to prevent excessive triggering
- Enable `onlyOnce` for one-time events
- Set confidence thresholds to filter low-quality detections
- Use emotion filters to reduce unnecessary processing

**Logging Optimization**:
- Use Batch mode for high-volume scenes
- Increase flush interval for better performance
- Consider JSON-only logging for development
- Enable MongoDB only when needed

**Memory Management**:
- Clear passive logs periodically
- End sessions properly to free resources
- Use the Trackable Cleaner before shipping builds

### 10.2 Scene Organization

**Category Strategy**:
- Create meaningful categories (e.g., "Pickup", "Enemy", "Environment")
- Use hierarchical categories for complex taxonomies
- Assign colors for visual identification

**Object Naming**:
- Use descriptive display names for trackable objects
- Include prefixes for easy filtering (e.g., "ENV_Tree_01", "PICK_Health_02")

### 10.3 Data Quality

**Emotion Detection**:
- Validate confidence scores before processing
- Use emotion filters to focus on relevant states
- Consider temporal smoothing for noisy inputs

**Stimulus Configuration**:
- Set appropriate detection radii and thresholds
- Test stimulus behavior in different scenarios
- Document custom stimulus logic

### 10.4 Development Workflow

**Setup Phase**:
1. Use Setup Wizard to validate scene
2. Create categories in Category Manager
3. Add TrackableObject components to key objects
4. Configure stimuli with appropriate settings

**Testing Phase**:
1. Use EmotionDebugHUD for real-time monitoring
2. Enable StimulusLogger for detailed event tracking
3. Test with various emotion states and scenarios
4. Validate data quality in log files

**Production Phase**:
1. Use Trackable Cleaner to remove instrumentation
2. Configure appropriate logging targets
3. Set up monitoring for production data
4. Implement proper error handling

---

## 11. Troubleshooting & FAQ

### 11.1 Common Issues

**Q: EmotionManager not found in scene**
A: Use Setup Wizard → "Add EmotionManager" or manually add the component to a GameObject.

**Q: Stimuli not triggering**
A: Check:
- EmotionManager exists and is receiving emotion updates
- Confidence threshold is met
- Emotion filter includes the current emotion
- Cooldown period has elapsed
- `onlyOnce` flag is not already triggered

**Q: No log files being created**
A: Verify:
- Session is started (Session Logger → Start Session)
- Write permissions to `Application.persistentDataPath`
- Logger mode is appropriate for your use case

**Q: MongoDB connection fails**
A: Check:
- `ENABLE_MONGODB` define symbol is set
- MongoDB DLLs are in `Assets/Plugins/`
- URI is correct and accessible
- Database allows write operations

**Q: Performance issues with many stimuli**
A: Optimize by:
- Increasing cooldowns
- Using emotion filters
- Setting confidence thresholds
- Using Batch logging mode
- Reducing flush frequency

### 11.2 Debug Tools

**EmotionDebugHUD**: Press F9 to toggle on-screen emotion display

**StimulusLogger**: Automatically logs all stimulus events to console

**Session Logger**: Real-time session status and manual controls

**Console Logging**: Detailed error messages and status updates

### 11.3 Data Analysis

**JSONL Files**: Use text editors or JSONL parsers for analysis

**MongoDB**: Query with standard MongoDB tools:
```javascript
// Find all events for a specific session
db.events.find({session: "Playtest_2025-01-15_14-30"})

// Find events with high fear levels
db.events.find({label: "Fear", confidence: {$gt: 0.8}})

// Aggregate by trackable object
db.events.aggregate([
  {$group: {_id: "$trackable", count: {$sum: 1}}}
])
```

---

## 12. Conclusion

The **Emotion-Driven Gameplay Toolkit** provides a complete, production-ready solution for integrating emotion detection into Unity games and applications. With its comprehensive feature set, designer-friendly tools, and extensible architecture, it enables developers to create truly adaptive and emotionally responsive experiences.

### What You Get

**Core Runtime**:
- ✦ EmotionManager (Always-on / On-demand modes)
- ✦ EmotionEvents bus for easy integration
- ✦ Flexible stimulus framework (Visual, Audio, Proximity, Custom)
- ✦ Stable object tracking with persistent GUIDs

**Data Layer**:
- ✦ Multi-format logging (JSON, MongoDB, API)
- ✦ Configurable modes (Manual, Batch, Realtime)
- ✦ Rich event data with emotion context
- ✦ Production-ready error handling

**Editor Tooling**:
- ✦ Setup Wizard for quick onboarding
- ✦ Session Logger for data management
- ✦ Category Manager for taxonomy
- ✦ Trackable Objects Exporter for analytics
- ✦ Trackable Cleaner for build preparation

**Utility Components**:
- ✦ MoodService for rolling emotion averages
- ✦ EmotionDebugHUD for real-time monitoring
- ✦ EmotionAdapterBase for custom integrations
- ✦ Comprehensive extension points

### Production Ready

- **No editor code ships** - Runtime ≈ 100 kB managed IL
- **Built-in cleanup** - Strip instrumentation for final builds
- **Graceful fallbacks** - MongoDB optional with JSON fallback
- **Full serialization** - Scenes reopen unchanged
- **Performance optimized** - Configurable for any scale

### Next Steps

1. **Wire your inference** - Call `EmotionManager.UpdateEmotion()` from your ML pipeline
2. **Tag your level** - Add TrackableObjects and stimuli, organize with categories
3. **Run a session** - Use Session Logger to capture data
4. **Analyze results** - Inspect JSONL files or query MongoDB
5. **Adapt gameplay** - Create custom adapters or use MoodService
6. **Ship with confidence** - Use Trackable Cleaner for production builds

The toolkit is designed to scale from simple prototypes to complex production systems, providing the foundation for emotionally intelligent applications that respond to users in real-time.

---

**Support & Resources**:
- Documentation: `Documentation~/index.md` in package root
- Issues/Features: GitHub repository issues
- Community: Discord #emotion-driven-support

**Happy shipping!** 🚀
