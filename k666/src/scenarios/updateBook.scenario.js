import booksvcClient from "../clients/booksvc.client.js";
import randomUtils from "../utils/random.utils.js";
import { checking } from "../utils/check.utils.js";
import { responseObj } from "../utils/common.utils.js";

// single-point test
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

// scenario-based test
export function updateNewCreatedBookScenario() {
    let payload = JSON.stringify({
        title: randomUtils.randomTitle(),
        author: randomUtils.randomAuthor(),
        price: randomUtils.randomPrice(),
        publishedAt: randomUtils.currentDate()
    });

    let res = booksvcClient.createBook(payload);
    checking.requestSucceedCheck(res, "update book");

    const responseObject = responseObj(res);

    payload = JSON.stringify({
        title: randomUtils.randomTitle(),
        author: randomUtils.randomAuthor(),
        price: randomUtils.randomPrice(),
        publishedAt: randomUtils.currentDate()
    });

    res = booksvcClient.updateBook(responseObject.bid, payload)
    checking.requestSucceedCheck(res, "update new created book");
}
