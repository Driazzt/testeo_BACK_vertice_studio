const crypto = require("crypto");

const secretPassword = "VerticeStudioPassword1";
const secretPasswordRefreshed = "VerticeStudioPasswordRefreshed";

const hash = crypto
.createHmac ("sha256", secretPassword)
.update(secretPasswordRefreshed)
.digest("hex");

console.log(hash)

