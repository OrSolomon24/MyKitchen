export const signInUser = async (username, password) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('שם משתמש או סיסמה שגויים.');
      } else {
        throw new Error('אירעה שגיאה. אנא נסה שנית.');
      }
    }

    const data = await response.json();
    localStorage.setItem('token', data.token); // ✅ Save the token
    return data;
  } catch (error) {
    throw error;
  }
};
