export const loginUser = async (credentials) => {
  const response = await fetch(
    "https://back-project-moviebooker.onrender.com/auth/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    }
  );
  if (!response.ok) {
    throw new Error("Invalid credentials");
  }
  return response.json();
};

export const registerUser = async (userData) => {
  const response = await fetch(
    "https://back-project-moviebooker.onrender.com/auth/register",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    }
  );
  if (!response.ok) {
    throw new Error("Registration failed");
  }
  return response.json();
};
