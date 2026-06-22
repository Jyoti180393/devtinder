const signUpValidation = (req) => {
  const {
    firstName,
    lastName,
    email,
    password,
    age,
    gender,
    securityQuestion,
    securityAnswer,
  } = req.body;

  if (!firstName) {
    throw new Error("First name can't be empty");
  } else if (!age) {
    throw new Error("Age is required");
  } else if (!gender) {
    throw new Error("Gender is required");
  } else if (!email) {
    throw new Error("Email is missing");
  } else if (!password) {
    throw new Error("Password is required");
  } else if (!securityQuestion) {
    throw new Error("Security question is required");
  } else if (!securityAnswer) {
    throw new Error("Security answer is required");
  }
  // can write validate logic .isEmail and .isStrongPassword here also
};

const editProfileValidation = (req) => {
  const { firstName, lastName, age, gender, skills, about } = req.body;

  if (
    (firstName && firstName.length < 3) ||
    (lastName && lastName.length < 3)
  ) {
    throw new Error("Minimum allowed length (3).");
  } else if (skills && skills.length > 5) {
    throw new Error("You can add upto 5 skills only");
  } else if (about && about?.length >= 500) {
    throw new Error("About must be less than 500 words");
  }
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
  ];
  return Object.keys(req.body).every((field) => allowdedFields.includes(field));
};

module.exports = {
  signUpValidation,
  validateUserData,
  editProfileValidation,
};
