# CloudTech Platform - Frontend

This is the frontend for the CloudTech Platform, a web application for managing companies, members, and invitations. It is built with Next.js, TypeScript, and Tailwind CSS.

## Features

-   **Authentication:** Secure login and signup functionality.
-   **Dashboard:** View and manage a paginated list of companies.
-   **Company Details:** View company information, including a list of members.
-   **Invite Users:** Invite new users to a company via email.
-   **Accept Invites:** A dedicated page for users to accept company invitations.
-   **Protected Routes:** Middleware ensures that only authenticated users can access protected pages.
-   **Theme Switcher:** Toggle between light and dark modes.
-   **Responsive Design:** A minimalist and responsive user interface that works on all devices.
-   **Error Handling:** User-friendly error messages for API interactions.
-   **Loading States:** Loading indicators provide feedback during data fetching.

## Technology Stack

-   **Framework:** [Next.js](https://nextjs.org/)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **API Communication:** [Axios](https://axios-http.com/)
-   **State Management:** [React Context](https://reactjs.org/docs/context.html)
-   **Session Persistence:** [js-cookie](https://github.com/js-cookie/js-cookie)

## Project Structure

The project follows a standard Next.js (App Router) structure with a clear separation of concerns:

```
.
├── public/
│   └── assets/         # Static assets like images and logos
├── src/
│   ├── app/            # Application routes and pages
│   ├── components/     # Reusable React components (e.g., Spinner, Modal)
│   ├── context/        # Global state management (e.g., AuthContext, ThemeContext)
│   ├── services/       # API integration layer (e.g., api.ts, companyService.ts)
│   ├── styles/         # Global styles
│   ├── utils/          # Utility functions
│   └── middleware.ts   # Route protection middleware
├── .gitignore
├── next.config.ts
├── package.json
└── tsconfig.json
```

## Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or higher)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Environment Variables

Create a `.env.local` file in the root directory and add the following environment variable:

```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

This variable points to the backend API.

### Running the Development Server

To start the development server, run the following command:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Pages and Routes

-   `/login`: **Login Page** - Allows existing users to sign in.
-   `/signup`: **Signup Page** - Allows new users to create an account.
-   `/dashboard`: **Dashboard** - Displays a list of companies the user is a member of. This is a protected route.
-   `/company/[id]`: **Company Details** - Shows detailed information about a specific company, including its members. This is a protected route.
-   `/accept-invite/[token]`: **Accept Invitation** - A page where a user can accept an invitation to join a company using a unique token.
-   `/404`: **Not Found** - A custom page for handling invalid routes.
