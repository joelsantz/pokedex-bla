### Additional Task
Imagine you’re tasked with generating a Table component for a simple task management
system using your preferred language. The system should support the following functionality:
- Create, read, update, and delete tasks (CRUD)
- Each task has a title, description, status, and due_date
- Tasks are associated with a user (assume basic User model exists)

### Prompt used
Generate a minimal but production-grade Task CRUD
for a Next.js 14 app (TypeScript) with:

- API routes under /app/api/tasks using REST (GET/POST/PATCH/DELETE).
- Prisma ORM with SQLite for local dev: Task { id, title, description, status: 'todo'|'in_progress'|'done',
  dueDate (Date), userId (string), createdAt, updatedAt } and a basic User model.
- Zod validation on inputs. Only allow the authenticated user's tasks (assume we have getUser()
  that returns { id } or throws).
- Frontend: a Table component with pagination, sorting by dueDate, inline status update,
  modal for create/update, and optimistic updates using TanStack React Query.
- Accessibility first (table semantics, labels), error handling, and empty states.
- Keep files concise. Show representative code for schema, routes, and the table component.
- Add brief notes on edge cases and performance (server-side pagination).

### Output
        // prisma/schema.prisma
        datasource db {
        provider = "sqlite"
        url      = "file:./dev.db"
        }

        generator client {
        provider = "prisma-client-js"
        }

        model User {
        id     String  @id @default(cuid())
        email  String  @unique
        tasks  Task[]
        }

        model Task {
        id          String   @id @default(cuid())
        title       String
        description String?  @db.Text
        status      Status   @default(TODO)
        dueDate     DateTime
        userId      String
        user        User     @relation(fields: [userId], references: [id])
        createdAt   DateTime @default(now())
        updatedAt   DateTime @updatedAt

        @@index([userId, dueDate])
        }

        enum Status {
        TODO
        IN_PROGRESS
        DONE
        }




        //app/api/tasks/route.ts
        import { NextRequest, NextResponse } from "next/server";
        import { prisma } from "@/lib/prisma";
        import { z } from "zod";

        const TaskSchema = z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).default("TODO"),
        dueDate: z.coerce.date(),
        });

        export async function GET(req: NextRequest) {
        const { searchParams } = new URL(req.url);
        const page = Number(searchParams.get("page") ?? 1);
        const size = Math.min(Number(searchParams.get("size") ?? 10), 50);

        const tasks = await prisma.task.findMany({
            skip: (page - 1) * size,
            take: size,
            orderBy: { dueDate: "asc" },
        });

        const total = await prisma.task.count();
        return NextResponse.json({ tasks, total });
        }

        export async function POST(req: NextRequest) {
        const body = await req.json();
        const parsed = TaskSchema.safeParse(body);

        if (!parsed.success)
            return NextResponse.json(parsed.error.flatten(), { status: 400 });

        const newTask = await prisma.task.create({ data: parsed.data });
        return NextResponse.json(newTask, { status: 201 });
        }


        //app/tasks/TaskTable.tsx
        "use client";
        import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
        import { useState } from "react";

        async function fetchTasks(page: number) {
        const res = await fetch(`/api/tasks?page=${page}`);
        return res.json();
        }

        export default function TaskTable() {
        const [page, setPage] = useState(1);
        const qc = useQueryClient();
        const { data } = useQuery({
            queryKey: ["tasks", page],
            queryFn: () => fetchTasks(page),
        });

        const deleteMutation = useMutation({
            mutationFn: (id: string) =>
            fetch(`/api/tasks/${id}`, { method: "DELETE" }),
            onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
        });

        return (
            <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-xl font-bold mb-4">Tasks</h1>
            <table className="min-w-full border">
                <thead>
                <tr>
                    <th className="p-2 border">Title</th>
                    <th className="p-2 border">Status</th>
                    <th className="p-2 border">Due Date</th>
                    <th className="p-2 border">Actions</th>
                </tr>
                </thead>
                <tbody>
                {data?.tasks.map((t: any) => (
                    <tr key={t.id}>
                    <td className="p-2 border">{t.title}</td>
                    <td className="p-2 border">{t.status}</td>
                    <td className="p-2 border">
                        {new Date(t.dueDate).toLocaleDateString()}
                    </td>
                    <td className="p-2 border">
                        <button
                        onClick={() => deleteMutation.mutate(t.id)}
                        className="text-red-600 underline"
                        >
                        Delete
                        </button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div className="mt-4 flex justify-between">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</button>
                <button onClick={() => setPage((p) => p + 1)}>Next</button>
            </div>
            </div>
        );
        }

### How I Validated the AI’s Suggestions
Compilation and types:
I ran TypeScript locally and adjusted form types and date parsing.
The server uses z.coerce.date() while the client sends ISO strings.

Routes and contracts:
I tested the endpoints manually using curl and verified the frontend integration with React Query:

- GET /api/tasks?page=1&pageSize=10&sort=dueDate:asc
- POST /api/tasks with both valid and invalid payloads (confirmed 400 errors).
- PATCH /api/tasks/:id restricted by userId.
- DELETE /api/tasks/:id returning 404 when the task doesn’t exist or belongs to another user.

Accessibility:
I checked semantic roles, table structure, labels, and dialog behavior (keyboard navigation and focus management).

### Corrections and Improvements
- Strong server-side validation using Zod (the AI initially validated only on the client).
- Ownership control: added where: { id, userId } before update and delete to prevent cross-user access.
- Server-side pagination and sorting with skip, take, and orderBy to avoid fetching all records into memory.
- Optimistic updates for status changes to ensure a snappy UX, with rollback on failure.
- Request limits: capped pageSize at 50 and validated sort fields to prevent injection attacks.


### Edge Cases, Authentication, and Validations
- Authentication: `getUser()` is currently a stub; in a real setup, I’d use NextAuth with JWT or session tokens.
All operations require a `userId` check.
- Edge cases: invalid dates, unauthorized task, “empty state” message, possible race conditions
- Security: sanitized sorting parameters (whitelisted fields), avoided exposing user or email data in responses.

### Performance and Idiomatic Quality
- Performance:
    - Server-side pagination and sorting.
    - Fine-grained React Query caching with staleTime and invalidateQueries.
    - UI updates for instant feedback.
    - Index on (userId, dueDate) to optimize lookups.
    - For larger datasets: consider virtualization (@tanstack/react-virtual) and keyset pagination.

### Idiomatic React/Next:
- App Router with REST routes under app/api/*.
- React Query for fetching, caching, and mutations.
- Small, focused components with local state and full accessibility (labels, captions, dialog).
- Maintainability
    - Clear separation in lib/* (Prisma, auth, Zod).
    - Explicit types and enums for status.

