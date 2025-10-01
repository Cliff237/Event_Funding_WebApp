import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Submit a new school application
 * POST /api/school-applications
 */
export const submitSchoolApplication = async (req, res) => {
  try {
    const {
      organizerName,
      organizerEmail,
      schoolName,
      schoolType,
      location,
      phone,
      website,
      studentsCount,
      description,
      documents
    } = req.body;

    // Validate required fields
    if (!organizerName || !organizerEmail || !schoolName || !schoolType || !location || !phone || !description) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Check if user exists, if not create one
    let user = await prisma.user.findUnique({
      where: { email: organizerEmail }
    });

    if (!user) {
      // Create a basic user record for the applicant
      user = await prisma.user.create({
        data: {
          name: organizerName,
          email: organizerEmail,
          password: 'temp_password', // In real app, you'd handle this differently
          role: 'ORGANIZER'
        }
      });
    }

    // Create the school application
    const application = await prisma.schoolApplication.create({
      data: {
        schoolName,
        city: location,
        contactName: organizerName,
        contactEmail: organizerEmail,
        locationDescription: `${schoolType} located in ${location}. Phone: ${phone}${website ? `, Website: ${website}` : ''}. Students: ${studentsCount}`,
        documents: documents || [],
        applicantId: user.id,
        status: 'PENDING'
      }
    });

    console.log('School application created:', application.id);

    res.status(201).json({
      success: true,
      data: application
    });

  } catch (error) {
    console.error('Error creating school application:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
};

/**
 * Get my school applications (for the user who submitted them)
 * GET /api/school-applications/my-applications/:userId
 */
export const getMySchoolApplications = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    const applications = await prisma.schoolApplication.findMany({
      where: {
        applicantId: parseInt(userId)
      },
      include: {
        applicant: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        approvedSchool: {
          select: {
            id: true,
            name: true,
            code: true,
            approved: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform data to match frontend expectations
    const transformedApplications = applications.map(app => ({
      id: app.id,
      organizerName: app.contactName,
      organizerEmail: app.contactEmail,
      schoolName: app.schoolName,
      schoolType: app.locationDescription?.includes('University') ? 'University' : 
                  app.locationDescription?.includes('Secondary') ? 'Public Secondary School' :
                  app.locationDescription?.includes('Primary') ? 'Public Primary School' : 'Other',
      location: app.city,
      phone: extractPhoneFromDescription(app.locationDescription),
      website: extractWebsiteFromDescription(app.locationDescription),
      studentsCount: extractStudentsFromDescription(app.locationDescription),
      description: app.locationDescription,
      documents: app.documents || [],
      requestDate: app.createdAt.toISOString(),
      status: app.status.toLowerCase(),
      approvedSchool: app.approvedSchool
    }));

    res.json({
      success: true,
      data: transformedApplications
    });

  } catch (error) {
    console.error('Error fetching my school applications:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
};

/**
 * Get all school applications (for admin)
 * GET /api/school-applications/all
 */
export const getAllSchoolApplications = async (req, res) => {
  try {
    const { status = 'all' } = req.query;

    let whereClause = {};
    if (status !== 'all') {
      whereClause.status = status.toUpperCase();
    }

    const applications = await prisma.schoolApplication.findMany({
      where: whereClause,
      include: {
        applicant: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        approvedSchool: {
          select: {
            id: true,
            name: true,
            code: true,
            approved: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform data to match frontend expectations
    const transformedApplications = applications.map(app => ({
      id: app.id,
      organizerName: app.contactName,
      organizerEmail: app.contactEmail,
      schoolName: app.schoolName,
      schoolType: app.locationDescription?.includes('University') ? 'University' : 
                  app.locationDescription?.includes('Secondary') ? 'Public Secondary School' :
                  app.locationDescription?.includes('Primary') ? 'Public Primary School' : 'Other',
      location: app.city,
      phone: extractPhoneFromDescription(app.locationDescription),
      website: extractWebsiteFromDescription(app.locationDescription),
      studentsCount: extractStudentsFromDescription(app.locationDescription),
      description: app.locationDescription,
      documents: app.documents || [],
      requestDate: app.createdAt.toISOString(),
      status: app.status.toLowerCase()
    }));

    res.json({
      success: true,
      data: transformedApplications
    });

  } catch (error) {
    console.error('Error fetching school applications:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
};

/**
 * Get all approved schools
 * GET /api/school-applications/schools
 */
export const getAllSchools = async (req, res) => {
  try {
    const schools = await prisma.school.findMany({
      where: {
        approved: true
      },
      include: {
        application: {
          select: {
            contactName: true,
            contactEmail: true,
            createdAt: true
          }
        },
        organizers: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          where: {
            role: 'SCHOOL_ADMIN'
          }
        },
        events: {
          select: {
            id: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform data to match frontend expectations
    const transformedSchools = schools.map(school => ({
      id: school.id,
      name: school.name,
      type: 'Public School', // You can enhance this based on your needs
      location: school.city || school.address,
      adminName: school.organizers[0]?.user.name || school.application?.contactName || 'N/A',
      adminEmail: school.organizers[0]?.user.email || school.application?.contactEmail || 'N/A',
      studentsCount: 0, // You might want to add this to your schema
      eventsCount: school.events.length,
      logo: school.logo || '',
      approvedDate: school.createdAt.toISOString(),
      status: school.approved ? 'active' : 'inactive',
      phone: '', // You might want to add this to your schema
      website: '' // You might want to add this to your schema
    }));

    res.json({
      success: true,
      data: transformedSchools
    });

  } catch (error) {
    console.error('Error fetching schools:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
};

/**
 * Get school application by ID
 * GET /api/school-applications/:id
 */
export const getSchoolApplicationById = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await prisma.schoolApplication.findUnique({
      where: {
        id: parseInt(id)
      },
      include: {
        applicant: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        approvedSchool: {
          select: {
            id: true,
            name: true,
            code: true,
            approved: true
          }
        }
      }
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        error: 'School application not found'
      });
    }

    // Transform data to match frontend expectations
    const transformedApplication = {
      id: application.id,
      organizerName: application.contactName,
      organizerEmail: application.contactEmail,
      schoolName: application.schoolName,
      schoolType: application.locationDescription?.includes('University') ? 'University' : 
                  application.locationDescription?.includes('Secondary') ? 'Public Secondary School' :
                  application.locationDescription?.includes('Primary') ? 'Public Primary School' : 'Other',
      location: application.city,
      phone: extractPhoneFromDescription(application.locationDescription),
      website: extractWebsiteFromDescription(application.locationDescription),
      studentsCount: extractStudentsFromDescription(application.locationDescription),
      description: application.locationDescription,
      documents: application.documents || [],
      requestDate: application.createdAt.toISOString(),
      status: application.status.toLowerCase(),
      approvedSchool: application.approvedSchool
    };

    res.json({
      success: true,
      data: transformedApplication
    });

  } catch (error) {
    console.error('Error fetching school application:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
};

/**
 * Approve school application
 * POST /api/school-applications/:id/approve
 */
export const approveSchoolApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { customMessage, logo } = req.body;

    // Get the application
    const application = await prisma.schoolApplication.findUnique({
      where: { id: parseInt(id) },
      include: { applicant: true }
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        error: 'School application not found'
      });
    }

    if (application.status === 'APPROVED') {
      return res.status(400).json({
        success: false,
        error: 'Application already approved'
      });
    }

    // Generate unique school code
    const schoolCode = generateSchoolCode(application.schoolName);

    // Create the school and update application in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the school
      const school = await tx.school.create({
        data: {
          name: application.schoolName,
          city: application.city,
          email: application.contactEmail,
          logo: logo || null,
          code: schoolCode,
          approved: true,
          applicationId: application.id,
          address: application.city
        }
      });

      // Update application status
      await tx.schoolApplication.update({
        where: { id: parseInt(id) },
        data: { status: 'APPROVED' }
      });

      // Create school admin relationship
      await tx.schoolOrganizer.create({
        data: {
          userId: application.applicantId,
          schoolId: school.id,
          role: 'SCHOOL_ADMIN'
        }
      });

      return school;
    });

    console.log('School approved and created:', result.id);

    res.json({
      success: true,
      data: {
        message: customMessage || 'Your school application has been approved!',
        school: result,
        schoolCode: schoolCode
      }
    });

  } catch (error) {
    console.error('Error approving school application:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
};

/**
 * Reject school application
 * POST /api/school-applications/:id/reject
 */
export const rejectSchoolApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason, customMessage } = req.body;

    const application = await prisma.schoolApplication.findUnique({
      where: { id: parseInt(id) }
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        error: 'School application not found'
      });
    }

    // Update application status
    await prisma.schoolApplication.update({
      where: { id: parseInt(id) },
      data: { 
        status: 'REJECTED'
      }
    });

    console.log('School application rejected:', id);

    res.json({
      success: true,
      data: {
        message: customMessage || `Your school application has been rejected. Reason: ${reason}`,
        reason
      }
    });

  } catch (error) {
    console.error('Error rejecting school application:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
};

// Helper functions
function extractPhoneFromDescription(description) {
  if (!description) return '';
  const phoneMatch = description.match(/Phone:\s*([^\s,]+)/);
  return phoneMatch ? phoneMatch[1] : '';
}

function extractWebsiteFromDescription(description) {
  if (!description) return '';
  const websiteMatch = description.match(/Website:\s*([^\s,]+)/);
  return websiteMatch ? websiteMatch[1] : '';
}

function extractStudentsFromDescription(description) {
  if (!description) return 0;
  const studentsMatch = description.match(/Students:\s*(\d+)/);
  return studentsMatch ? parseInt(studentsMatch[1]) : 0;
}

function generateSchoolCode(schoolName) {
  const prefix = schoolName.substring(0, 3).toUpperCase();
  const timestamp = Date.now().toString().slice(-6);
  return `${prefix}${timestamp}`;
}