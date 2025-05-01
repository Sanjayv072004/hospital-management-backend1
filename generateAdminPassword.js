const bcrypt = require("bcryptjs");

const generateHashedPassword = async () => {
  const hashedPassword = await bcrypt.hash("Admin@1234!Secure", 10);
  console.log("✅ Hashed Admin Password:", hashedPassword);
};

generateHashedPassword();
