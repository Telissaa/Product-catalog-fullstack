import { apiLoginEndpoint, apiRegisterEndpoint } from "./constants";

export const loginToApp = async (email: string, password: string) => {
  try {
    const response = await fetch(apiLoginEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Błędny login lub hasło.");
    }
    return data;
  } catch (err: any) {
    throw err;
  }
};

export const registerToApp = async (
  username: string,
  email: string,
  password: string,
) => {
  try {
    const response = await fetch(apiRegisterEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password,
      }),
    });

    const responseText = await response.text();
    const data = responseText ? JSON.parse(responseText) : null;

    if (!response.ok) {
      throw new Error(
        data?.message || "Coś poszło nie tak podczas rejestracji.",
      );
    }

    return data;
  } catch (err: any) {
    throw err;
  }
};
