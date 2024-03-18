import http from "k6/http";
import { SUT } from "../configs/booksvc.config.js";
import randomUtils from "../utils/random.utils.js";

const bookUrl = SUT.host + SUT.basePath + SUT.bookPath;

const commonHeaders = {
    "Content-Type": "application/json",
};

export default {
    createBook: () => {
        const payload = JSON.stringify({
            title: randomUtils.randomTitle(),
            author: randomUtils.randomAuthor(),
            price: randomUtils.randomPrice(),
            publishedAt: randomUtils.currentDate()
        });
        const params = { headers: commonHeaders };
        const res = http.post(bookUrl, payload, params);

        return res;
    },

    getBook: () => {
        const params = { headers: commonHeaders };
        const res = http.get(bookUrl, params);

        return res;
    },

    updateBook: () => {
        const url = bookUrl + "/" + randomUtils.randomBID();
        const payload = JSON.stringify({
            title: randomUtils.randomTitle(),
            author: randomUtils.randomAuthor(),
            price: randomUtils.randomPrice(),
            publishedAt: randomUtils.currentDate()
        });
        const params = { headers: commonHeaders };
        const res = http.put(url, payload, params);

        return res;
    },

    deleteBook: () => {
        const url = bookUrl + "/" + randomUtils.randomBID();
        const params = { headers: commonHeaders };
        const res = http.del(url, "", params);

        return res;
    },
};
