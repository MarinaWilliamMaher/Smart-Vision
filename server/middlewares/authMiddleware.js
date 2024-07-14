import JWT from 'jsonwebtoken';

const customerAuth = async (req, res, next) => {
  const authHeader = req?.headers?.authorization;
  if (!authHeader || !authHeader?.startsWith('Bearer')) {
    next('Authentication == failed');
  }
  const token = authHeader?.split(' ')[1];
  try {
    const customerToken = JWT.verify(token, process.env.JWT_SECRET_KEY);
    req.body.customer = {
      customerId: customerToken.customerId,
    };
    next();
  } catch (error) {
    console.log(error);
    next('Authentication failed');
  }
};
export default customerAuth;
