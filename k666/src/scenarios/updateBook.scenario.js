import booksvcClient from "../clients/booksvc.client.js";
import randomUtils from "../utils/random.utils.js";
import { checking } from "../utils/check.utils.js";

export function updateBookScenario() {
    const bid = randomUtils.randomBID();
    const payload = JSON.stringify({
        title: randomUtils.randomTitle(),
        author: randomUtils.randomAuthor(),
        price: randomUtils.randomPrice(),
        publishedAt: randomUtils.currentDate()
    });

    const res = booksvcClient.updateBook(bid, payload);

    checking.requestSucceedCheck(res, "update book");
}
