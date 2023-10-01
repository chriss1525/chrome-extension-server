const fs = require('fs');
const https = require('https');
const { execSync: exec } = require('child_process');
const { Deepgram } = require('@deepgram/sdk');
const ffmpegStatic = require('ffmpeg-static');
const dotenv = require('dotenv');

const deepgram = new Deepgram(process.env.DEEPGRAM_API_KEY);

function ffmpeg(command) {
    return exec(`${ffmpegStatic} ${command}`)
}

async function transcribeLocalVideo(filePath) {
  // Extract audio from video using FFmpeg
  ffmpeg(`-hide_banner -y -i ${filePath} ${filePath}.wav`)

  const audioFile = {
    buffer: fs.readFileSync(`${filePath}.wav`),
    mimetype: 'audio/wav',
  }
  const response = await deepgram.transcription.preRecorded(audioFile, {
    punctuation: true,
  })
  return response.results
}

module.exports = transcribeLocalVideo;
