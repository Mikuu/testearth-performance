import booksvcClient from "../clients/booksvc.client.js";
import randomUtils from "../utils/random.utils.js";
import { checking } from "../utils/check.utils.js";

export function deleteBookScenario() {
    const bid = randomUtils.randomBID();
    const res = booksvcClient.deleteBook(bid);

    checking.requestSucceedCheck(res, "delete book");
}
