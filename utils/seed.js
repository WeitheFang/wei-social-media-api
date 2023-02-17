const connection = require("../config/connection");
const { User, Thought } = require("../models");
const { getRandomName } = require("./data");

connection.on("error", (err) => err);

connection.on("open", async () => {
  console.log("Connected to MongoDB");

  await User.deleteMany({});
  await Thought.deleteMany({});
  console.log("Deleted all users and thoughts");

  const users = [];

  for (let i = 0; i < 20; i++) {
    const fullName = getRandomName();
    const first = fullName.split(" ")[0];
    const last = fullName.split(" ")[1];
    const email = `${first.toLowerCase()}.${last.toLowerCase()}@example.com`;

    users.push({
      username: fullName,
      email: email,
    });
  }

  await User.collection.insertMany(users);
  console.log("Inserted 20 users");

  const thoughts = [];

  for (let i = 0; i < 100; i++) {
    const thought = {
      thoughtText: `This is thought ${i + 1}`,
      username: users[Math.floor(Math.random() * users.length)].username,
    };

    thoughts.push(thought);
  }

  await Thought.collection.insertMany(thoughts);
  console.log("Inserted 100 thoughts");

  const reactions = [];

  for (let i = 0; i < 100; i++) {
    const reaction = {
      reactionBody: `This is reaction ${i + 1}`,
      username: users[Math.floor(Math.random() * users.length)].username,
    };

    reactions.push(reaction);
  }

  for (let i = 0; i < 100; i++) {
    const thought = await Thought.findOneAndUpdate(
      { _id: thoughts[i]._id },
      { $push: { reactions: reactions[i] } },
      { new: true }
    );
  }

  console.log("Inserted 100 reactions");

  console.log("Done seeding database");

  connection.close();

  process.exit(0);
});
