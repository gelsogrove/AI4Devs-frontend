# Prompt for the implementation of the "position" Kanban page

## Role
You are an expert in:
- React
- TypeScript
- TailwindCSS
- UX/UI Design
- REST API integration

## Overview
Your mission in this exercise is to create the "position" interface, a page where you can view and manage the different candidates for a specific position.

It has been decided that the interface should be Kanban-style, displaying candidates as cards in different columns representing the stages of the hiring process, and allowing you to update the stage of a candidate simply by dragging their card. Here is an example of such an interface.
The implementation must be consistent with the project structure and follow the naming conventions already used in the codebase.

## UI Details & Layout

### Design Requirements
- The position title must be displayed at the top for context.
- Add a back arrow to the left of the title to return to the positions list.
- There must be as many columns as there are stages in the process.
- Each candidate's card must be placed in the corresponding stage column and display their full name and average score.
- If possible, the board should be mobile-friendly (columns stacked vertically, occupying the full width).

### Notes
- Assume the positions page already exists.
- Assume the global page structure (including top menu and footer) already exists. You are only building the internal content of the page.

### Visual Style
- The page must be consistent with the current design of the 'frontend' folder.
- Reuse existing components, color palettes, and fonts.
- Follow the UI/UX best practices adopted in the rest of the project.
- If possible, take inspiration from other already implemented pages for layout and responsiveness.
- If you have doubts about a specific component, check the code of other pages or ask for clarification.

## Reference APIs

### GET /positions/:id/interviewFlow
This endpoint returns information about the hiring process for a specific position:
- `positionName`: Title of the position
- `interviewSteps`: id and name of the different stages in the process

Example response:
```json
{
  "positionName": "Senior backend engineer",
  "interviewFlow": {
    "id": 1,
    "description": "Standard development interview process",
    "interviewSteps": [
      {
        "id": 1,
        "interviewFlowId": 1,
        "interviewTypeId": 1,
        "name": "Initial Screening",
        "orderIndex": 1
      },
      {
        "id": 2,
        "interviewFlowId": 1,
        "interviewTypeId": 2,
        "name": "Technical Interview",
        "orderIndex": 2
      },
      {
        "id": 3,
        "interviewFlowId": 1,
        "interviewTypeId": 3,
        "name": "Manager Interview",
        "orderIndex": 3
      }
    ]
  }
}
```

### GET /positions/:id/candidates
This endpoint returns all candidates in process for a specific position (all applications for a given positionID). It provides the following information:
- `fullName`: Candidate's full name
- `currentInterviewStep`: The stage of the process the candidate is currently in
- `averageScore`: The candidate's average score

Example response:
```json
[
  {
    "fullName": "Jane Smith",
    "currentInterviewStep": "Technical Interview",
    "averageScore": 4
  },
  {
    "fullName": "Carlos García",
    "currentInterviewStep": "Initial Screening",
    "averageScore": 0
  },
  {
    "fullName": "John Doe",
    "currentInterviewStep": "Manager Interview",
    "averageScore": 5
  }
]
```

### PUT /candidates/:id/stage
This endpoint updates the stage of a moved candidate. It allows you to change the current stage of the interview process for a specific candidate by providing the "new_interview_step" parameter and the interview_step_id corresponding to the column where the candidate is now located.

Example request:
```json
{
  "applicationId": "1",
  "currentInterviewStep": "3"
}
```

Example response:
```json
{
  "message": "Candidate stage updated successfully",
  "data": {
    "id": 1,
    "positionId": 1,
    "candidateId": 1,
    "applicationDate": "2024-06-04T13:34:58.304Z",
    "currentInterviewStep": 3,
    "notes": null,
    "interviews": []
  }
}
```

## Steps to Follow
1. **File structure planning**
   - Create a new page or component for the Kanban board, e.g., `src/pages/PositionKanban.tsx` or `src/features/positions/PositionKanban.tsx`.
   - Link it to the "Ver Proceso" button, passing the id in the URL.
   - Example: `/positions/1` (where 1 is the position id)
2. **Choose Drag & Drop library**
   - Install the `react-beautiful-dnd` library
3. **Basic page structure**
   - Header with the position title and a back arrow.
   - Dynamic columns for each stage of the selection process.
   - Card for each candidate, placed in the column of their current stage.
4. **API integration**
   - Fetch the stages and position title with `GET /positions/:id/interviewFlow`.
   - Fetch the candidates with `GET /positions/:id/candidates`.
   - Update the candidate's stage with `PUT /candidates/:id/stage` when moved between columns.
5. **Responsive Design**
   - Adapt the board for mobile view (columns stacked vertically).

---

## PUT /candidates/:id/stage details
- When you update a candidate's stage, send a PUT request to `/candidates/:id/stage` with the following payload:
  ```json
  {
    "applicationId": "<application ID>",
    "currentInterviewStep": "<new stage ID>"
  }
  ```
- The new stage ID corresponds to the column where the card is dropped.
- Always use the correct applicationId for the selected candidate.

---


Do you have any questions or doubts? Let's discuss them before starting to create the todo list


## TODO LIST
- If everything is clear, create a `TODO.md` file so we can proceed step by step with the implementation. Each todo must have a title, a clear and detailed description with acceptance criteria, a number, and a status that we will update as we progress.



## Note:
- Do not implement anything until I tell you to.
- Keep solutions simple and avoid introducing unnecessary complexity
- Reference the README.md file for patterns and technology used in the project
- Always check the current prompt  and the todo list  before starting a new task.
- Don't start the next task if you don't have my feedback
- When the task is completed and you have my feedback please update the `TODO.md` list
- After each task is completed, ask a `feedback` and add into the `TODO.md` 



