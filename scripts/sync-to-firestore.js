// Sync local JSON data to Firebase Firestore
// Run: node scripts/sync-to-firestore.js

const fs = require("fs");
const path = require("path");

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || "dyfi-dk";
const API_KEY = process.env.FIREBASE_API_KEY || "AIzaSyDKhgEC_qyCV0-8By1EdDfkjV0E8KPAo-Q";
const FIRESTORE_BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

const withApiKey = (url) => {
  if (!API_KEY) return url;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}key=${API_KEY}`;
};

function toFirestoreValue(val) {
  if (val === null || val === undefined) return { nullValue: null };
  if (typeof val === "boolean") return { booleanValue: val };
  if (typeof val === "number") {
    return Number.isInteger(val) ? { integerValue: String(val) } : { doubleValue: val };
  }
  if (Array.isArray(val)) {
    return { arrayValue: { values: val.map(toFirestoreValue) } };
  }
  if (typeof val === "object") {
    return { mapValue: { fields: toFirestoreFields(val) } };
  }
  return { stringValue: String(val) };
}

function toFirestoreFields(obj) {
  const fields = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      fields[key] = toFirestoreValue(value);
    }
  }
  return fields;
}

const ENTITIES = [
  "campaigns",
  "news",
  "committee",
  "gallery",
  "activities",
  "announcements",
  "donors",
  "members",
];

async function syncAll() {
  console.log(`\nStarting sync to Firebase Firestore (Project: ${PROJECT_ID})...\n`);

  for (const entity of ENTITIES) {
    const jsonPath = path.join(__dirname, "..", "public", `${entity}.json`);
    if (!fs.existsSync(jsonPath)) {
      console.log(`[!] File not found: public/${entity}.json, skipping.`);
      continue;
    }

    const raw = fs.readFileSync(jsonPath, "utf8");
    let items = [];
    try {
      items = JSON.parse(raw);
    } catch (e) {
      console.error(`Error parsing ${entity}.json:`, e.message);
      continue;
    }

    console.log(`Syncing ${entity}: ${items.length} items...`);

    let successCount = 0;
    let failCount = 0;

    for (const item of items) {
      const id = String(item.id || Date.now());
      const fields = toFirestoreFields(item);
      const url = withApiKey(`${FIRESTORE_BASE_URL}/${entity}/${encodeURIComponent(id)}`);

      try {
        const res = await fetch(url, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fields }),
        });

        if (res.ok) {
          successCount++;
        } else {
          failCount++;
          if (failCount === 1) {
            const err = await res.text();
            console.error(`  [x] Error saving to ${entity}/${id}:`, err);
          }
        }
      } catch (err) {
        failCount++;
        console.error(`  [x] Network error for ${entity}/${id}:`, err.message);
      }
    }

    console.log(`  -> ${entity}: ${successCount} uploaded successfully, ${failCount} failed.\n`);
  }

  console.log("All entities synced successfully to Firebase Firestore!\n");
}

syncAll();
