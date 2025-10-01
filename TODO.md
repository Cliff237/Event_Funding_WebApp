# Debug and Fix 500 Internal Server Errors

## Completed Tasks
- [x] Analyzed the failing API endpoints: /api/events/overview/1 and /api/events/wallet-summary/1
- [x] Identified root cause: Schema-code mismatch in user queries and role checking
- [x] Updated getEventsByRole function to use schoolAccesses relation instead of direct schoolId
- [x] Updated getOrganizerOverview to include schoolAccesses in user query
- [x] Updated recentEvents query logic to use schoolAccesses
- [x] Updated getEventWalletSummary to include schoolAccesses in user query
- [x] Fixed response data structure to remove invalid schoolId references

## Next Steps
- [ ] Test the backend server to ensure endpoints work without 500 errors
- [ ] Verify frontend components load data correctly
- [ ] Check for any remaining database or logic issues
