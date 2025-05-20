## Frontend Development Steps

1. **Scaffold the Frontend App**
   - Use React (recommended) or another framework.
   - For React:  
     ```sh
     npx create-react-app frontend
     cd frontend
     ```

2. **Build the UI**
   - Fetch the list of airports from `/airports` and display in a dropdown.
   - Display days of the week in a dropdown.
   - Add a button to submit the selection.

3. **Connect to the API**
   - On submit, call `/predict?day_of_week=X&airport_id=Y`.
   - Show the delay chance result to the user.

4. **Handle CORS (if needed)**
   - If you get CORS errors, update your FastAPI backend to allow requests from your frontend.

5. **Polish the UI**
   - Add loading states, error handling, and any extra features or style you want.