// const ACCESS_TOKEN_KEY = "scalecart_access_token";
// const REFRESH_TOKEN_KEY = "scalecart_refresh_token";

// export function saveTokens(accessToken, refreshToken) {
//   localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
//   localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
// }

// export function getAccessToken() {
//   if (typeof window === "undefined") {
//     return null;
//   }

//   return localStorage.getItem(ACCESS_TOKEN_KEY);
// }

// export function getRefreshToken() {
//   if (typeof window === "undefined") {
//     return null;
//   }

//   return localStorage.getItem(REFRESH_TOKEN_KEY);
// }

// export function clearTokens() {
//   localStorage.removeItem(ACCESS_TOKEN_KEY);
//   localStorage.removeItem(REFRESH_TOKEN_KEY);
// }



const ACCESS_TOKEN_KEY =
  "scalecart_access_token";

const REFRESH_TOKEN_KEY =
  "scalecart_refresh_token";

export function saveTokens(
  accessTokenOrObject,
  refreshToken
) {
  if (typeof window === "undefined") {
    return;
  }

  /*
   * Supports:
   *
   * saveTokens(accessToken, refreshToken)
   *
   * and
   *
   * saveTokens({
   *   accessToken,
   *   refreshToken
   * })
   */
  let accessToken;
  let newRefreshToken;

  if (
    typeof accessTokenOrObject ===
      "object" &&
    accessTokenOrObject !== null
  ) {
    accessToken =
      accessTokenOrObject.accessToken;

    newRefreshToken =
      accessTokenOrObject.refreshToken;
  } else {
    accessToken =
      accessTokenOrObject;

    newRefreshToken =
      refreshToken;
  }

  if (accessToken) {
    localStorage.setItem(
      ACCESS_TOKEN_KEY,
      accessToken
    );
  }

  if (newRefreshToken) {
    localStorage.setItem(
      REFRESH_TOKEN_KEY,
      newRefreshToken
    );
  }
}

export function getAccessToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(
    ACCESS_TOKEN_KEY
  );
}

export function getRefreshToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(
    REFRESH_TOKEN_KEY
  );
}

export function saveAccessToken(
  accessToken
) {
  if (typeof window === "undefined") {
    return;
  }

  if (accessToken) {
    localStorage.setItem(
      ACCESS_TOKEN_KEY,
      accessToken
    );
  }
}

export function clearTokens() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(
    ACCESS_TOKEN_KEY
  );

  localStorage.removeItem(
    REFRESH_TOKEN_KEY
  );
}

export function isLoggedIn() {
  return Boolean(getAccessToken());
}

export async function refreshAccessToken() {
  const refreshToken =
    getRefreshToken();

  if (!refreshToken) {
    return null;
  }

  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL ||
        "http://localhost:5000"
      }/api/auth/refresh`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          refreshToken,
        }),
      }
    );

    const data =
      await response.json().catch(
        () => null
      );

    if (
      !response.ok ||
      !data?.success ||
      !data?.accessToken ||
      !data?.refreshToken
    ) {
      clearTokens();
      return null;
    }

    /*
     * Backend rotates BOTH tokens.
     *
     * Save the new access token
     * and the new refresh token.
     */
    saveTokens({
      accessToken:
        data.accessToken,

      refreshToken:
        data.refreshToken,
    });

    return data.accessToken;
  } catch (error) {
    console.error(
      "Access token refresh failed:",
      error
    );

    clearTokens();

    return null;
  }
}

export async function logout() {
  const refreshToken =
    getRefreshToken();

  try {
    if (refreshToken) {
      await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL ||
          "http://localhost:5000"
        }/api/auth/logout`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            refreshToken,
          }),
        }
      );
    }
  } catch (error) {
    console.error(
      "Logout request failed:",
      error
    );
  } finally {
    /*
     * Always clear local authentication
     * state, even if backend logout fails.
     */
    clearTokens();
  }
}