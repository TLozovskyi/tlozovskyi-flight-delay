.PHONY: setup backend frontend svelte clean start-all

setup:
	bash setup.sh
	pip3 install -r requirements.txt

backend:
	cd server && pip3 install fastapi uvicorn && uvicorn main:app --reload --host 0.0.0.0 --port 8000

frontend:
	cd frontend && npm install && npm start

svelte:
	cd tlozovskyi-flight-delay/frontend && npm install && npm run dev

mui:
	cd frontend && npm install @mui/material @emotion/react @emotion/styled @mui/icons-material

clean:
	find . -type d -name "__pycache__" -exec rm -rf {} +
	rm -rf tlozovskyi-flight-delay/frontend/node_modules
	rm -rf tlozovskyi-flight-delay/possible-solution/client/node_modules
