# riskwise-ai

A risk assessment application with ML-powered defect prediction.

## Setup Instructions

### Prerequisites
- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Run the backend server:
   ```bash
   uvicorn app.main:app --reload
   ```

The backend will be available at `http://localhost:8000`.

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`.

### Environment Variables

The frontend uses the following environment variable:
- `VITE_API_BASE_URL`: Backend API URL (defaults to `http://localhost:8000`)

To set a custom backend URL, create a `.env` file in the frontend directory:
```
VITE_API_BASE_URL=http://your-backend-url:8000
```

### Database

The application uses SQLite database (`riskwise.db`) which is created automatically when the backend runs for the first time.

### ML Model

The ML model files are located in the `ml/` directory:
- `rf_defect_model.joblib`: Trained random forest model
- `features.json`: Feature configuration
- `riskWise.ipynb`: Jupyter notebook with model training code

## Running the Application

1. Start the backend server (as described above)
2. Start the frontend server (as described above)
3. Open your browser and navigate to `http://localhost:5173`

## Contributing

1. Clone the repository
2. Follow the setup instructions above
3. Make your changes
4. Test locally
5. Commit and push your changes