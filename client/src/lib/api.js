// const API_URL =
//   process.env.NEXT_PUBLIC_API_URL ||
//   "http://localhost:5000/api";

// export async function apiRequest(endpoint, options = {}) {
//   const response = await fetch(`${API_URL}${endpoint}`, {
//     ...options,
//     headers: {
//       "Content-Type": "application/json",
//       ...(options.headers || {}),
//     },
//   });

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(
//       data.message || "Something went wrong"
//     );
//   }

//   return data;
// }

// export async function authenticatedRequest(
//   endpoint,
//   options = {}
// ) {
//   const { getAccessToken } = await import("./auth");

//   const token = getAccessToken();

//   if (!token) {
//     throw new Error("Authentication required");
//   }

//   return apiRequest(endpoint, {
//     ...options,
//     headers: {
//       ...(options.headers || {}),
//       Authorization: `Bearer ${token}`,
//     },
//   });
// }




import {
  getAccessToken,
  refreshAccessToken,
} from "./auth";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

let refreshPromise = null;

async function parseResponse(response) {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.error ||
        "Something went wrong"
    );
  }

  return data;
}

async function performRefresh() {
  /*
   * If multiple requests receive 401
   * at the same time, only one refresh
   * request should be sent.
   */
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

export async function apiRequest(
  endpoint,
  options = {}
) {
  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    }
  );

  return parseResponse(response);
}

export async function authenticatedRequest(
  endpoint,
  options = {},
  retry = true
) {
  const accessToken = getAccessToken();

  /*
   * No access token means the user is not
   * authenticated.
   */
  if (!accessToken) {
    throw new Error(
      "Authentication required"
    );
  }

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  /*
   * Everything except 401 is handled normally.
   */
  if (response.status !== 401) {
    return parseResponse(response);
  }

  /*
   * Don't refresh more than once for
   * the same original request.
   */
  if (!retry) {
    return parseResponse(response);
  }

  /*
   * Access token may have expired.
   * Try refresh-token rotation.
   */
  const newAccessToken =
    await performRefresh();

  /*
   * Refresh failed.
   * auth.js clears the local tokens.
   */
  if (!newAccessToken) {
    return parseResponse(response);
  }

  /*
   * Retry the ORIGINAL request with
   * the newly generated access token.
   */
  const retryResponse = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        Authorization: `Bearer ${newAccessToken}`,
      },
    }
  );

  return parseResponse(retryResponse);
}