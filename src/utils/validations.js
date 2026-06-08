const signUpValidation = (req) => {
  const { firstName, lastName, email, password, age, gender } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Must enter first and last name");
  } else if (!age) {
    throw new Error("Age is required");
  } else if (!gender) {
    throw new Error("Gender is required");
  } else if (!email) {
    throw new Error("Email is missing");
  }
  // can write validate logic .isEmail and .isStrongPassword here also
};

const validateUserData = (req) => {
  const allowdedFields = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "skills",
    "about",
    "photoUrl",
    "securityQuestion",
    "securityAnswer",
  ];
  return Object.keys(req.body).every((field) => allowdedFields.includes(field));
};

module.exports = {
  signUpValidation,
  validateUserData,
};
