import Certificate from '../models/Certificate.js';
import Service from '../models/Service.js';
import Contact from '../models/Contact.js';
import Testimonial from '../models/Testimonial.js';

export const getDashboardStats = async (req, res) => {
  try {
    const certificatesCount = await Certificate.countDocuments();
    const servicesCount = await Service.countDocuments();
    const unreadContactsCount = await Contact.countDocuments({ read: false });
    const pendingTestimonialsCount = await Testimonial.countDocuments({ approved: false });

    res.status(200).json({
      success: true,
      data: {
        certificates: certificatesCount,
        services: servicesCount,
        unreadContacts: unreadContactsCount,
        pendingTestimonials: pendingTestimonialsCount,
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve dashboard statistics.',
      error: error.message,
    });
  }
};
