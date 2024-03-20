import booksvcClient from "../clients/booksvc.client.js";
import randomUtils from "../utils/random.utils.js";

export function createBookScenario() {
    const payload = JSON.stringify({
        title: randomUtils.randomTitle(),
        author: randomUtils.randomAuthor(),
        price: randomUtils.randomPrice(),
        publishedAt: randomUtils.currentDate()
    });
    const res = booksvcClient.createBook(payload);
}
