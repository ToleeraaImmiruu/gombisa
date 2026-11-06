const supabase = require("./config/supabase");

async function testConnection() {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .limit(1);
    if (error) {
      console.error("Supabase query failed:", error.message);
      return;
    }
    console.log("Supabase database query successful!");
    console.log("Returned records:", data.length);
  } catch (error) {
    console.error("Connection error:", error.message);
  }
}

testConnection();