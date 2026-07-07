import Service from '../models/Service.js';

const defaultServices = [
  {
    title: 'Basic Business Website',
    category: 'Basic',
    icon: 'Laptop',
    shortDescription: 'Perfect for startups, local businesses & personal brands looking for a clean online presence.',
    startingPrice: 12999,
    deliveryTime: '5 Days',
    technologyStack: ['React.js', 'Tailwind CSS', 'Vite', 'Framer Motion'],
    featuresIncluded: [
      'Up to 5 Pages Website',
      'Responsive Mobile-Friendly Design',
      'Modern UI/UX Layout',
      'Contact Form Integration',
      'WhatsApp Chat Integration',
      'Basic SEO Setup',
      'Fast Loading Website',
      'Social Media Integration',
      'SSL Security Setup',
      'Google Map Integration',
      'Admin Panel Access',
      '1 Month Free Support'
    ],
    revisions: '5 Revisions',
    supportDuration: '30 Days',
    popular: false,
    recommended: false,
    rating: 4.8,
    projectsCompleted: 24,
    details: {
      fullDescription: 'Get your startup or local business online with a professional web portal. Responsive mobile layout, custom sections, WhatsApp integration, and a clean interface designed to give your visitors the best first impression.',
      whoIsFor: ['Doctors', 'Consultants', 'Local Businesses', 'Personal Brands', 'Small Agencies'],
      developmentProcess: [
        { step: 'Requirement gathering', description: 'Aligning on website goal, color choices, and pages content.', duration: '1 Day' },
        { step: 'Design Approval', description: 'Reviewing UI mockup frameworks and finalizing the layout.', duration: '1 Day' },
        { step: 'React Development', description: 'Writing modern, mobile-responsive frontend code.', duration: '2 Days' },
        { step: 'SEO & Deploy', description: 'Setting up meta descriptors and publishing live on Vercel.', duration: '1 Day' }
      ],
      timeline: '5 Working Days',
      deliverables: ['Production-ready React source code', 'Live website URL on Netlify/Vercel', 'Basic administration documentation'],
      faqs: [
        { question: 'What is included in the 1 Month Free Support?', answer: 'I will resolve any layout adjustments, bugs, or text updates for 30 days after deployment.' },
        { question: 'Can we add more than 5 pages later?', answer: 'Yes! The site is built dynamically so adding new pages is simple and can be done at any time.' }
      ]
    }
  },
  {
    title: 'Standard Professional Website',
    category: 'Standard',
    icon: 'Layout',
    shortDescription: 'Ideal for growing businesses & service providers who need dynamic features and portfolio sections.',
    startingPrice: 24999,
    deliveryTime: '10 Days',
    technologyStack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS'],
    featuresIncluded: [
      'Up to 15 Pages Website',
      'Premium Custom Design',
      'Advanced UI/UX',
      'SEO Optimized Structure',
      'Blog Setup',
      'Lead Generation Forms',
      'WhatsApp & Live Chat Integration',
      'Social Media Integration',
      'Gallery & Portfolio Section',
      'Basic On-Page SEO',
      'Security Optimization',
      'Admin Dashboard',
      'Google Analytics Integration',
      '2 Months Free Support'
    ],
    revisions: '7 Revisions',
    supportDuration: '60 Days',
    popular: false,
    recommended: false,
    rating: 4.9,
    projectsCompleted: 18,
    details: {
      fullDescription: 'An interactive custom solution for growing service companies and agencies. Comes with a blog, lead forms, portfolio grids, and a secure admin dashboard to control page features and view data.',
      whoIsFor: ['Agencies', 'Real Estate', 'Education', 'Corporate Businesses', 'Service Companies'],
      developmentProcess: [
        { step: 'Architecture & Mockup Design', description: 'Designing Figma wireframes for all 15 pages.', duration: '2 Days' },
        { step: 'Frontend React Development', description: 'Coding premium elements, blog grids, and contact page.', duration: '4 Days' },
        { step: 'Backend Admin Panel setup', description: 'Creating Node/Express controllers to manage dynamic posts.', duration: '2 Days' },
        { step: 'Analytics & Deployment', description: 'Hooking up Google Analytics, speed checking, and deployment.', duration: '2 Days' }
      ],
      timeline: '10 Working Days',
      deliverables: ['Full frontend & backend source code access', 'Admin dashboard login credentials', 'Google Analytics setup details'],
      faqs: [
        { question: 'Does the blog support image uploads?', answer: 'Yes. The admin dashboard is configured to allow direct writing, editing, and publishing of blog posts with images.' }
      ]
    }
  },
  {
    title: 'Premium Business Website',
    category: 'Premium',
    icon: 'Code',
    shortDescription: 'Perfect for brands that need advanced features, custom animations, booking systems, and top performance.',
    startingPrice: 39999,
    deliveryTime: '15 Days',
    technologyStack: ['React.js', 'Node.js', 'MongoDB', 'Framer Motion', 'Tailwind CSS'],
    featuresIncluded: [
      'Up to 30 Pages Website',
      'Fully Custom Premium Design',
      'Dynamic Website Development',
      'Advanced Animations & Effects',
      'Custom Contact & Inquiry Forms',
      'SEO Optimized Website',
      'Advanced Speed Optimization',
      'Blog & News Section',
      'Portfolio/Case Study Section',
      'CRM/API Integrations',
      'Booking/Appointment System',
      'Multi-Language Support',
      'Google Analytics & Search Console Setup',
      'Advanced Security Features',
      'Priority Support',
      '3 Months Free Support'
    ],
    revisions: 'Unlimited Revisions',
    supportDuration: '90 Days',
    popular: true,
    recommended: false,
    rating: 5.0,
    projectsCompleted: 31,
    details: {
      fullDescription: 'Our most popular tier. Ideal for businesses needing booking forms, high-speed custom motion design, multi-language toggles, API integrations, and robust database management tools.',
      whoIsFor: ['Large Businesses', 'Healthcare', 'Travel', 'Finance', 'SaaS', 'Growing Brands'],
      developmentProcess: [
        { step: 'API Schema & Database Setup', description: 'Configuring Mongoose models for booking and blogs.', duration: '3 Days' },
        { step: 'UI Motion Styling', description: 'Implementing premium animations, custom themes, and forms.', duration: '5 Days' },
        { step: 'Functional Integrations', description: 'Connecting multi-language APIs and custom booking calendars.', duration: '4 Days' },
        { step: 'Audit, Security Setup & Launch', description: 'Securing API endpoints, performing speed tests, and live launch.', duration: '3 Days' }
      ],
      timeline: '15 Working Days',
      deliverables: ['Responsive custom web app source code', 'Booking integration credentials', '3 Months Dedicated Support access'],
      faqs: [
        { question: 'Can the booking system sync with Google Calendar?', answer: 'Yes! We can configure the database API to send automated invites and check availability directly on Google Calendar.' }
      ]
    }
  },
  {
    title: 'Enterprise Custom Web Solution',
    category: 'Enterprise',
    icon: 'Server',
    shortDescription: 'Best for enterprise businesses & complex custom MERN stack applications with dashboards and secure payments.',
    startingPrice: 59999,
    deliveryTime: '30 Days',
    technologyStack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Stripe/Razorpay', 'JWT'],
    featuresIncluded: [
      'Unlimited Pages Website',
      'Fully Custom UI/UX Design',
      'Custom Web Application Development',
      'Advanced Admin Panel',
      'API Integrations',
      'CRM/ERP Integration',
      'Payment Gateway Integration',
      'Advanced Security & Firewall',
      'Custom Dashboard',
      'User Login & Membership System',
      'Multi-Vendor/Marketplace Features',
      'Scalable Cloud Hosting Support',
      'SEO & Analytics Setup',
      'Dedicated Project Manager',
      'Priority Technical Support',
      'Ongoing Maintenance Support'
    ],
    revisions: 'Unlimited Revisions',
    supportDuration: '180 Days',
    popular: false,
    recommended: true,
    rating: 5.0,
    projectsCompleted: 12,
    details: {
      fullDescription: 'Fully scalable, highly secure web application. Fits complex subscription systems, multi-vendor marketplaces, API gateways, database dashboard reporting pipelines, and enterprise-grade portals.',
      whoIsFor: ['Enterprise Businesses', 'Web Applications', 'Marketplaces', 'Large Organizations'],
      developmentProcess: [
        { step: 'Consultation & System Architecture', description: 'Designing database normalization, routing security, and integrations.', duration: '5 Days' },
        { step: 'Figma UI/UX Mockups', description: 'Polishing complete interface flows for users, sellers, and admin panels.', duration: '5 Days' },
        { step: 'Backend API & Payments Development', description: 'Building Stripe webhooks, JWT auth patterns, and ERP handlers.', duration: '10 Days' },
        { step: 'Frontend Layout Implementation', description: 'Developing dashboard widgets, checkout systems, and charts.', duration: '7 Days' },
        { step: 'Quality Testing & VPS Cloud Deploy', description: 'Conducting load tests, firewall configurations, and AWS/VPS deployment.', duration: '3 Days' }
      ],
      timeline: '30 Working Days',
      deliverables: ['Private GitHub repository access', 'AWS/VPS production hosting setup details', 'Swagger API documentation', 'Dedicated support SLA details'],
      faqs: [
        { question: 'What is the user capacity limit of the database?', answer: 'We structure the application using scalable MongoDB configurations, allowing it to handle hundreds of thousands of active users without lag.' }
      ]
    }
  }
];

// Fetch all services (and seed if empty or outdated)
export const getServices = async (req, res) => {
  try {
    let services = await Service.find().sort({ createdAt: 1 });

    // Check if we need to upgrade the database data to match the new image specifications
    const needsUpgrade = services.length > 0 && (
      services[0].title === 'Business Portfolio Website' || 
      services[0].startingPrice === 15000
    );

    if (services.length === 0 || needsUpgrade) {
      console.log('Resetting and seeding new services matching image specifications...');
      await Service.deleteMany({});
      await Service.insertMany(defaultServices);
      services = await Service.find().sort({ createdAt: 1 });
    }

    res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve services.',
      error: error.message,
    });
  }
};

// Create new service
export const createService = async (req, res) => {
  try {
    const { title, description, price, icon, category, deliveryTime, featuresIncluded, technologyStack } = req.body;

    const newService = new Service({
      title,
      icon: icon || 'Laptop',
      category: category || 'General',
      shortDescription: description || req.body.shortDescription || 'No description provided.',
      startingPrice: price !== undefined ? price : (req.body.startingPrice || 0),
      deliveryTime: deliveryTime || '5 Days',
      featuresIncluded: featuresIncluded || [],
      technologyStack: technologyStack || []
    });

    await newService.save();
    res.status(201).json({
      success: true,
      message: 'Service created successfully!',
      data: newService,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create service.',
      error: error.message,
    });
  }
};

// Update a service
export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, icon, category, deliveryTime, featuresIncluded, technologyStack } = req.body;

    const updateFields = {
      title,
      icon,
      category,
      shortDescription: description,
      startingPrice: price,
      deliveryTime,
      featuresIncluded,
      technologyStack
    };

    // Remove undefined fields
    Object.keys(updateFields).forEach(key => {
      if (updateFields[key] === undefined) {
        delete updateFields[key];
      }
    });

    const service = await Service.findByIdAndUpdate(id, updateFields, { new: true, runValidators: true });

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Service updated successfully!',
      data: service,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update service.',
      error: error.message,
    });
  }
};

// Delete a service
export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findByIdAndDelete(id);

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Service deleted successfully!',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete service.',
      error: error.message,
    });
  }
};
