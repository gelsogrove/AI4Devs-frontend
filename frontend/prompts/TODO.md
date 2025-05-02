# TODO List: Kanban Position Page Implementation

---

## 1. File Structure Planning
**Description:**
- Decide the location and name for the Kanban board page/component (e.g., `src/pages/PositionKanban.tsx` or `src/components/PositionKanban.tsx`).
- Ensure it fits the current project structure and naming conventions.
- Link the new page to the "Ver Proceso" button, passing the position id in the URL (e.g., `/positions/1`).
**Acceptance Criteria:**
- File is created in the correct location.
- Page is accessible via the correct route with the position id.
- No implementation of UI or logic yet.
**Status:** DONE
**Feedback:** No error in the build

---

## 2. Add and Configure React Router
**Description:**
- Install `react-router-dom` as a dependency.
- Set up routing in `App.tsx` to support navigation between the positions list and the Kanban board (`/positions/:id`).
- Ensure the "Ver Proceso" button navigates to the correct Kanban page.
**Acceptance Criteria:**
- Routing is functional and the Kanban page is accessible via `/positions/:id`.
- The positions list remains accessible.
- No UI or business logic for the Kanban board yet.
**Status:** DONE
**Feedback:** I can click the process button and it redirects to the correct URL (/positions/1). The Kanban placeholder renders, but I see a warning: No routes matched location ... Routing works, but the warning appears, likely due to dev server configuration.

---

## 3. Install and Configure Drag & Drop Library (dnd-kit)
**Description:**
- Add `@dnd-kit/core` to the project dependencies.
- Ensure the library is ready to use in the Kanban board component.
- Add a minimal working example to verify drag-and-drop works with dnd-kit.
**Acceptance Criteria:**
- Library is installed and imported without errors.
- Example usage (e.g., a simple draggable item) works in isolation using dnd-kit.
**Status:** DONE
**Feedback:** The library was installed and works perfectly.

---

## 4. Basic Page Structure
**Description:**
- Implement the header with the position title and a back arrow.
- Create dynamic columns for each interview stage.
- Add placeholder cards for candidates in the correct columns.
**Acceptance Criteria:**
- Header displays the position title and back arrow.
- Columns are generated dynamically based on interview stages.
- Cards are placed in the correct columns (static data for now).
**Status:** DONE
**Feedback:** Works fine, layout structure is correctly implemented.

---

## 5. API Integration: Fetch Position and Stages
**Description:**
- Integrate `GET /position/:id/interviewFlow` to fetch the position title and interview stages.
- Display the fetched data in the UI.
**Acceptance Criteria:**
- Position title and stages are fetched and rendered correctly.
- Handles loading and error states.
**Status:** DONE
**Feedback:** API integration works. Initially had an issue with the URL (singular vs plural route), but was fixed. Data structure required careful parsing due to nested JSON.

---

## 6. API Integration: Fetch Candidates
**Description:**
- Integrate `GET /position/:id/candidates` to fetch candidates for the position.
- Display each candidate in the correct stage column.
**Acceptance Criteria:**
- Candidates are fetched and rendered in the correct columns.
- Each card displays full name and average score.
- Handles loading and error states.
**Status:** DONE
**Feedback:** Successfully implemented. The API call works correctly and candidates are displayed in their respective columns based on their current interview stage (I ha)

---

## 7. Implement Drag & Drop Logic
**Description:**
- Enable drag-and-drop for candidate cards between columns using react-beautiful-dnd.
- Update the UI to reflect the new stage when a card is moved.
**Acceptance Criteria:**
- Cards can be dragged and dropped between columns.
- UI updates immediately on drop.
**Status:** DONE
**Feedback:** Successfully implemented drag and drop functionality with react-beautiful-dnd. Candidates can be moved between columns by dragging or using buttons for better accessibility. The UI updates immediately when cards are moved, and the data is prepared for the server update in the next task.

---

## 8. API Integration: Update Candidate Stage
**Description:**
- Integrate `PUT /candidates/:id/stage` to update a candidate's stage when moved.
- Ensure the correct payload is sent (applicationId and new stage id).
- Handle optimistic UI updates and error states.
**Acceptance Criteria:**
- API is called with correct data when a card is moved.
- UI reflects the change and handles errors gracefully.
**Status:** DONE
**Feedback:** Successfully implemented API integration for updating candidate stages. Added optimistic updates so the UI updates immediately, with rollback if the API call fails. Added toast notifications for success/error feedback and a spinner overlay during API calls. Also implemented error tracking to show persistent errors in an Alert component.

---

## 9. Responsive Design
**Description:**
- Make the Kanban board mobile-friendly (columns stack vertically, full width on mobile).
- Ensure usability and readability on all screen sizes.
**Acceptance Criteria:**
- Board is fully responsive.
- Columns stack vertically on mobile.
- No horizontal scrolling required on small screens.
**Status:** DONE
**Feedback:** Responsive layout is fully implemented using Bootstrap's grid system with xs, md, lg, and xl breakpoints. Columns now stack vertically on small screens and display in a grid on larger screens.

---

## 10. Consistency and Reuse
**Description:**
- Ensure the page uses existing components, color palettes, and fonts.
- Follow the UI/UX best practices of the project.
- Take inspiration from other pages for layout and responsiveness.
**Acceptance Criteria:**
- Visual style matches the rest of the project.
- No unnecessary new components/styles are introduced.
**Status:** DONE
**Feedback:** Successfully using Bootstrap components consistent with the rest of the application. Visual design matches existing patterns.

---

## 11. Final Review and Testing
**Description:**
- Test the Kanban board for all acceptance criteria.
- Check for edge cases, error handling, and overall UX.
- Review code for clarity, maintainability, and adherence to project standards.
**Acceptance Criteria:**
- All features work as expected.
- No major bugs or UX issues.
- Code is clean and well-documented.
**Status:** DONE
**Feedback:** All features are working as expected. Drag and drop functionality is smooth. API integration is complete with proper error handling. Edge cases like failed API requests are handled gracefully with visual feedback to the user.

---

## 12. Debugging and Troubleshooting
**Description:**
- Identify and fix any issues with API integration and data rendering.
- Handle edge cases and error conditions gracefully.
- Implement proper error reporting and debugging tools.
**Acceptance Criteria:**
- Application handles API errors gracefully.
- Debug information is available during development.
- Edge cases (empty stages, missing data) are handled correctly.
**Status:** DONE
**Feedback:** Successfully resolved complex data structure issues with the API response. Implemented proper error handling for API calls with visual feedback through toast notifications and persistent error alerts. Added logging for debugging purposes. 