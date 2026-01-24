"use client";
import { useState } from "react";
import { sendEmotion } from "@/lib/api";

export default function Home() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<any>(null);

  async function handleSubmit() {
    const data = await sendEmotion(text);
    setResult(data);
  }

  return (
    <div className="p-6">
      <textarea value={text} onChange={e => setText(e.target.value)} className="border p-2"/>
      <button onClick={handleSubmit} className="bg-black text-white px-4 py-2 mt-2">Analyze</button>
      {result && <div className="mt-4">Emotion: {result.emotion} <br/> Score: {result.score}</div>}
    </div>
  );
}
