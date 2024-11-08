require("./connect");
const { User } = require("../models/schema");
const fs = require("fs");
let number = 600004;
const writeStream = fs.createWriteStream("./6numbers.txt");

for (let i = 0; i < 800; i++) {
  const password = (Math.random() * 1000000).toFixed(0);
  writeStream.write(
    `number: ${number} , password: ${password}\n--------------------\n`
  );
  User.create({
    user_name: number,
    role: "user",
    number: number,
    first_name: number,
    middle_name: number,
    last_name: number,
    phone_number: number,
    gender: "male",
    hash: password,
    state: number,
    city: number,
    center: number,
  });
  number++;
}
