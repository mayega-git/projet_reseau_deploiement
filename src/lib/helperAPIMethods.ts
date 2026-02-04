// Reusable Fetch(GET) Helper Function
export const fetchData = async <T>(url: string): Promise<T | null> => {
  try {

    const tokenResponse = await fetch('/api/auth/token', { method: 'GET', credentials: 'include' });
        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.accessToken;
        if (!accessToken) {
          console.warn('⚠️ No access token found, request will be sent without Authorization header');
        }
    console.log("➡️ URL transmise à fetchData:", url);

    const response = await fetch(url, { method: 'GET' });

    if (!response.ok) {
      console.log(
        `Request failed: ${response.status} ${response.statusText}`
      );
      console.log("➡️ Requête envoyée à :", url);
      console.log("⬅️ Code HTTP :", response.status);
      const errorText = await response.text();
      console.log("Contenu brut reçu :", errorText); //observer ce qui est retourné
      return null;
    }

    return await response.json();
  } catch (e) {
    console.error(`An error occurred while fetching data from ${url}:`, e);
    return null;
  }
};

// Reusable POST Helper Function
export const postData = async <T, R>(
  url: string,
  body: T
): Promise<R | null> => {
  console.log(JSON.stringify(body));
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.log(
        `Request failed: ${response.status} ${response.statusText}`
      );
      return null;
    }

    return await response.json();
  } catch (e) {
    console.error(`An error occurred while posting data to ${url}:`, e);
    return null;
  }
};

// Reusable DELETE Helper Function
export const deleteData = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'DELETE' });

    if (!response.ok) {
      console.error(
        `Request failed: ${response.status} ${response.statusText}`
      );
      return false;
    }

    return true; // Successfully deleted
  } catch (e) {
    console.error(`An error occurred while deleting data from ${url}:`, e);
    return false;
  }
};

// Reusable PUT Helper Function
export const putData = async <T, R>(
  url: string,
  body: T
): Promise<R | null> => {
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.error(
        `Request failed: ${response.status} ${response.statusText}`
      );
      return null;
    }

    return await response.json();
  } catch (e) {
    console.error(`An error occurred while updating data at ${url}:`, e);
    return null;
  }
};

// Reusable PATCH Helper Function
export const patchData = async <T, R>(
  url: string,
  body: T
): Promise<R | null> => {
  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.error(
        `Request failed: ${response.status} ${response.statusText}`
      );
      return null;
    }

    return await response.json();
  } catch (e) {
    console.error(`An error occurred while patching data at ${url}:`, e);
    return null;
  }
};

/**
 * Fetches binary data from a given URL and returns it as an array of numbers.
 * @param {string} url - The URL to fetch the binary data from.
 * @returns {Promise<number[]>} - The binary data as an array of numbers.
 */
export const fetchBinaryData = async (url: string): Promise<number[]> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch data from ${url}`);
    }
    const blob = await response.blob();

    // Convert the Blob into an ArrayBuffer
    const arrayBuffer = await blob.arrayBuffer();

    // return the converted ArrayBuffer to a Uint8Array and then to a base64 string or image URL
    return Array.from(new Uint8Array(arrayBuffer));
  } catch (err) {
    console.error(`Error fetching data from ${url}:`, err);
    throw err; // Re-throw the error to handle it in the calling function
  }
};
