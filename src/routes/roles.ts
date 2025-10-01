export type UserRole = 'SUPER_ADMIN' | 'ORGANIZER';

export type SchoolRole = 'SCHOOL_ADMIN' | 'SCHOOL_ORGANIZER';

/**
 * Represents all possible roles within the application,
 * combining platform-level roles and school-specific roles.
 */
export type AppRole = UserRole | SchoolRole;