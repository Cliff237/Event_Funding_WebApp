import express from 'express';
import { getSchoolOrganizers, createSchoolOrganizer, deleteSchoolOrganizer, bulkDeleteSchoolOrganizers } from '../controllers/schoolAdminController.js';

const router = express.Router();

// List organizers for a school admin's school
router.get('/:adminId/organizers', getSchoolOrganizers);

// Create a new school organizer under this admin's school
router.post('/:adminId/organizers', createSchoolOrganizer);

// Delete a single organizer
router.delete('/:adminId/organizers/:organizerId', deleteSchoolOrganizer);

// Bulk delete organizers
router.delete('/:adminId/organizers', bulkDeleteSchoolOrganizers);

export default router;
