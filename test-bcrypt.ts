import * as bcrypt from "bcrypt";

async function testBcrypt() {
  try {
    console.log("Testing bcrypt hash...");
    const hash = await bcrypt.hash("testpassword", 10);
    console.log("✅ bcrypt hashing successful:", hash);
  } catch (error) {
    console.error("❌ bcrypt hashing failed:", error);
  }
}

testBcrypt();
