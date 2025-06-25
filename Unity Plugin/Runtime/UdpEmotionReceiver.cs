using UnityEngine;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;
using EmotionDriven;
using System;
using System.Collections.Concurrent;

public class UdpEmotionReceiver : MonoBehaviour
{
    public int port = 5066; // Default port, can be changed in the inspector
    private UdpClient udpClient;
    private Thread receiveThread;
    private ConcurrentQueue<EmotionSample> emotionQueue = new ConcurrentQueue<EmotionSample>();
    private bool running = false;

    void Start()
    {
        // Close previous client just in case
        Cleanup();

        udpClient = new UdpClient(port);
        running = true;
        receiveThread = new Thread(ReceiveData);
        receiveThread.IsBackground = true;
        receiveThread.Start();
    }

    void Update()
    {
        while (emotionQueue.TryDequeue(out EmotionSample sample))
        {
            sample.Time = Time.timeAsDouble;
            EmotionManager.Instance?.UpdateEmotion(sample);
        }
    }

    void ReceiveData()
    {
        IPEndPoint remoteEP = new IPEndPoint(IPAddress.Any, 0);
        while (running)
        {
            try
            {
                byte[] data = udpClient.Receive(ref remoteEP);
                string json = Encoding.UTF8.GetString(data);
                EmotionData payload = JsonUtility.FromJson<EmotionData>(json);

                EmotionSample sample = new EmotionSample
                {
                    Label = (EmotionLabel)payload.label,
                    Valence = payload.valence,
                    Arousal = payload.arousal,
                    Confidence = payload.confidence
                };

                emotionQueue.Enqueue(sample);
                Debug.Log($"Received Emotion: {sample.Label}, Valence: {sample.Valence}, Arousal: {sample.Arousal}, Confidence: {sample.Confidence}");
            }
            catch (Exception e)
            {
                if (running) // Avoid log spam on quit
                    Debug.LogError("UDP Error: " + e.Message);
            }
        }
    }

    void OnDestroy()
    {
        Cleanup();
    }

    void OnApplicationQuit()
    {
        Cleanup();
    }

    private void Cleanup()
    {
        running = false;

        try { udpClient?.Close(); } catch { }
        udpClient = null;

        try { receiveThread?.Join(100); } catch { }
        receiveThread = null;
    }

    [Serializable]
    public class EmotionData
    {
        public int label;
        public float valence;
        public float arousal;
        public float confidence;
    }
}
