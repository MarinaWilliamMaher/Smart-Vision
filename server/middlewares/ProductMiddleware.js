import JWT from 'jsonwebtoken';

const AbilityToChangeProductDetails = async (req, res, next) => {
  const authHeader = req?.headers?.authorization;
  if (!authHeader || !authHeader?.startsWith('Bearer')) {
    next('Authentication == failed');
  }
  const token = authHeader?.split(' ')[1];
  try {
    const { jobTitle } = JWT.verify(token, process.env.JWT_SECRET_KEY);
    if (
      jobTitle.toLowerCase() === 'presenter' ||
      jobTitle.toLowerCase() === 'inventory manager'
    ) {
      next();
    } else {
      next('you are not presenter or inventory manager');
    }
  } catch (error) {
    console.log(error);
    next('Authentication failed');
  }
};
export default AbilityToChangeProductDetails;
