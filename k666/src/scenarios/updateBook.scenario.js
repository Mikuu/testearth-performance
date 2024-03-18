import booksvcClient from "../clients/booksvc.client.js";

export function updateBookScenario() {
    const res = booksvcClient.updateBook();
}
