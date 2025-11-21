# CloudTech Platform - Frontend

This is the frontend for the CloudTech Platform, a modern and responsive web application for managing companies, members, and invitations. Built with Next.js, TypeScript, and Tailwind CSS, it provides a seamless user experience with robust authentication and role-based access control.

## Features

-   **Authentication:**
    -   Secure login and signup flows.
    -   Session management using JWT and cookies.
    -   Protected routes middleware.

-   **Dashboard:**
    -   View a paginated list of companies you are a member of.
    -   Create new companies with a name and optional logo URL.
    -   Visual indicators for Admin roles within companies.

-   **Company Management:**
    -   **Detailed View:** Access company information and a list of all members.
    -   **Role-Based Access Control (RBAC):**
        -   **Owners:** Can manage all members (change roles, remove users) and invite new members.
        -   **Admins:** Can invite new members and manage regular Members (but cannot modify other Admins or Owners).
        -   **Members:** Have read-only access to the member list.
    -   **Member Management:** Promote/demote members and remove users from the company.
    -   **Invitations:** Invite users via email (defaults to Member role).

-   **User Experience:**
    -   **Theme Switcher:** Toggle between Light and Dark modes.
    -   **Responsive Design:** Fully responsive layout optimized for desktop, tablet, and mobile.
    -   **Interactive UI:** Loading states, error handling, and modals for smoother interactions.

## Technology Stack

-   **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **State Management:** React Context API (AuthContext, ThemeContext)
-   **HTTP Client:** [Axios](https://axios-http.com/)
-   **Testing:** [Playwright](https://playwright.dev/) (for E2E and verification)
-   **Icons:** Heroicons (via SVG)

## Project Structure

```
.
├── public/             # Static assets
├── src/
│   ├── app/            # Next.js App Router pages
│   │   ├── company/    # Company details and management
│   │   ├── dashboard/  # User dashboard
│   │   ├── login/      # Authentication pages
│   │   ├── signup/     # Registration pages
│   │   └── ...
│   ├── components/     # Reusable UI components (Header, Modals, Spinner, etc.)
│   ├── context/        # Global state providers (Auth, Theme)
│   ├── services/       # API integration layer
│   └── middleware.ts   # Route protection middleware
├── verify_permissions.js # Playwright script for verifying permission logic
└── ...
```

## Getting Started

### Prerequisites

-   Node.js (v18 or higher)
-   npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd cloudtech-platform-frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Setup:**
    Create a `.env.local` file in the root directory:
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:4000
    ```
    *Note: Adjust the URL to match your backend server address.*

### Running the Application

**Development Mode:**
```bash
npm run dev
```
The app will be available at `http://localhost:7000`.

**Production Build:**
```bash
npm run build
npm start
```

## Verification & Testing

The project includes a Playwright script to verify the complex role-based permissions logic (Owner vs. Admin vs. Member).

To run the permission verification script:
1. Ensure the development server is running (`npm run dev` or `npm start`).
2. Run the verification script:
   ```bash
   node verify_permissions.js
   ```

## Deployment

This application is designed to be deployed on platforms like Vercel or any containerized environment (Docker). ensure the `NEXT_PUBLIC_API_URL` environment variable is set correctly in your deployment environment.
