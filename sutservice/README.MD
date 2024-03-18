SUT Service
--

#### SUT service for Performance Testing
A simple REST API service created with ExpressJS and Mongodb, launch with docker compose:
```shell
# launch service
docker-compose -f docker-compose.yaml up -d

# shutdown service
docker-compose -f docker-compose.yaml down -v
```

#### API Endpoints

##### 1. create book endpoint `/books/book` with `POST` method, example:
url: `http://localhost:3128/books/book`
payload:
```json
{
  "title": "test title",
  "author": "test author",
  "price": 100,
  "publishedAt": "test published at"
}
```

##### 2. get book endpoint `/books/book` with `GET` method, example
url: `http://localhost:3128/books/book/BIDJFISFESFSDFSEFSFNNOW3352`

##### 3. update book endpoint `/books/book` with `PUT` method, example
url: `http://localhost:3128/books/book/BIDJFISFESFSDFSEFSFNNOW3352`
payload:
```json
{
  "title": "updated test title",
  "author": "test author",
  "price": 135,
  "publishedAt": "test published at"
}
```

##### 4. delete book endpoint `/books/book` with `DELETE` method, example:
url: `http://localhost:3128/books/book/BIDJFISFESFSDFSEFSFNNOW3352`
