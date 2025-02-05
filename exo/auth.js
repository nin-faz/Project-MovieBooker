const user = {
  email: "faz@gmail.com",
  password: "1234",
};

function generateToken(user) {
  const payload = JSON.stringify({ email: user.email });
  const token = btoa(payload);

  console.log(token);
  return token;
}

const login = async (email, password) => {
  const user = {
    email,
    password,
  };

  const token = generateToken(user);
  if (verifyToken(token)) {
    return "Login successful";
  } else {
    return "Email or password is incorrect";
  }
};

function verifyToken(token) {
  const payload = atob(token);
  return JSON.parse(payload);
}
