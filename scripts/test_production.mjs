const PROD_URL = "https://care-nest-neon.vercel.app";

async function runTests() {
  console.log("=== TESTING PRODUCTION DEPLOYMENT: " + PROD_URL + " ===\n");

  const homeRes = await fetch(PROD_URL);
  const homeHtml = await homeRes.text();
  console.log("[Test 1 - Home Page] Status:", homeRes.status, "| Has root div:", homeHtml.includes('id="root"'));

  const jsMatch = homeHtml.match(/\/assets\/[a-zA-Z0-9_.-]+\.js/);
  if (jsMatch) {
    const jsRes = await fetch(PROD_URL + jsMatch[0]);
    console.log("[Test 1b - Static JS Asset] Path:", jsMatch[0], "| Status:", jsRes.status, "| Content-Type:", jsRes.headers.get("content-type"));
  }

  const healthRes = await fetch(PROD_URL + "/api/health");
  const healthData = await healthRes.json();
  console.log("[Test 2 - Health Check] Status:", healthRes.status, "| Message:", healthData.message);

  const propRes = await fetch(PROD_URL + "/api/properties");
  const propData = await propRes.json();
  console.log("[Test 3 - Properties] Status:", propRes.status, "| Message:", propData.message);

  const loginRes = await fetch(PROD_URL + "/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "test@example.com", password: "wrong" })
  });
  const loginData = await loginRes.json();
  console.log("[Test 4 - Login] Status:", loginRes.status, "| Message:", loginData.message);
}
runTests().catch(console.error);
