const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const supabase = require('../utils/db'); // Import the existing supabase client

const router = express.Router();


// Function to sanitize filenames
function sanitizeFilename(filename) {
  // Replace invalid characters with underscores (you can modify this as needed)
  return filename.replace(/[^a-zA-Z0-9_.-]/g, '_');
}

// Uploads a video to Supabase Storage
router.post('/', upload.single('video'), async (req, res) => {
  try {
    // Ensure a file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Get the uploaded video file
    const videoData = req.file.buffer;

    // sanitize the filename
    const filename = sanitizeFilename(req.file.originalname);

    // Upload the video to Supabase Storage
    const { data: storageData, error: storageError } = await supabase.storage
  .from('chrome-extension')
  .upload(`videos/${Date.now()}-${filename}`, videoData, {
    metadata: {
      contentType: 'video/mp4'
    }
  });

    if (storageError) {
      console.error('Error uploading video to Supabase Storage:', storageError);
      return res.status(500).json({ error: 'Failed to upload video' });
    }

    // Get the URL of the uploaded video
    const videoUrl = storageData[0].url;

    // Store the URL in Supabase database
    const { data, error } = await supabase
      .from('videos')
      .insert([{ url: videoUrl }]);

    if (error) {
      console.error('Error storing video URL in Supabase:', error.message);
      return res.status(500).json({ error: 'Failed to store video URL' });
    }

    // Respond with the video URL
    res.status(200).json({ success: true, url: videoUrl });
  } catch (err) {
    console.error('Error uploading video:', err.message);
    res.status(500).json({ error: 'Failed to upload video' });
  }
});

// Get all videos urls from supabase
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase.from('videos').select('url');

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
      .from('videos')
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
