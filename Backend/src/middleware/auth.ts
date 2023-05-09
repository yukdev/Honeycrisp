export const requireSecret = async (req: any, res: any, next: any) => {
  const { secret } = req.body;

  if (secret !== process.env.SECRET_KEY) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  next();
};
