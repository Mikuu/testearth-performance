import booksvcClient from "../clients/booksvc.client.js";

export function deleteBookScenario() {
    const res = booksvcClient.deleteBook();
}
