export const getTokenAndRole = () => {
    const token = localStorage.getItem("token");
    if (!token) return { token: null, role: null };
  
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      return { token, role: decodedToken?.role?.toLowerCase() || null };
    } catch (error) {
      console.error("Invalid token", error);
      localStorage.removeItem("token");
      return { token: null, role: null };
    }
  };
  