# Scanify (PaperLense)
**AI-Powered Handwritten Document Digitization & Classification**

## Overview
Scanify is a comprehensive full-stack application that allows users to upload handwritten documents, automatically digitize them using Advanced OCR Models (TrOCR), classify them into custom categories, and manage the downloads and activity of the documents locally.

## How to Run The Project Later

Since the project operates with a decoupled Frontend and Backend structure, you must launch *both* servers when you want to use the application again.

### 1. Start the Backend (API & AI Models)
The backend requires Python and hosts the AI logic, file delivery, and image classification endpoints.

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd d:/Downloads/PaperLense/backend
   ```
2. Activate your virtual environment (if you are using one), and install dependencies (only necessary if it's a new environment):
   ```bash
   pip install -r requirements.txt
   ```
3. Run the FastAPI server:
   ```bash
   python app.py
   ```
   *The backend will boot up at `http://127.0.0.1:8000`.*

### 2. Start the Frontend (User Interface)
The frontend uses Vite, React, and TailwindCSS for the user interface.

1. Open a **second** terminal window and navigate to the frontend directory:
   ```bash
   cd d:/Downloads/PaperLense/frontend/client
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Look at your terminal output for the local host URL (typically `http://localhost:8080` or `5173`) and open it in your browser!

---

## Technical Details Installed

* **Architecture:** Decoupled Client-Server
* **Frontend:** React + Vite + TailwindCSS + Shadcn (Dark Mode Enabled)
* **Backend:** Python + FastAPI + Uvicorn
* **Data Storage:** Fully Serverless/Local. 
  - *Documents & Classes* are stored via Python OS routing inside `/backend/classified_docs`.
  - *Download History & Analytics* are tracked purely on the client's `localStorage` for complete offline-privacy!

## Future Enhancements
If you wish to scale this project up later, consider:
- Implementing an SQLite or PostgreSQL database via SQLAlchemy in the backend.
- Hooking the existing Frontend Auth context logic to a formal JWT authentication system.
- Deploying the frontend to Vercel/Netlify and backend to AWS/Render!
