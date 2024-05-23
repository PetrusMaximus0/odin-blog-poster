
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import "@testing-library/jest-dom"
import {server} from "./mocks/server"

expect.extend(matchers);

beforeAll(() => {
    server.listen({ onUnhandledRequest: "error" });
})

afterAll(() => { server.close() })

beforeEach(() => {
    localStorage.clear();
})

afterEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();

    server.resetHandlers()
    
    localStorage.clear();
    
    cleanup();
})
