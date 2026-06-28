const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

/**
 * Base fetch wrapper with error handling
 */
async function apiFetch(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers: { "Content-Type": "application/json", ...options.headers },
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        status: res.status,
        error: data.message || "Something went wrong",
        code: data.code || null,
      };
    }

    return { success: true, data: data, message: data.message };
  } catch (err) {
    return {
      success: false,
      status: 0,
      error: "Unable to reach server. Please try again later.",
      code: "NETWORK_ERROR",
    };
  }
}

/**
 * ==============================
 * PUBLIC ROUTES
 * ==============================
 */

export async function registerUser({ name, email, phone, college, shift }) {
  return apiFetch("/api/registration", {
    method: "POST",
    body: JSON.stringify({ name, email, phone, college, shift }),
  });
}

export async function createPaymentOrder({ name, email, phone, college, shift }) {
  return apiFetch("/api/payment/create-order", {
    method: "POST",
    body: JSON.stringify({ name, email, phone, college, shift }),
  });
}

export async function verifyPayment({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
}) {
  return apiFetch("/api/payment/verify", {
    method: "POST",
    body: JSON.stringify({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    }),
  });
}

export async function sendContactMessage({ firstName, lastName, email, message }) {
  return apiFetch("/api/contact", {
    method: "POST",
    body: JSON.stringify({ firstName, lastName, email, message }),
  });
}

export async function submitFeedback({ name, email, phone, rating, feedback }) {
  return apiFetch("/api/feedback", {
    method: "POST",
    body: JSON.stringify({ name, email, phone, rating, feedback }),
  });
}

export async function healthCheck() {
  return apiFetch("/health");
}

/**
 * ==============================
 * ADMIN ROUTES
 * ==============================
 */

export async function loginAdmin({ email, password }) {
  return apiFetch("/api/admin/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function getAdminStats(token) {
  return apiFetch("/api/admin/stats", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getAdminFeedback(token) {
  return apiFetch("/api/admin/feedback", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function markAttendance(token, qr_data) {
  return apiFetch("/api/attendance/mark", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ qr_data }),
  });
}

/**
 * Helper to download an Excel file from the server
 */
export async function downloadExcel(endpoint, token, filename) {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Failed to download file");
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    return { success: true };
  } catch (err) {
    return { success: false, error: err.message || "Failed to download" };
  }
}
