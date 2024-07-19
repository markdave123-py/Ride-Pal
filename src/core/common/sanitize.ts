

export const sanitizeUser = (user: any) => {
  const { password, ...sanitizedUser } = user.dataValues;
  return sanitizedUser;
}