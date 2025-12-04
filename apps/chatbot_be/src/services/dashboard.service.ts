export const getDashboardStatusService = () => {
  try {
  } catch (error: any | Error) {
    return { status: 500, message: error.message };
  }
};
