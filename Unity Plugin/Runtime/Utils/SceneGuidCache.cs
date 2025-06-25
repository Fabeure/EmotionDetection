// Assets/Scripts/EmotionDriven/Runtime/SceneGuidCache.cs
using System;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

namespace EmotionDriven
{
    /// <summary>Maps each scene path to a stable GUID (stored in PlayerPrefs).</summary>
    internal static class SceneGuidCache
    {
        private static readonly Dictionary<int,string> _cache = new();

        public static string Get(Scene scene)
        {
            if (_cache.TryGetValue(scene.handle, out var g)) return g;

            string key = $"ED_SceneGuid_{scene.path}";
            g = PlayerPrefs.GetString(key, string.Empty);

            if (string.IsNullOrEmpty(g))
            {
                g = Guid.NewGuid().ToString("N");
                PlayerPrefs.SetString(key, g);
            }
            _cache[scene.handle] = g;
            return g;
        }
    }
}
