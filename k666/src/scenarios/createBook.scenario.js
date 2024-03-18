import booksvcClient from "../clients/booksvc.client.js";

export function createBookScenario() {
    const res = booksvcClient.createBook();
}
