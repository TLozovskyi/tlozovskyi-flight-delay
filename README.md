# Flight Delay Hackathon

This repository contains a Copilot hackathon project to help you build an application that predicts the chance of a flight being delayed by more than 15 minutes, based on the day of the week and arrival airport.

## 🎯 Goal

Build an application that allows users to select the day of the week and arrival airport to see the chance their flight will be delayed by more than 15 minutes.

## ✍️ Programming Languages

- TypeScript / JavaScript
- Python

## 💻 IDE

- Visual Studio Code (recommended)
- Visual Studio
- JetBrains IDEs

## 🛠️ Setup

After cloning the repository, run the setup script:

```bash
bash setup.sh
```

This will make `detect-shell.sh` executable.

If you see `npm: command not found`, install Node.js and npm:

```bash
sudo apt update
sudo apt install nodejs npm
```

## 🚀 Usage

### Backend

1. Navigate to the backend directory and install dependencies:
    ```bash
    cd tlozovskyi-flight-delay/server
    pip3 install -r requirements.txt
    ```
2. Start the backend server (Flask example):
    ```bash
    python3 app.py
    ```

3. **To start a Jupyter Notebook locally:**
    ```bash
    cd tlozovskyi-flight-delay/server
    pip3 install notebook  # if not already installed
    jupyter notebook
    ```
    - Open the provided URL in your browser to access the Jupyter interface.

4. **To start a FastAPI server locally:**
    ```bash
    cd tlozovskyi-flight-delay/server
    pip3 install fastapi uvicorn  # if not already installed
    uvicorn main:app --reload
    ```
    - Replace `main:app` with the correct Python file and app variable if different.
    - Open [http://localhost:8000/docs](http://localhost:8000/docs) for the interactive API docs.

### Frontend (React or SvelteKit)

#### React

1. Navigate to the frontend directory and install dependencies:
    ```bash
    cd tlozovskyi-flight-delay/frontend
    npm install
    ```
2. Start the frontend development server:
    ```bash
    npm start
    ```
3. Open your browser to [http://localhost:3000](http://localhost:3000).

- The main React entry point is `/frontend/src/index.jsx`.
- The main app component is `/frontend/src/App.jsx`.
- The flight delay UI logic is in `/frontend/src/FlightDelayApp.jsx`.

#### SvelteKit

1. Navigate to the SvelteKit client directory and install dependencies:
    ```bash
    cd tlozovskyi-flight-delay/client
    npm install
    ```
2. Start the SvelteKit development server:
    ```bash
    npm run dev
    ```
3. Open your browser to the port shown in the terminal.

## 📝 Troubleshooting

- If you encounter CORS issues, configure your backend to allow requests from your frontend.
- Ensure all dependencies are installed and the correct Python/Node.js versions are used.
- If you have issues with the dev container, try rebuilding it from VS Code.

## 🤝 Contributing

Contributions are warmly welcomed! ✨  
See [CONTRIBUTING.md](https://github.com/ps-copilot-sandbox/.github/blob/main/.github/CONTRIBUTING.md) for details.

---