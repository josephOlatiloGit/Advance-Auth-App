import { Route, Routes } from "react-router-dom";
import FloatingShape from "./components/FloatingShape";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";

function App() {
  const shapes = [
    { color: "bg-green-500", size: "w-64 h-64", top: "-5%", left: "10%" },
    { color: "bg-emerald-500", size: "w-48 h-48", top: "70%", left: "80%" },
    { color: "bg-lime-500", size: "w-32 h-32", top: "40%", left: "-10%" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden">
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
        <Route path="/" element={"Home"} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
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
