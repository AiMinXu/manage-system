const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("mock-api/db.json");
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 5050; // 自行改为你的接口 port

server.use(middlewares);
server.use("/api", router);

server.listen(port);
