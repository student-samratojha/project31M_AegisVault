# 🛡️ AegisVault - Advanced Asset Protection

**AegisVault** is a premium, professional-grade digital asset management system and document-safe vault. Designed for elite security and high-fidelity user experience, it allows users to securely store, manage, and audit their personal documents and images.

---

## 💎 Key Features

- **Elite Security Protocol**: Powered by JWT (JSON Web Tokens) and HttpOnly cookies to prevent session hijacking and unauthorized access.
- **Multi-Theme Engine**: Four premium, high-fidelity themes available at the click of a button:
  - 🔵 **Classic Blue**: Professional and clean.
  - ⚪ **Monochrome**: Sleek black & white minimalism.
  - 🔥 **Inferno**: Aggressive red & black high-contrast design.
  - ⚡ **Cyber**: Futuristically vibrant yellow & black interface.
- **Comprehensive Audit Logs**: Every critical action (login, upload, delete, user restoration) is logged with timestamps and user metadata for total transparency.
- **Role-Based Command Center**: 
  - **Admin**: Full system surveillance, user management (suspend/restore), and global asset monitoring.
  - **User**: Personal vault for document storage and profile management.
- **Smart Asset Storage**: Automated file processing via Multer with path normalization and secure renaming.

---

## 🚀 Technology Stack

- **Backend**: Node.js & Express.js
- **Database**: MongoDB (via Mongoose ODM)
- **Frontend**: EJS (Embedded JavaScript) & Tailwind CSS (High-Performance CDN)
- **Authentication**: JWT & Cookie-Parser
- **File Handling**: Multer

---

## 📂 Project Structure

```text
├── src/
│   ├── controllers/    # Business logic (Vault operations & Auth)
│   ├── db/             # Database connection & Mongoose models
│   ├── middleware/     # Auth guards & Multer configuration
│   ├── routes/         # Express routing
│   └── app.js          # Main application setup
├── uploads/            # Secure asset storage (ignored by Git)
├── views/              # Premium EJS templates (Aegis UI)
├── server.js           # Entry point
└── .gitignore          # File exclusion rules
```

---

## 🛡️ License

This project is developed as a professional asset management solution. Proprietary rights apply.

*Built with precision for AegisVault.*
