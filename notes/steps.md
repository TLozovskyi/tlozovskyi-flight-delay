# 🛫 Project Context

- **Goal:** Build an application that lets users select a day of the week and an arrival airport to see the chance their flight will be delayed by more than 15 minutes.
- **Dataset:** Provided in `data/flights.csv` (US flights, 2013).
- **Tech:** Use any language/framework you like (Python, JS/TS, etc.).
- **Tools:** GitHub Copilot is your AI pair programmer—use it for code suggestions, explanations, and more.

---

# 🗺️ Step-by-Step Path Forward

## 0. Setup
- [ ] Open the project in VS Code (preferably in a devcontainer or Codespace).
- [ ] Install dependencies as needed (Python: `pip install -r requirements.txt`, JS: `npm install`, etc.).
- [ ] Make sure GitHub Copilot is installed and working.

## 1. Explore the Data
- [ ] Open and examine `data/flights.csv`.
- [ ] Understand the columns: which ones indicate delay, airport, day of week, etc.
- [ ] (Optional) Use a Jupyter notebook or script to do some quick data exploration.

## 2. Create the Model and Supporting Data
- [ ] Follow [1-create-model-data.md](./content/1-create-model-data.md) for guidance.
- [ ] Build a model (e.g., using Python/pandas or scikit-learn) that predicts the probability of a flight delay > 15 minutes, based on day and arrival airport.
- [ ] Export/save the model and any supporting data needed for the API.

## 3. Create the API
- [ ] Follow [2-create-api.md](./content/2-create-api.md).
- [ ] Build an API (e.g., with Flask, FastAPI, Express, etc.) that:
    - Returns a list of airports and their IDs.
    - Accepts a day and airport, and returns the chance of delay from your model.
- [ ] Test the API locally.

## 4. Create the Frontend
- [ ] Follow [3-create-frontend.md](./content/3-create-frontend.md).
- [ ] Build a simple frontend (React, Vue, plain HTML/JS, etc.) that:
    - Lets the user select a day and airport.
    - Calls your API and displays the chance of delay.
- [ ] Test the full flow end-to-end.

## 5. Polish and Document
- [ ] Add comments and documentation.
- [ ] Make sure your code is clean and easy to follow.
- [ ] Update `README.md` with any project-specific setup or usage notes.

---

# 💡 Tips

- Use Copilot for code suggestions, explanations, and to speed up repetitive tasks.
- If you get stuck, check the relevant markdown file for hints or ask Copilot for help.
- You can use any frameworks or libraries you’re comfortable with.

---