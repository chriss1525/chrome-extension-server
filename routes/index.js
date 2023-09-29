const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const admin = require('firebase-admin');
const { createClient } = require('@supabase/supabase-js');

const router = express.Router();


// Uploads a video to the firebase
router.post('/', upload.single('video'), async (req, res) => {
  try {

    if (!admin.apps.length) {
      console.error('Firebase is not initialized. Make sure to call admin.initializeApp()');
      return res.status(500).json({ error: 'Firebase is not initialized' });
    }
    
    // Ensure a file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Get the uploaded video file
    const videoData = req.file.buffer;

    // Upload the video to Firebase Storage
    const bucket = admin.storage().bucket();
    const fileName = `videos/${Date.now()}-${req.file.originalname}`;
    const file = bucket.file(fileName);

    try {
    const result = await file.save(videoData, {
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    console.log('Firebase Storage Result:', result);

    if (!Array.isArray(result) || result.length === 0 || result[0].error) {
      console.error('Error uploading video to Firebase Storage:', result[0].error);
      return res.status(500).json({ error: 'Failed to upload video' });
    }


    // Get the Firebase Storage URL
    let videoUrl = '';
    if (Array.isArray(result) && result.length > 0 && result[0].metadata && result[0].metadata.mediaLink) {
      videoUrl = result[0].metadata.mediaLink;
    } else {
      console.error('Invalid result object:', result);
      // Handle the error gracefully or return an appropriate response.
      return res.status(500).json({ error: 'Failed to upload video' });
    }



    // Store the URL in Supabase
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
} catch (err) {
  console.error('Error uploading video:', err.message);
  res.status(500).json({ error: 'Failed to upload video' });
};
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
