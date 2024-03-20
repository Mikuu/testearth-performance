import booksvcClient from "../clients/booksvc.client.js";
import randomUtils from "../utils/random.utils.js";

export function deleteBookScenario() {
    const bid = randomUtils.randomBID();
    const res = booksvcClient.deleteBook(bid);
}
