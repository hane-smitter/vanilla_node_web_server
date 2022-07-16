import chalk from "chalk";
import { faker } from "@faker-js/faker";

import Customer from "../../src/models/mongodbModels/Customer.js";
import Phone from "../../src/models/mongodbModels/Phone.js";
import Order from "../../src/models/mongodbModels/Order.js";

const seedDatabase = async () => {
  await createCustomers(20);
  await createPhones(15);
  await createOrders(10);
  console.log(chalk.inverse.bgBlack("DONE!"));
};

function createRandomUser() {
  const depict = Math.trunc(Math.random() * 2);
  const gender = depict === 0 ? "male" : "female";

  const includeAddress2 = Math.trunc(Math.random() * 2);
  return {
    firstname: faker.name.firstName(gender),
    surname: faker.name.lastName(gender),
    get email() {
      return faker.internet.email(this.firstname, this.surname);
    },
    mobile: faker.phone.number(),
    title: faker.name.prefix(gender),
    city: faker.address.city(),
    town: faker.address.county(),
    address1: faker.address.secondaryAddress(),
    ...(includeAddress2 && { address2: faker.address.streetAddress(true) }),
  };
}
function createRandomPhone() {
  return {
    manufacturer: faker.company.companyName(),
    model: faker.company.companySuffix(),
    price: faker.commerce.price(200, 20000, 0),
  };
}

const createCustomers = async (length = 5) => {
  const customers = Array.from({ length }, () => createRandomUser());
  try {
    await Customer.insertMany(customers);
    console.log(chalk.blueBright("Sample customers added to database"));
    return;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};
const createPhones = async (length = 5) => {
  const phones = Array.from({ length }, () => createRandomPhone());
  try {
    await Phone.insertMany(phones);
    console.log(chalk.yellowBright("Sample phones added to database"));
    return;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};
const createOrders = async (length = 5) => {
  const customerIds = await Customer.find(
    {},
    {
      _id: 1,
      firstname: 0,
      surname: 0,
      email: 0,
      address1: 0,
      address2: 0,
      town: 0,
      city: 0,
      title: 0,
      mobile: 0,
    }
  ).toArray();
  const phoneIds = await Phone.find(
    {},
    {
      _id: 1,
      manufacturer: 0,
      model: 0,
      price: 0,
    }
  ).toArray();
  const orders = [];
  for (let i = 0; i < length; i++) {
    orders.push({
      customer: customerIds[Math.trunc(Math.random() * customerIds.length)],
      phone: phoneIds[Math.trunc(Math.random() * phoneIds.length)],
    });
  }

  await Order.insertMany(orders);
  console.log(
    chalk.rgb(255, 131, 0)("Sample customer Orders added to database")
  );
};

export default seedDatabase;
