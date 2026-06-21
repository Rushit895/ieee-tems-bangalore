# Spec: IEEE TEMS Bangalore Events Page Redesign

## Purpose & User Problem
The IEEE TEMS Bangalore Section hosts multiple events per week (workshops, talks, hackathons). The current events page is static and basic. The new design needs to be dynamic, high-performance, and visually impactful, maintaining IEEE-standard UI while efficiently handling frequent updates and providing clear information and calls-to-action for users.

## Success Criteria
- [x] **Hero Section (Step 1):** Full-width, looping background video (optimized MP4/WebM) with dark overlay, strong headline ("Driving Innovation Through Events"), supporting text, and a CTA.
- [x] **Filtering & Search (Step 2):** Functional tabs for "Upcoming Events" and "Past Events", category filters (Workshops, Hackathons, Talks, Conferences), and a search bar for quick lookup.
- [x] **Event Cards (Step 3):** Crisp grid layout (consistent dimensions, clean edges, minimal rounding, 8px grid spacing). Cards must include: high-quality cropped poster, title, date, "Organized by" label, "Register" (external link), and "More Info" buttons. Hover effects (elevation/shadow) for interactivity.
- [x] **Scalability (Step 4):** Support pagination or infinite scroll for large datasets. Design for frequent updates via CMS/admin panel without breaking layout consistency.
- [x] **UX Enhancements (Step 5):** Sorting (by date), countdown tags for upcoming events, and clear visual distinction between upcoming and past events.
- [x] **Navigation Integration (Step 6):** Add "View All Events" button on the homepage linking to this page.
- [x] **Design & Responsiveness (Step 7):** Strict adherence to 8px spacing, clean typography hierarchy, and full mobile responsiveness (stacked layout, touch-friendly).
- [x] **Data Management:** Backend schema (`Event.js`) and Admin Panel updated to support categories, organizers, external registration links, and detailed info links.

## Scope & Constraints
- **Frontend (`frontend/events.html` & CSS/JS):** Complete redesign of the events page layout, integrating video hero, filter/search logic, and dynamic card generation.
- **Backend (`backend/models/Event.js` & Controllers):** Update MongoDB schema to include `category`, `organizer`, `registerLink`, `moreInfoLink`, and `imageUrl`.
- **Admin Panel (`admin-panel/src/pages/ManageEvents/`):** Update the form to allow managing the new data fields.
- **Adherence:** Must follow the `UI_Architecture_Spec.md` guidelines (IEEE colors, 12-column grid).

## Technical Considerations
- **Video:** Use `V1.mp4` or `V2.mp4` from the root or `assets` folder as the hero background.
- **Filtering/Sorting:** Implement client-side for performance, with optional backend support for pagination.
- **Styling:** Vanilla CSS following global patterns.

## Out of Scope Items
- Complex user authentication for event registration.
- Detailed sub-pages for every event (using external links or simple modals).

---
**Does this capture your intent? Any changes needed?**
If it looks good, type **'GO!'** when ready to implement.