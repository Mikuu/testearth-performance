import booksvcClient from "../clients/booksvc.client.js";
import randomUtils from "../utils/random.utils.js";
import { checking } from "../utils/check.utils.js";
import { responseObj } from "../utils/common.utils.js";

// scenario-based test
export function compositeScenario() {
    let payload = JSON.stringify({
        title: randomUtils.randomTitle(),
        author: randomUtils.randomAuthor(),
        price: randomUtils.randomPrice(),
        publishedAt: randomUtils.currentDate()
    });

    let res = booksvcClient.createBook(payload);
    checking.requestSucceedCheck(res, "create book");

    const responseObject = responseObj(res);

    res = booksvcClient.getBook(responseObject.bid);
    checking.requestSucceedCheck(res, "get book");

    payload = JSON.stringify({
        title: randomUtils.randomTitle(),
        author: randomUtils.randomAuthor(),
        price: randomUtils.randomPrice(),
        publishedAt: randomUtils.currentDate()
    });

    res = booksvcClient.updateBook(responseObject.bid, payload);
    checking.requestSucceedCheck(res, "update book");

    res = booksvcClient.deleteBook(responseObject.bid);
    checking.requestSucceedCheck(res, "delete book");
}
