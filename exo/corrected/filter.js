const users = [
  { id: 1, name: "Alice", age: 25 },
  { id: 2, name: "Bob", age: 30 },
  { id: 3, name: "Charlie", age: 22 },
  { id: 4, name: "David", age: 35 },
];
function filterUsersByAge(users, minAge) {
  return users.filter((user) => user.age >= minAge);
}
console.log("Utilisateurs de 25 ans et plus :", filterUsersByAge(users, 25));
function filterUsersByName(users, keyword, caseSensitive = false) {
  if (caseSensitive) {
    return users.filter((user) => user.name.includes(keyword));
  }
  return users.filter((user) =>
    user.name.toLowerCase().includes(keyword.toLowerCase())
  );
}
console.log(
  "Utilisateurs dont le nom contient 'a' :",
  filterUsersByName(users, "a")
);
console.log(
  "Utilisateurs dont le nom contient 'A' (case sensitive) :",
  filterUsersByName(users, "A", true)
);
