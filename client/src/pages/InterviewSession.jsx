import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const generateSessionId = () => `session_${Date.now()}`;

const InterviewSession = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { role = "Frontend Developer", difficulty = "Entry-Level" } = location.state || {};

  const [sessionId] = useState(generateSessionId());
  console.log("Current Session ID:", sessionId);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [messages, setMessages] = useState([]);

  const videoRef = useRef(null);
  const recognitionRef = useRef(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [stream, setStream] = useState(null);

  // 1. Fetch questions on mount
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const url = `${import.meta.env.VITE_API_URL}/api/questions/${encodeURIComponent(role)}/${encodeURIComponent(difficulty)}`;
        const res = await fetch(url);
        const data = await res.json();
        
        if (data.success && data.data.length > 0) {
          // Shuffle and take 10
          const shuffled = data.data.sort(() => 0.5 - Math.random()).slice(0, 10);
          setQuestions(shuffled);
          setMessages([{ sender: "ai", text: shuffled[0].question }]);
        } else {
          console.warn("No questions found, using fallback");
          const fallback = [{ question: "Tell me about your experience with React." }];
          setQuestions(fallback);
          setMessages([{ sender: "ai", text: fallback[0].question }]);
        }
      } catch (err) {
        console.error("Failed to fetch questions:", err);
      }
    };
    loadQuestions();
  }, [role, difficulty]);

  // 2. Timer
  useEffect(() => {
    const interval = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  // 3. Camera
  useEffect(() => {
    if (cameraOn && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [cameraOn, stream]);

  // 4. Speech Recognition setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let text = "";
      for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0].transcript + " ";
      }
      setTranscript(text);
    };

    recognitionRef.current = recognition;
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const endInterview = async () => {
  try {
    console.log("Ending interview...");

    // Save current answer if there is one
    const currentQuestion = questions[currentQuestionIndex];

    if (currentQuestion) {
      const token = localStorage.getItem("token");

await fetch(`${import.meta.env.VITE_API_URL}/api/answers`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    role,
    difficulty,
    question: currentQuestion.question,
    answer: transcript.trim() || "(No answer recorded)",
    sessionId,
    timestamp: new Date().toISOString(),
  }),
});
    }

    // Generate report
    const formattedHistory = messages.map((m) => ({
      sender: m.sender,
      message: m.text,
      timestamp: new Date().toISOString(),
    }));

    const response = await fetch(
  `${import.meta.env.VITE_API_URL}/api/reports/generate`,
      {
        method: "POST",
        headers: {
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
},
        body: JSON.stringify({
          sessionId,
          chatHistory: formattedHistory,
        }),
      }
    );

    const result = await response.json();
    console.log(result);

    navigate(`/results?sessionId=${sessionId}`);
  } catch (err) {
    console.error(err);
    alert("Failed to generate report.");
  }
};

  const startCamera = async () => {
    try {
      if (cameraOn) {
        stream?.getTracks().forEach((track) => track.stop());
        setCameraOn(false);
        setStream(null);
        return;
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setStream(mediaStream);
      setCameraOn(true);
    } catch (err) {
      console.error(err);
      alert("Please allow camera and microphone access.");
    }
  };

  const toggleRecording = () => {
    if (!isRecording) {
      setTranscript("");
      recognitionRef.current?.start();
      setIsRecording(true);
    } else {
      recognitionRef.current?.stop();
      setIsRecording(false);
      
      // Append user answer to chat
      if (transcript.trim()) {
        setMessages(prev => [...prev, { sender: "user", text: transcript.trim() }]);
      }
    }
  };

  const handleNextQuestion = async () => {
    if (!questions.length) return;

    // Stop recording if active
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      if (transcript.trim()) {
        setMessages(prev => [...prev, { sender: "user", text: transcript.trim() }]);
      }
    }

    const currentQuestion = questions[currentQuestionIndex];
    const userAnswer = transcript.trim() || "(No answer recorded)";

    console.log("Saving answer with session:", sessionId);

    const answerPayload = {
  role,
  difficulty,
  question: currentQuestion.question,
  answer: userAnswer,
  sessionId,
  timestamp: new Date().toISOString()
};

    console.log("Saving Answer Payload:", answerPayload);

    // Save current pair to MongoDB
    try {
      const token = localStorage.getItem("token");

const res = await fetch(`${import.meta.env.VITE_API_URL}/api/answers`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify(answerPayload),
});
      console.log("Answer Save Response Status:", res.status);
    } catch (error) {
      console.error("Save Error:", error);
    }

    // Reset transcript for next question
    setTranscript("");

    // Load next question or finish
    if (currentQuestionIndex + 1 < questions.length) {
      const nextQ = questions[currentQuestionIndex + 1];
      setCurrentQuestionIndex(prev => prev + 1);
      setMessages(prev => [...prev, { sender: "ai", text: nextQ.question }]);
    } else {
      // Last question completed -> generate report and navigate to results
      const formattedHistory = messages.map(m => ({ 
        sender: m.sender, 
        message: m.text, 
        timestamp: new Date().toISOString() 
      }));
      console.log("Generating report with session:", sessionId);
      const reportPayload = { sessionId, chatHistory: formattedHistory };
      console.log("Generating Report Payload:", reportPayload);
try {
  const token = localStorage.getItem("token");

const repRes = await fetch(`${import.meta.env.VITE_API_URL}/api/reports/generate`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify(reportPayload),
});
    

  const reportData = await repRes.json();

  console.log("Report Generation Response:", reportData);
  console.log("Navigating to Results with:", sessionId);
  navigate(`/results?sessionId=${sessionId}`);
} catch (err) {
  console.error("Report Generation Error:", err);
}}
  };

  const currentQText = questions.length > 0 ? questions[currentQuestionIndex].question : "Loading questions...";

  return (
    <div className="h-screen bg-gray-950 flex flex-col text-white overflow-hidden">
      {/* Header */}
      <header className="min-h-16 border-b border-gray-800 flex flex-col sm:flex-row items-center justify-between px-4 py-3 bg-gray-900/50 backdrop-blur-md z-10 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
          <span className="font-medium text-gray-300">{role} Interview ({difficulty})</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="font-mono text-xl tracking-wider text-gray-400">{formatTime(timer)}</div>
          <button onClick={endInterview} className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/50 rounded-lg hover:bg-red-500 hover:text-white transition-all font-medium text-sm">
            End Session
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-auto relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/10 via-gray-950 to-gray-950"></div>

        {/* AI Avatar Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 relative z-10">
          <div className="relative w-40 h-40 sm:w-52 sm:h-52 lg:w-64 lg:h-64 mb-8 lg:mb-12">
            <div className="absolute inset-0 bg-indigo-500 rounded-full filter blur-[100px] opacity-30 animate-pulse"></div>
            <div className="relative w-full h-full rounded-full border border-gray-800 bg-gray-900/50 backdrop-blur-xl flex items-center justify-center overflow-hidden shadow-2xl">
              {/* Abstract AI Representation */}
              <div className="w-32 h-32 relative">
                <div className="absolute inset-0 border-4 border-indigo-500 rounded-full animate-[spin_4s_linear_infinite] border-t-transparent"></div>
                <div className="absolute inset-2 border-4 border-purple-500 rounded-full animate-[spin_3s_linear_infinite_reverse] border-b-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-full max-w-2xl text-center bg-gray-900/60 p-4 md:p-6 rounded-2xl border border-gray-800 backdrop-blur-md">

  <div className="mb-4">
    <div className="flex justify-between text-sm text-gray-400 mb-2">
      <span>Question {currentQuestionIndex + 1} of {questions.length || 10}</span>
      <span>
        {Math.round(((currentQuestionIndex + 1) / (questions.length || 10)) * 100)}%
      </span>
    </div>

    <div className="w-full bg-gray-700 rounded-full h-2">
      <div
        className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
        style={{
          width: `${((currentQuestionIndex + 1) / (questions.length || 10)) * 100}%`
        }}
      />
    </div>
  </div>

  <p className="text-xl leading-relaxed text-gray-200 font-medium">
    "{currentQText}"
  </p>

</div>
</div>

        {/* Live Transcript / Chat History */}
        <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-gray-800 bg-gray-900/40 backdrop-blur-md flex flex-col z-10 h-80 lg:h-auto">
          <div className="p-4 border-b border-gray-800 font-medium text-sm text-gray-400">Interview Chat History</div>
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                {msg.sender === 'ai' ? (
                  <>
                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0 text-xs font-bold">AI</div>
                    <div className="bg-gray-800/80 rounded-2xl rounded-tl-none px-4 py-3 text-sm text-gray-300">
                      {msg.text}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-8 h-8 rounded-full border border-indigo-500 overflow-hidden flex-shrink-0 flex items-center justify-center bg-gray-800">
                      <span className="text-xs">You</span>
                    </div>
                    <div className="bg-indigo-600/80 rounded-2xl rounded-tr-none px-4 py-3 text-sm text-white max-w-[85%] relative overflow-hidden">
                      <span>{msg.text}</span>
                    </div>
                  </>
                )}
              </div>
            ))}

            {isRecording && (
              <div className="flex gap-3 flex-row-reverse">
                <div className="w-8 h-8 rounded-full border border-indigo-500 overflow-hidden flex-shrink-0 flex items-center justify-center bg-gray-800">
                  <span className="text-xs">You</span>
                </div>
                <div className="bg-indigo-600/80 rounded-2xl rounded-tr-none px-4 py-3 text-sm text-white max-w-[85%] relative overflow-hidden">
                  <span>{transcript || "Listening..."}</span>
                  <div className="absolute bottom-0 left-0 h-0.5 bg-indigo-400 animate-[pulse_1s_ease-in-out_infinite]" style={{width: '60%'}}></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Camera PIP */}
        {cameraOn && (
          <div className="absolute bottom-24 right-4 sm:right-6 lg:right-[26rem] w-32 h-24 sm:w-48 sm:h-36 lg:w-64 lg:h-48 rounded-2xl overflow-hidden border border-gray-700 shadow-2xl z-20 bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </main>

      {/* Controls */}
      <footer className="border-t border-gray-800 bg-gray-950 flex flex-wrap items-center justify-center gap-3 p-4 z-10">
        <button
          onClick={startCamera}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${cameraOn ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>

        <button 
          onClick={toggleRecording}
          className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-xl transition-all transform hover:scale-105 ${isRecording ? 'bg-red-500 shadow-red-500/30' : 'bg-indigo-600 shadow-indigo-600/30'}`}
        >
          {isRecording ? (
             <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="6" width="12" height="12" rx="2"></rect></svg>
          ) : (
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
          )}
        </button>

        <button
          onClick={handleNextQuestion}
          className="px-5 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium"
        >
          {questions.length > 0 && currentQuestionIndex + 1 === questions.length ? "Finish Interview" : "Next Question"}
        </button>

        <button className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
        </button>
      </footer>
    </div>
  );
};

export default InterviewSession;
