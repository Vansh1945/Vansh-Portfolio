import Contact from '../models/Contact.js';
import nodemailer from 'nodemailer';

// Helper function to send email if configured
const sendEmailNotification = async (contactData) => {
  const { name, email, phone, subject, message } = contactData;

  const { EMAIL_USER, EMAIL_PASS, RECEIVER_EMAIL } = process.env;

  // Only proceed if email config is provided and not default placeholders
  const isPlaceholder = (val) => !val || val.includes('your_email') || val.includes('your_app_password') || val.includes('your_receiver_email');
  if (isPlaceholder(EMAIL_USER) || isPlaceholder(EMAIL_PASS) || isPlaceholder(RECEIVER_EMAIL)) {
    console.log('Email notifications skipped: Email configuration is empty or contains placeholder values.');
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"${name}" <${EMAIL_USER}>`,
      to: RECEIVER_EMAIL,
      replyTo: email,
      subject: `Portfolio Contact Form: ${subject}`,
      text: `You have received a new message from your portfolio contact form.\n\n` +
            `Name: ${name}\n` +
            `Email: ${email}\n` +
            `Phone: ${phone || 'N/A'}\n` +
            `Subject: ${subject}\n\n` +
            `Message:\n${message}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #2563EB;">New Portfolio Message</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap; background: #f9f9f9; padding: 15px; border-radius: 8px;">${message}</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email notification sent successfully.');
  } catch (error) {
    console.error('Error sending email notification:', error.message);
  }
};

// Create a new contact message
export const createContactMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Name, email, subject, and message are required' });
    }

    // Save to database
    const newContact = new Contact({ name, email, phone, subject, message });
    await newContact.save();

    // Send email notification (runs asynchronously in the background)
    sendEmailNotification({ name, email, phone, subject, message });

    res.status(201).json({
      success: true,
      message: 'Your message has been received successfully!',
      data: newContact,
    });
  } catch (error) {
    console.error('Error in createContactMessage:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save message. Please try again later.',
      error: error.message,
    });
  }
};

// Get all contact messages (useful for future admin panels)
export const getContactMessages = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve messages.',
      error: error.message,
    });
  }
};

// Delete contact message (Admin only)
export const deleteContactMessage = async (req, res) => {
  try {
    const message = await Contact.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Message deleted successfully.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete message.',
      error: error.message,
    });
  }
};

// Toggle read status of a message (Admin only)
export const toggleReadStatus = async (req, res) => {
  try {
    const message = await Contact.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    message.read = !message.read;
    await message.save();
    res.status(200).json({
      success: true,
      message: `Message marked as ${message.read ? 'read' : 'unread'}.`,
      data: message
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update message status.',
      error: error.message,
    });
  }
};
