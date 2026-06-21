# Spec: Navigation Bar Update

## Purpose & User Problem
The current navigation bar includes an "Important Links" section which needs to be replaced with a "Gallery" link to improve user access to visual content and streamline the menu.

## Success Criteria
- [x] "Important Links" (linking to `important-links.html`) is removed from the navigation bar in `frontend/components/navbar.html`.
- [x] "Gallery" (linking to `gallery.html`) is added in its place.
- [x] Verified that the footer does not contain "Important Links" (no change needed there).
- [x] The Gallery link correctly navigates to the existing `gallery.html` page.

## Scope & Constraints
- Update `T1/repo/ieee-tems-bangalore/frontend/components/navbar.html`.
- No changes needed to `footer.html` or `navbar.css`.
- The update is limited to the navigation menu.

## Technical Considerations
- The navbar is a shared component loaded via JS (`navbar.js`).
- `gallery.html` already exists in the `frontend` directory.

## Out of Scope
- Redesigning the `gallery.html` page itself.
- Modifying other navigation items unless specified.
