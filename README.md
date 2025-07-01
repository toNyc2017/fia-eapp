# FIA eApp (Fixed Indexed Annuity Application)

A modern, demoable electronic application (eApp) for Fixed Indexed Annuities (FIA) for Ceres Life, built with React, TypeScript, and Vite.

## Project Overview

This project is a multi-step, session-based web application for submitting FIA applications. It features:
- Secure login and session management
- Application launcher for new or existing sessions
- Multi-step form flow (Applicant Info, Product Selection, Owner Info, Joint Owner, etc.)
- Dynamic form fields loaded from JSON
- LocalStorage-based data persistence per session
- User action logging and export (JSON/CSV)
- Modern, responsive UI

## Features
- **Login & Session Management:** Start or resume applications with unique session IDs
- **Step-by-Step Application:** Guided navigation through all required FIA application sections
- **Dynamic Forms:** Owner and Joint Owner info fields are loaded from editable JSON files
- **Product Selection:** Options loaded from JSON for easy updates
- **Logging:** All user actions and form submissions are logged and exportable for analysis
- **Local Development:** Fast dev server with Vite

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm (v9+ recommended)

### Setup
1. **Clone the repo:**
   ```sh
   git clone https://github.com/toNyc2017/fia-eapp.git
   cd fia-eapp
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Start the dev server:**
   ```sh
   npm run dev
   ```
   The app will be available at [http://localhost:3000/](http://localhost:3000/)

### Project Structure
```
fia-eapp/
  ├── src/
  │   ├── api/                # API integration (future)
  │   ├── components/         # Reusable UI components
  │   ├── pages/              # Page-level React components (Login, Launcher, Steps)
  │   ├── utils/              # Utility modules (logger, field definitions, product options)
  │   ├── App.tsx             # Main app and route definitions
  │   └── index.tsx           # Entry point
  ├── public/                 # Static assets
  ├── docs/                   # Project documentation
  ├── package.json            # Project metadata and scripts
  └── README.md               # This file
```

## Usage
- **Login:** Enter a username to start or resume a session
- **Application Launcher:** Start a new application or continue an existing one
- **Form Steps:** Complete each section; data is saved per session in localStorage
- **Logging:** Use the Log Exporter component to download logs for analysis

## Development Workflow
- Edit or add form fields in `src/utils/owner_fields.json` and `src/utils/joint_owner_fields.json`
- Update product options in `src/utils/productOptions.json`
- Add new pages or steps in `src/pages/`
- All navigation is managed in `src/App.tsx`
- Logging utility is in `src/utils/logger.ts`

## Contributing
1. Fork the repo and create your branch: `git checkout -b feature/your-feature`
2. Commit your changes: `git commit -am 'Add new feature'`
3. Push to the branch: `git push origin feature/your-feature`
4. Open a pull request

## License
This project is for demo and internal use only. Contact Ceres Life for licensing details.

---

For more details, see the `/docs` folder for requirements, specifications, and logging system documentation. 