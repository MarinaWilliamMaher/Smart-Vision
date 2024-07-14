import bcrybt from 'bcryptjs';
import JWT from 'jsonwebtoken';

export const hashString = async (useValue) => {
  const salt = await bcrybt.genSalt(10);
  const hashedPassword = await bcrybt.hash(useValue, salt);
  return hashedPassword;
};
export const compareString = async (userPassword, password) => {
  const isMatch = await bcrybt.compare(userPassword, password);
  return isMatch;
};

// Json WebToken
export function createJWT(id) {
  return JWT.sign({ customerId: id }, process.env.JWT_SECRET_KEY, {
    expiresIn: '1d',
  });
}
export function createEmployeeJWT(jobTitle) {
  return JWT.sign({ jobTitle: jobTitle }, process.env.JWT_SECRET_KEY, {
    expiresIn: '1d',
  });
}

//Socket io
export const addNewOnline = ({ user }, socketId, onlineUsers) => {
  const users = onlineUsers.filter((User) => User.email === user.email);
  if (users) {
    users.map((User) => {
      onlineUsers.pop(User);
    });
    onlineUsers.push({ ...user, socketId });
  } else {
    onlineUsers.push({ ...user, socketId });
  }
};

export const removeUser = (socketId, onlineUsers) => {
  return onlineUsers.filter((User) => User.socketId !== socketId);
};

export const getUser = (username, onlineUsers) => {
  return onlineUsers.find((User) => User?.username !== username);
};

export const getOperator = (onlineUsers) => {
  return onlineUsers.filter((User) => User?.jobTitle === 'Operator');
};

export const getEngineer = (onlineUsers, to) => {
  return onlineUsers.filter(
    (User) => User?.jobTitle === 'Engineer' && User?._id === to
  );
};

export const getFactory = (onlineUsers) => {
  return onlineUsers.filter((User) => User?.jobTitle === 'Factory Manager');
};

export const getIventoryManager = (onlineUsers) => {
  return onlineUsers.filter((User) => User?.jobTitle === 'Inventory Manager');
};
