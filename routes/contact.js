const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// Submit contact form
router.post('/', async (req, res) => {
  try {
    const { fullName, companyName, phone, services, message } = req.body;
    
    // Validate required fields
    if (!fullName || !phone || !services || !message) {
      return res.status(400).json({ 
        error: 'Full name, phone, services, and message are required',
        missingFields: {
          fullName: !fullName,
          phone: !phone,
          services: !services,
          message: !message
        }
      });
    }

    // Validate services is an array
    if (!Array.isArray(services)) {
      return res.status(400).json({
        error: 'Services must be an array of strings'
      });
    }

    // Create new contact
    const newContact = new Contact({
      fullName,
      companyName: companyName || undefined, // Will not save if undefined
      phone,
      services, // Required per schema
      message
    });

    await newContact.save();
    
    res.status(201).json({ 
      success: true,
      message: 'Contact form submitted successfully',
      contactId: newContact._id
    });
    
  } catch (error) {
    console.error('Contact submission error:', error);
    
    // Handle MongoDB validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
});

module.exports = router;