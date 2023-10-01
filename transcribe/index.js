const fs = require('fs');
const https = require('https');
const { execSync: exec } = require('child_process');
const { Deepgram } = require('@deepgram/sdk');
const ffmpegStatic = require('ffmpeg-static');
const dotenv = require('dotenv');

const deepgram = new Deepgram(process.env.DEEPGRAM_API_KEY);

async function ffmpeg(command) {
  return new Promise((resolve, reject) => {
    exec(`${ffmpegStatic} ${command}`, (err, stderr, stdout) => {
      if (err) reject(err)
      resolve(stdout)
    })
  })
}

async function transcribeLocalVideo(filePath) {
  ffmpeg(`-hide_banner -y -i ${filePath} ${filePath}.wav`);

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
