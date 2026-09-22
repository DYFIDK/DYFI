// Firebase Firestore REST API Client for Admin Dashboard
// Connects to Google Cloud Firestore using standard REST endpoints without external dependencies.

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || "dyfi-dk";
const API_KEY = process.env.FIREBASE_API_KEY || "AIzaSyDKhgEC_qyCV0-8By1EdDfkjV0E8KPAo-Q";
const FIRESTORE_BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

const withApiKey = (url) => {
  if (!API_KEY) return url;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}key=${API_KEY}`;
};

/**
 * Converts a JavaScript value into Firestore's typed value representation
 */
export function toFirestoreValue(val) {
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

/**
 * Converts a JavaScript object to a Firestore fields map
 */
export function toFirestoreFields(obj) {
  const fields = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      fields[key] = toFirestoreValue(value);
    }
  }
  return fields;
}

/**
 * Converts a Firestore typed value back to a standard JavaScript value
 */
export function fromFirestoreValue(val) {
  if (!val || typeof val !== "object") return null;
  if ("stringValue" in val) return val.stringValue;
  if ("integerValue" in val) {
    const num = parseInt(val.integerValue, 10);
    return isNaN(num) ? val.integerValue : num;
  }
  if ("doubleValue" in val) return parseFloat(val.doubleValue);
  if ("booleanValue" in val) return Boolean(val.booleanValue);
  if ("nullValue" in val) return null;
  if ("arrayValue" in val) {
    return (val.arrayValue?.values || []).map(fromFirestoreValue);
  }
  if ("mapValue" in val) {
    return fromFirestoreFields(val.mapValue?.fields || {});
  }
  return null;
}

/**
 * Converts a Firestore fields map back to a standard JavaScript object
 */
export function fromFirestoreFields(fields) {
  const obj = {};
  if (!fields || typeof fields !== "object") return obj;
  for (const [key, val] of Object.entries(fields)) {
    obj[key] = fromFirestoreValue(val);
  }
  return obj;
}

/**
 * Fetch all documents in a Firestore collection
 */
export async function getFirestoreDocuments(collection) {
  try {
    const url = withApiKey(`${FIRESTORE_BASE_URL}/${collection}?pageSize=300`);
    const res = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!res.ok) {
      const errText = await res.text();
      console.warn(`Firestore GET /${collection} error [${res.status}]:`, errText);
      return { success: false, status: res.status, error: errText, data: [] };
    }

    const json = await res.json();
    const documents = json.documents || [];
    const parsed = documents.map((doc) => {
      const id = doc.name.split("/").pop();
      const fields = fromFirestoreFields(doc.fields || {});
      return { id, ...fields };
    });

    return { success: true, data: parsed };
  } catch (err) {
    console.warn(`Firestore GET /${collection} network failure:`, err.message);
    return { success: false, error: err.message, data: [] };
  }
}

/**
 * Save or update a document in a Firestore collection
 */
export async function saveFirestoreDocument(collection, id, data) {
  try {
    const safeId = encodeURIComponent(String(id));
    const fields = toFirestoreFields(data);
    const url = withApiKey(`${FIRESTORE_BASE_URL}/${collection}/${safeId}`);

    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ fields }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.warn(`Firestore PATCH /${collection}/${safeId} error [${res.status}]:`, errText);
      return { success: false, status: res.status, error: errText };
    }

    const savedDoc = await res.json();
    const parsed = fromFirestoreFields(savedDoc.fields || {});
    return { success: true, data: { id: safeId, ...parsed } };
  } catch (err) {
    console.warn(`Firestore PATCH /${collection} network failure:`, err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Delete a document from a Firestore collection
 */
export async function deleteFirestoreDocument(collection, id) {
  try {
    const safeId = encodeURIComponent(String(id));
    const url = withApiKey(`${FIRESTORE_BASE_URL}/${collection}/${safeId}`);

    const res = await fetch(url, {
      method: "DELETE",
      headers: { Accept: "application/json" },
    });

    if (!res.ok && res.status !== 404) {
      const errText = await res.text();
      console.warn(`Firestore DELETE /${collection}/${safeId} error [${res.status}]:`, errText);
      return { success: false, status: res.status, error: errText };
    }

    return { success: true };
  } catch (err) {
    console.warn(`Firestore DELETE /${collection} network failure:`, err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Test connectivity to Firestore
 */
export async function testFirestoreConnection() {
  try {
    const url = withApiKey(`${FIRESTORE_BASE_URL}/campaigns?pageSize=1`);
    const res = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (res.ok) return { connected: true, status: 200 };
    return { connected: false, status: res.status };
  } catch (err) {
    return { connected: false, error: err.message };
  }
}
