import { http, HttpResponse } from "msw";

export const handlers = [
    http.post("http://localhost:3000/users/new", async ({request}) => {
        // Read the intercepted request body as JSON
        const newUser = await request.json();

        // Respond with created resource
        return HttpResponse.json(newUser, { status: 201 });
    }),
];