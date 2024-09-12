import { Navigate, Route, Routes } from "react-router-dom";
import FloatingShape from "./components/FloatingShape";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import DashboardPage from "./pages/DashboardPage";

/*
Here we Redirect authenticated users to the home page
And redirect unverified user to signup page as the children
We also create logic to protect the route that require auth
*/

// protect the routes that requires authentication:
const ProtectRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return children; //if user is verified then they can see the protected route.
};

const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user.isVerified) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  const { isCheckingAuth, checkAuth, isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log("isAuthenticated:", isAuthenticated);
  console.log("user:", user);

  const shapes = [
    { color: "bg-green-500", size: "w-64 h-64", top: "-5%", left: "10%" },
    { color: "bg-emerald-500", size: "w-48 h-48", top: "70%", left: "80%" },
    { color: "bg-lime-500", size: "w-32 h-32", top: "40%", left: "-10%" },
  ];

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900
     to-emerald-900 flex items-center justify-center relative overflow-hidden"
    >
      {shapes.map((shape, index) => (
        <FloatingShape
          key={index}
          color={shape.color}
          size={shape.size}
          top={shape.top}
          left={shape.left}
          delay={Math.random() * 5} // Randomize delay
        />
      ))}

      <Routes>
        <Route
          path="/"
          element={
            <ProtectRoute>
              <DashboardPage />
            </ProtectRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <RedirectAuthenticatedUser>
              <SignUpPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/login"
          element={
            <RedirectAuthenticatedUser>
              <LoginPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route path="/verify-email" element={<EmailVerificationPage />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;

// import FloatingShape from "./components/FloatingShape";

// function App() {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden">
//       <FloatingShape
//         color="bg-green-500"
//         size="w-64 h-64"
//         top="-5%"
//         left="10%"
//         delay={0}
//       />
//       <FloatingShape
//         color="bg-emerald-500"
//         size="w-48 h-48"
//         top="70%"
//         left="80%"
//         delay={5}
//       />
//       <FloatingShape
//         color="bg-lime-500"
//         size="w-32 h-32"
//         top="40%"
//         left="-10%"
//         delay={2}
//       />
//     </div>
//   );
// }

// export default App;
