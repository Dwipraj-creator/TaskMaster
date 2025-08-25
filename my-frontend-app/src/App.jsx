import { BrowserRouter as Router,Routes,Route } from "react-router-dom";  
import Login from "./pages/Login";
import Register from "./pages/Signup";
import PrivateRoute from "./utils/PrivateRoute";
import Board from "./pages/Board";
import Dashboard from "./pages/Dashboard";






function App(){
  return(
    <Router>
      <Routes>
        <Route path="/login"element={<Login/>}/>
        <Route path="/" element={<Register/>}/>
          <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
          <Route
            path="/boards/:id"
            element={
           <PrivateRoute>
              <Board/>
           </PrivateRoute>
            }
          />
      </Routes>
    </Router>
  )
}


export default App;