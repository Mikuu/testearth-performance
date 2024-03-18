import booksvcClient from "../clients/booksvc.client.js";

export function getBookScenario() {
    const res = booksvcClient.getBook();
}
