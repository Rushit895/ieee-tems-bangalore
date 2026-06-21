# Spec: Dynamic Chair Message

## Purpose & User Problem
The "Message from the Chair" section on the homepage and the dedicated "Message from Chair" page are currently static. Although the Admin Panel provides a section to manage this content, it isn't reflected on the frontend, forcing manual code updates for new leadership or messages.

## Success Criteria
- [x] **Homepage Integration:** Fetch the chair's name, designation, message, and image from `/api/home/chair-message` and display it in the chair section of `index.html`.
- [x] **Dedicated Page Integration:** Update `message-from-chair.html` to dynamically fetch and display the same content.
- [x] **Fallback Handling:** If no message is set in the database, display the current static content as a fallback.
- [x] **Image Handling:** Ensure images are correctly resolved from the backend `uploads` directory or external URLs.

## Scope
- [x] `frontend/index.html`: Update the inline script to fetch and render the chair message.
- [x] `frontend/message-from-chair.html`: Add a script block to fetch and render the chair message.
- [x] `frontend/js/api.js`: (Optional) Verify `getHome('chair-message')` works as expected. (Verified)

## Technical Considerations
- The API endpoint `/api/home/chair-message` returns an array. We should use the first (most recent) entry.
- Maintain existing styling and layout.

---
**Does this capture your intent? Should I proceed with these changes?**
