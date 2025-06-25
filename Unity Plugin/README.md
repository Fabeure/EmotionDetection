# Emotion-Driven Gameplay Toolkit

A comprehensive Unity plugin that transforms camera-based emotion detection into a plug-and-play gameplay layer. Capture, log, and react to player emotions in real-time for adaptive gameplay experiences, UX research, and post-launch analytics.

## 🚀 Features

- **Real-time emotion processing** with configurable confidence thresholds
- **Multi-modal stimulus detection** (Visual, Audio, Proximity, Custom)
- **Flexible logging system** supporting JSON, MongoDB, and API endpoints
- **Designer-friendly editor tools** for scene setup and data management
- **Extensible architecture** for custom emotion adapters and stimuli
- **Production-ready** with built-in cleanup tools

## 📋 Requirements

### Current Setup
- **Unity 2021 LTS or newer** (Mono / IL2CPP)
- **UDP Socket Connection** - Currently requires external emotion detection system to feed `EmotionManager` via UDP socket
- **.NET Standard 2.1** API Compatibility Level

### Future Plans
We plan to integrate emotion detection directly into Unity, eliminating the need for external UDP connections. This will provide a more streamlined, all-in-one solution.

## 🛠️ Quick Start

1. **Import the package** into your Unity project
2. **Set up UDP receiver** to feed emotion data to `EmotionManager`
3. **Use Setup Wizard** (`Tools → Emotion-Driven → Setup Wizard…`) to configure your scene
4. **Add TrackableObjects** and stimuli to your game objects
5. **Start logging sessions** with the Session Logger window

## 📚 Documentation

For complete documentation, see [EmotionDriven_Documentation.md](EmotionDriven_Documentation.md)

## 🔧 Installation

1. Clone this repository into your Unity project's `Assets/` folder
2. Or import the `.unitypackage` file directly
3. Unity will compile the toolkit into:
   - `EmotionDriven.Runtime.dll` (runtime components)
   - `EmotionDriven.Editor.dll` (editor tools)

### Optional: MongoDB Support
Add MongoDB DLLs to `Assets/Plugins/` and set `ENABLE_MONGODB` scripting define symbol.

## 🎯 Use Cases

- **Adaptive Gameplay** - Adjust difficulty, music, or narrative based on player emotions
- **UX Research** - Capture emotional responses to game elements
- **Analytics** - Post-launch analysis of player engagement patterns
- **Accessibility** - Emotion-aware interfaces and interactions

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for details.


---

**Note**: This toolkit currently requires an external emotion detection system with UDP socket communication.Here is the model we created for testing:  https://github.com/Hama26/emotion_detection Future versions will include integrated emotion detection capabilities.
