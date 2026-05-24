import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';
// import fs from 'fs/promises';
import multer from 'multer';
import express from 'express';

const ai = new GoogleGenAI({});
const app = express();
const upload = multer();

const GEMINI_MODEL = "gemini-3.5-flash";

app.use(express.json());
app.use(express.static("public"));

const PORT = 3000;
app.listen(PORT, () => console.log(`Server ready on http://localhost:${PORT}`));


// Endpoint untuk memproses Teks
app.post('/generate-text', async (req, res) => {
  const { prompt } = req.body;

  // Validasi: pastikan prompt tidak kosong
  if (!prompt) {
    return res.status(400).json({ message: "Prompt teks tidak boleh kosong." });
  }

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt
    });

    res.status(200).json({ result: response.text });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e.message });
  }
});

// Endpoint untuk memproses Gambar
app.post("/generate-from-image", upload.single("image"), async (req, res) => {
  try {
    // Validasi: pastikan file gambar dikirim
    if (!req.file) {
      return res.status(400).json({ message: "File gambar tidak ditemukan." });
    }

    const { prompt } = req.body;
    const base64Image = req.file.buffer.toString("base64");

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        { text: prompt ?? "Tolong jelaskan gambar berikut.", type: "text" },
        { inlineData: { data: base64Image, mimeType: req.file.mimetype } }
      ],
    });

    res.status(200).json({ result: response.text });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e.message });
  }
});

// Endpoint untuk memproses Dokumen
app.post("/generate-from-document", upload.single("document"), async (req, res) => {
  try {
    // Validasi: pastikan file dokumen dikirim
    if (!req.file) {
      return res.status(400).json({ message: "File dokumen tidak ditemukan." });
    }

    const { prompt } = req.body;
    const base64Document = req.file.buffer.toString("base64");

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        { text: prompt ?? "Tolong buat ringkasan dari dokumen berikut.", type: "text" },
        { inlineData: { data: base64Document, mimeType: req.file.mimetype } }
      ],
    });

    res.status(200).json({ result: response.text });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e.message });
  }
});

// Endpoint untuk memproses Audio/Rekaman Suara
app.post("/generate-from-audio", upload.single("audio"), async (req, res) => {
  try {
    // Validasi: pastikan file audio dikirim
    if (!req.file) {
      return res.status(400).json({ message: "File audio tidak ditemukan." });
    }

    const { prompt } = req.body;
    const base64Audio = req.file.buffer.toString("base64");

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        { text: prompt ?? "Tolong buatkan transkrip dari rekaman berikut.", type: "text" },
        { inlineData: { data: base64Audio, mimeType: req.file.mimetype } }
      ],
    });

    res.status(200).json({ result: response.text });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e.message });
  }
});

app.post('/api/chat', async (req, res) => {
    const { conversation } = req.body;
    try {
        if (!Array.isArray(conversation)) throw new Error('Messages must be an array!');

        let isvalid = true

        conversation.forEach(({ role, text }) => {
            if (!isvalid) return;
        
            if (!['model', 'user'].includes(role)) {
                isvalid = false;
            }
        
            if (!text || typeof text !== 'string') {
                isvalid = false;
            }
        });
        
        if (!isvalid) {
            return res.status(400).json({ message: "payload nggak valid gan!" })
        }

        const contents = conversation.map(({ role, text }) => ({
            role,
            parts: [{ text }]
        }));

        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents,
            config: {
                temperature: 0.9,
                systemInstruction: "Kamu adalah Sahabat AI, seorang pendengar yang sangat empatik, hangat, dan peduli. Tugas utamamu adalah mendengarkan keluh kesah, cerita, dan masalah pengguna. Berikan respons yang menenangkan, suportif, dan selalu memvalidasi perasaan mereka. Jangan menghakimi dan jangan terburu-buru menceramahi atau memberikan solusi kecuali pengguna memintanya—ingat, terkadang orang hanya butuh didengarkan dan dipahami. Gunakan bahasa Indonesia yang santai, lembut, dan bersahabat seperti sedang mengobrol dengan teman dekat.",
            },
        });
        res.status(200).json({ result: response.text });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});