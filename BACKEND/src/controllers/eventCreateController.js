// Import required modules
import { PrismaClient } from '@prisma/client';
import { z } from 'zod'; // For input validation
import { v4 as uuidv4 } from 'uuid'; // For generating unique slugs

const prisma = new PrismaClient();

// Define validation schema using Zod
const eventCreateSchema = z.object({
  // Basic Information
  eventType: z.enum(['SCHOOL', 'WEDDING', 'FUNERAL', 'BIRTHDAY', 'BUSINESS', 'CHARITY', 'CONFERENCE', 'OTHER']),
  eventName: z.string().min(3).max(100), // Frontend uses eventName as title
  eventTitle: z.string().max(100).optional(), // Additional title field
  eventDescription: z.string().max(1000).optional(),
  organizerId: z.string().optional(),
  schoolId: z.string().optional(), // For school events
  
  
  // Form Customization
  formColors: z.object({
    primary: z.string().regex(/^#[0-9A-F]{6}$/i),
    secondary: z.string().regex(/^#[0-9A-F]{6}$/i),
    text: z.string().regex(/^#[0-9A-F]{6}$/i),
    background: z.string().regex(/^#[0-9A-F]{6}$/i)
  }).optional(),
  
  // Payment Configuration
  paymentMethods: z.array(z.enum(['MOMO', 'OM', 'CARD', 'BANK'])).min(1),
  walletType: z.enum(['app_wallet', 'direct']).optional().default('app_wallet'),
  fundraisingGoal: z.number().min(0).optional(),
  deadline: z.string().datetime().optional(),
  contributorMessage: z.string().max(1000).optional(),
  
  // Receipt Configuration
  receiptConfig: z.object({
    includeFields: z.array(z.string()),
    includeQR: z.boolean().default(true),
    additionalFields: z.record(z.any()).optional(),
    school: z.object({
      name: z.string(),
      link: z.string().url().optional().or(z.literal('')),
      contact: z.string().optional(),
      logoUrl: z.string().url().optional().or(z.literal(''))
    }).optional(),
    layout: z.enum(['one', 'two']).default('one'),
    align: z.enum(['left', 'center', 'right']).default('left'),
    showDividers: z.boolean().default(true),
    accentColor: z.string().default('#7c3aed')
  }).optional(),
  
  // Custom Fields
  fields: z.array(z.object({
    id: z.string(),
    label: z.string(),
    type: z.enum(['TEXT', 'NUMBER', 'EMAIL', 'TEL', 'SELECT', 'RADIO', 'CHECKBOX', 'FILE', 'IMAGE']),
    required: z.boolean().default(false),
    readOnly: z.boolean().default(false),
    options: z.array(z.string()).optional(),
    placeholder: z.string().optional(),
    min: z.number().optional(),
    max: z.number().optional(),
    defaultValue: z.union([z.string(), z.number()]).optional()
  })).optional()
});

/**
 * Create a new event
 * POST /api/events
 * 
 * Request body should contain event details including:
 * - Basic information (title, description, type)
 * - Form customization (colors, fields)
 * - Payment configuration
 * - Receipt customization
 */
const createEvent = async (req, res) => {
  console.log('=== CREATE EVENT REQUEST START ===');
  
  try {
    // 1. Validate request body against schema
    console.log('Validating input data...');
    const validationResult = eventCreateSchema.safeParse(req.body);
    if (!validationResult.success) {
      console.log('❌ Validation failed:', validationResult.error.issues);
      return res.status(400).json({
        error: 'Validation failed',
        details: validationResult.error.issues
      });
    }
    const eventData = validationResult.data;
    console.log('✅ Validation passed, eventData:');
    
    // 2. Handle user association
    if (!req.user || !req.user.id) {
      console.log('❌ No authenticated user');
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Get user from database to verify they exist and get their full details
    const userId = parseInt(req.user.id);
    if (isNaN(userId)) {
      console.log('❌ Invalid user ID format');
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      console.log('❌ User not found in database');
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('✅ User found:', user.name);

    // Check school association if it's a school event
    if (eventData.eventType === 'SCHOOL' && !user.schoolId) {
      console.log('❌ School ID required for school events but user has no schoolId');
      return res.status(400).json({
        error: 'School ID is required for school events'
      });
    }
    
    // 3. Handle schoolId from frontend or user
    let schoolId = eventData.schoolId ? parseInt(eventData.schoolId) : null;
    // The `user` object is guaranteed to exist at this point.
    if (!schoolId && eventData.eventType === 'SCHOOL' && user.schoolId) {
      schoolId = user.schoolId;
    }
    console.log('🏫 School ID handling:', { schoolId, eventType: eventData.eventType, userSchoolId: user?.schoolId });
    
    // 4. Generate a unique slug for the event URL with eventType
    const eventTypeSlug = eventData.eventType.toLowerCase();
    const eventNameSlug = eventData.eventName.toLowerCase().replace(/\s+/g, '-');
    const slug = `${eventTypeSlug}/${eventNameSlug}-${uuidv4().substring(0, 8)}`;
    console.log('🔗 Generated slug with eventType:', slug);
    
    // 5. Create event in a transaction to ensure data consistency
    console.log('💾 Creating event in database...');
    const result = await prisma.$transaction(async (tx) => {
      // Create the event
      console.log('📝 Creating event record...');
      const eventDataForDB = {
        name: eventData.eventName,
        title: eventData.eventTitle,
        organizerId: user.id,
        description: eventData.eventDescription,
        type: eventData.eventType,
        formColor: eventData.formColors, // Map formColors to formColor
        paymentMethods: eventData.paymentMethods,
        walletType: eventData.walletType,
        fundraisingGoal: eventData.fundraisingGoal,
        deadline: eventData.deadline ? new Date(eventData.deadline) : null,
        contributorMessage: eventData.contributorMessage,
        receiptConfig: eventData.receiptConfig,
        eventLink: slug,
        status: 'PENDING'
      };
      
      // Handle user association
      eventDataForDB.organizerId = user.id;
      console.log('🔗 Linking event to user:', user.id);
      
      if (schoolId) {
        eventDataForDB.schoolId = schoolId;
        console.log('🏫 Linking event to school:', schoolId);
      }
      
      const event = await tx.event.create({
        data: eventDataForDB
      });
      console.log('✅ Event created with ID:', event.id);
      
      // Create custom fields if any
      if (eventData.fields && eventData.fields.length > 0) {
        // Map field types to match the Prisma enum values (no conversion needed now)
        const fieldTypeMap = {
          'TEXT': 'TEXT',
          'NUMBER': 'NUMBER',
          'EMAIL': 'EMAIL',
          'TEL': 'TEL',
          'SELECT': 'SELECT',
          'RADIO': 'RADIO',
          'CHECKBOX': 'CHECKBOX',
          'FILE': 'FILE',
          'IMAGE': 'IMAGE'
        };

        // Convert field types to match Prisma enum
        const fieldsToCreate = eventData.fields.map(field => {
          const fieldType = fieldTypeMap[field.type] || 'TEXT';
          
          return {
            eventId: event.id,
            label: field.label,
            fieldType: fieldType, // This now matches the Prisma enum
            required: field.required !== undefined ? field.required : true,
            readOnly: field.readOnly || false,
            options: field.options || [],
            min: field.min,
            max: field.max,
            defaultValue: field.defaultValue || ''
          };
        });

        console.log('📝 Creating event fields:', JSON.stringify(fieldsToCreate, null, 2));
        
        await tx.eventField.createMany({
          data: fieldsToCreate
        });
      }
      
      return event;
    });
    
    // 6. Return success response with created event
    res.status(201).json({
      success: true,
      data: {
        ...result,
        // Include the full URL for the event with eventType
        eventUrl: `${process.env.FRONTEND_URL}/event/${result.eventLink}`
      }
    });
    
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
};

/**
 * Upload event image
 * POST /api/events/:id/image
 * 
 * @middleware upload.single('image') - Handles file upload using multer
 * @param {Object} req - Express request object
 * @param {Object} req.params - URL parameters
 * @param {string} req.params.id - Event ID
 * @param {Object} req.file - Uploaded file object from multer
 * @param {string} req.file.filename - Generated filename
 * @param {Object} req.user - Authenticated user (from auth middleware)
 * @param {Object} res - Express response object
 */
const uploadEventImage = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        error: 'No image file provided' 
      });
    }

    // Verify event exists and belongs to the authenticated user
    const event = await prisma.event.findFirst({
      where: {
        id: parseInt(id),
        organizerId: req.user.id // Ensure user owns the event
      }
    });

    if (!event) {
      // Clean up the uploaded file if event not found
      const fs = await import('fs');
      const path = await import('path');
      const filePath = path.join(process.cwd(), 'uploads', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      
      return res.status(404).json({
        success: false,
        error: 'Event not found or access denied'
      });
    }

    // If there was a previous image, delete it
    if (event.image) {
      try {
        const fs = await import('fs');
        const path = await import('path');
        const oldImagePath = path.join(process.cwd(), event.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      } catch (error) {
        console.error('Error deleting old image:', error);
        // Continue even if old image deletion fails
      }
    }

    // Update event with new image path
    const imageUrl = `/uploads/${req.file.filename}`;
    await prisma.event.update({
      where: { id: parseInt(id) },
      data: { 
        image: imageUrl,
        updatedAt: new Date()
      }
    });

    res.json({
      success: true,
      data: {
        imageUrl: `${process.env.API_URL || ''}${imageUrl}`
      }
    });
    
  } catch (error) {
    console.error('Error uploading image:', error);
    
    // Clean up the uploaded file if an error occurred
    if (req.file) {
      try {
        const fs = await import('fs');
        const path = await import('path');
        const filePath = path.join(process.cwd(), 'uploads', req.file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (cleanupError) {
        console.error('Error cleaning up uploaded file:', cleanupError);
      }
    }
    
    res.status(500).json({ 
      success: false,
      error: 'Failed to upload image',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Publish an event
 * POST /api/events/:id/publish
 */
const publishEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Verify event exists and belongs to user
    const event = await prisma.event.findFirst({
      where: {
        id: parseInt(id),
        organizerId: userId
      }
    });
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found or access denied' });
    }
    
    // Update event status to APPROVED
    const updatedEvent = await prisma.event.update({
      where: { id: parseInt(id) },
      data: { status: 'APPROVED' } // Or 'PUBLISHED' depending on your workflow
    });
    
    res.json({
      success: true,
      data: updatedEvent
    });
    
  } catch (error) {
    console.error('Error publishing event:', error);
    res.status(500).json({ error: 'Failed to publish event' });
  }
};

export {
  createEvent,
  uploadEventImage,
  publishEvent
};