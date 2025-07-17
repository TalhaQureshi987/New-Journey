import Contact from '../models/Contact.js';
import nodemailer from 'nodemailer';

// Create reusable transporter object using SMTP
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});

export const submitContact = async(req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Validate input
        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Create new contact document
        const contact = new Contact({
            name,
            email,
            subject,
            message
        });

        // Save to database
        await contact.save();

        // Send emails if configured
        if (process.env.EMAIL_USER && process.env.EMAIL_APP_PASSWORD) {
            try {
                await transporter.verify();

                // Send admin notification
                await transporter.sendMail({
                    from: `"Job Portal Contact" <${process.env.EMAIL_USER}>`,
                    to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
                    subject: `New Contact Form Submission: ${subject}`,
                    html: `
            <h3>New Contact Form Submission</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
          `
                });

                // Send user confirmation
                await transporter.sendMail({
                    from: `"Job Portal" <${process.env.EMAIL_USER}>`,
                    to: email,
                    subject: 'Thank you for contacting us',
                    html: `
            <h3>Thank you for contacting us!</h3>
            <p>We have received your message and will get back to you as soon as possible.</p>
            <p>Best regards,<br>Job Portal Team</p>
          `
                });
            } catch (emailError) {
                console.error('Email sending error:', emailError);
            }
        }

        res.status(201).json({
            success: true,
            message: 'Message received successfully',
            data: {
                contactId: contact._id,
                name: contact.name,
                email: contact.email,
                subject: contact.subject,
                createdAt: contact.createdAt
            }
        });

    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to process your message',
            error: error.message
        });
    }
};

// Get all contacts (for admin)
export const getContacts = async(req, res) => {
    try {
        const contacts = await Contact.find()
            .sort({ createdAt: -1 })
            .select('-__v');

        res.status(200).json({
            success: true,
            count: contacts.length,
            data: contacts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch contacts',
            error: error.message
        });
    }
};

// Get single contact (for admin)
export const getContact = async(req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }

        res.status(200).json({
            success: true,
            data: contact
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch contact',
            error: error.message
        });
    }
};