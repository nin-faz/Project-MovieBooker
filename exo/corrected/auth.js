const user = { id: 1, name: "Alice", role: "admin" };
function generateToken(user) {
  const userString = JSON.stringify(user);
  const token = btoa(userString);
  return token;
}
const token = generateToken(user);
console.log("Token généré :", token);
function verifyToken(token) {
  const decodedToken = atob(token);
  const user = JSON.parse(decodedToken);
  return user;
}
const decodedUser = verifyToken(token);
console.log("Utilisateur décodé :", decodedUser);
