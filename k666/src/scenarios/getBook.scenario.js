import booksvcClient from "../clients/booksvc.client.js";
import { checking } from "../utils/check.utils.js";
import randomUtils from "../utils/random.utils.js";

export function getBookScenario() {
    const bid = randomUtils.randomBID();
    const res = booksvcClient.getBook(bid);

    checking.requestSucceedCheck(res, "get book");
}
