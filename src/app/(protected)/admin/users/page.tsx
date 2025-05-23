// app/(protected)/admin/users/page.tsx

import { UsersTable } from "./component";

export default function AdminUsersPage() {
    // Example dummy user data
    const users = [
        { id: 1, name: "Alice Johnson", email: "alice@example.com" },
        { id: 2, name: "Bob Smith", email: "bob@example.com" },
        { id: 3, name: "Charlie Brown", email: "charlie@example.com" },
    ];

    return (
        <UsersTable />
    );
}
