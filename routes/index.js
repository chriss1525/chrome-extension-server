const express = require('express');
const multer = require('multer');
const path = require('path');
const supabase = require('../utils/db'); 

const router = express.Router();

// Create a directory for storing uploaded videos
const uploadDirectory = path.join(__dirname, '..', 'utils');

// Create a multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    // unique file name
    const uniqueFileName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueFileName);
  },
});

// Create a multer instance
const upload = multer({ storage });

// Define an endpoint to handle video uploads
router.post('/', upload.single('video'), async (req, res) => {
  try {
    // Ensure that a file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Get the uploaded video url
    const videoUrl = `https://chrome-extension-backend-w4r6.onrender.com/extension/${req.file.filename}.mp4`;

    // Store the URL in your Supabase database
    const { data, error } = await supabase
      .from('Videos').insert([{ url: videoUrl }]);

    if (error) {
      console.error('Error storing video URL in Supabase:', error.message);
      return res.status(500).json({ error: 'Failed to store video URL' });
    }

    res.status(200).json({ success: true, message: 'Video uploaded and URL stored' });
  } catch (err) {
    console.error('Error uploading video:', err.message);
    res.status(500).json({ error: 'Failed to upload video' });
  }
});

// Get all videos urls from supabase
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase.from('Videos').select('url');

    if (error) {
      console.error('Error getting videos from Supabase:', error.message);
      return res.status(500).json({ error: 'Failed to get videos' });
    }

    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error('Error getting videos:', err.message);
    res.status(500).json({ error: 'Failed to get videos' });
  }
});

// get a specific video from supabase
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('Videos')
      .select('url')
      .eq('id', req.params.id)
      .single();

    if (error) {
      console.error('Error getting video from Supabase:', error.message);
      return res.status(500).json({ error: 'Failed to get video' });
    }

    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error('Error getting video:', err.message);
    res.status(500).json({ error: 'Failed to get video' });
  }
});

module.exports = router;
