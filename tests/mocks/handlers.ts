import { http, HttpResponse } from 'msw';
import { apiBaseUrl } from '../../src/config';

export const handlers = [
	http.post(`${apiBaseUrl}/users/new`, async ({ request }) => {
		// Read the intercepted request body as JSON
		const newUser = await request.json();

		// Respond with created resource
		return HttpResponse.json(newUser, { status: 201 });
	}),
];
