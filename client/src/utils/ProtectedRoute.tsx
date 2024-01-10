import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { context } from "../store/context";

const ProtectedRoute: React.FC<{ children: React.JSX.Element }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(context);

  const value = isLoggedIn ? children : <></>;
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
  }, [isLoggedIn, navigate]);

  return value;
};
export default ProtectedRoute;
