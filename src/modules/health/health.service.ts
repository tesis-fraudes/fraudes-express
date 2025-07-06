const check = async () => {
  return {
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date(),
  };
};

export default { check };