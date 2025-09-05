import { useState, useRef, useEffect } from 'react'
import api from '../../api'
import './chatbot.css'
import { isLoggedIn } from '../isLoggedIn';

export default function ChatBot() {
  const [question, setQuestion] = useState(""); // <-- Fix: Add this line
  const [loading, setloading] = useState(false);

  const [loading1, setloading1] = useState(false);
  const [listening, setlistening] = useState(false);
  const [response, setresponse] = useState('');
  const [error, seterror] = useState(null);
  const [data, setdata] = useState("");
  const [Isaudioplaying, setIsaudioplaying] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioRef = useRef(null);

  const handlecontainerclick = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("⚠️ You must be logged in to interact with the chatbot!");
      return;
    }
  };

  const startlisten = async () => {
    if (!isLoggedIn()) {
      alert("⚠️ Please login to submit questions!");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecoder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecoder;
      audioChunksRef.current = [];

      mediaRecoder.onstart = () => {
        setlistening(true);
      };
      mediaRecoder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      mediaRecoder.onstop = async () => {
        setlistening(false);
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
        askBackend(audioBlob);
      };
      mediaRecoder.start();
    }
    catch (err) {
      console.error(err);
      seterror('Microphone acess denied or error starting recording');
    }
  };

  //stop mic and audio playback
  const stopAll = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  const askBackend = async (audioBlob) => {
    setloading(true);
    seterror(null);

    try {
      const formdata = new FormData();
      formdata.append('file', audioBlob, 'voice.mp3');
      const res = await api.post(
        "/speak-ask",
        formdata, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob',
      }
      );
      const audioUrl = URL.createObjectURL(res.data);
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
      }
    }
    catch (err) {
      console.error(err);
      seterror(err.message);
    }
    finally {
      setloading(false);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn()) {
      alert("⚠️ Please login to submit questions!");
      return;
    }
    setloading(true);
    seterror(null);
    try {
      const res = await api.post('/ask', { question });
      console.log("Backend response:", res.data);
      const answer = res.response || res.error || 'no response';
      setdata(res.data);


    }
    catch (err) {
      seterror(err.message);
    }
    finally {
      setloading(false)
    }
  }

  const askquestion = async (e) => {
    e.preventDefault();

    setloading1(true);
    seterror(null);
    try {
      const res = await api.post('/ask', { question });
      setdata(res.data);
    }
    catch (err) {
      seterror(err.message);
    }
    finally {
      setloading1(false);
    }
  }


  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleplay = () => setIsaudioplaying(true);
    const handlepause = () => setIsaudioplaying(false);

    audio.addEventListener('play', handleplay);
    audio.addEventListener('pause', handlepause);
    audio.addEventListener('ended', handlepause);

    return () => {
      audio.removeEventListener('play', handleplay);
      audio.removeEventListener('pause', handlepause);
      audio.removeEventListener('ended', handlepause);
    }


  }, []);


  return (
    <>
      <h1 className='heading'>lami the law chatbot</h1>
      <h1 className='chinese_heading'>拉米聊天机器人</h1> {/* "Lami Chatbot" in Chinese */}
      <div className='chatbot_container'>
        <div className='container-form1'>

          <img className={`image-circle ${listening || Isaudioplaying ? 'audio-playing' : ''}`}
            src="/medusa.png"
            alt="medusa image" />
          <audio ref={audioRef} controls />
          <div className='controller'>
            {!listening ? (
              <button onClick={startlisten} disabled={loading} >🎙️ start voice</button>
            ) : <button onClick={stopAll} disabled={loading} >stop</button>}
          </div>
        </div>

        <div className='container-form2'>
          <div className='response_text'>Response<br></br>
            {!loading1 ? <p>{data}</p> : "loading...."}
          </div>
          <form onSubmit={handleSubmit}>
            <textarea
              rows="4"
              placeholder="Ask the legal question...."
              value={question}
              onChange={(e) => setQuestion(e.target.value)} // <-- Add this
              required
            />
            <button
              type='submit'
            >
              {loading ? 'loading....' : 'ask'}

            </button>

          </form>
        </div>
         {error && <p className="error_text">Error: {typeof error === 'object' ? JSON.stringify(error) : error}</p>}
      </div>
    </>
  )
}








