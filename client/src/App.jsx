import { AuthProvider } from "./contexts/AuthContext.jsx"
import Dashboard from "./screens/Dashboard.jsx"
import WordInput from "./containers/WordInput.jsx"
import LoginRegis from "./screens/LoginRegis.jsx"
import PostView from "./screens/PostView.jsx"
import { BrowserRouter, Routes, Route } from "react-router-dom"

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/:page" element={<Dashboard />} />
          <Route path="/word" element={<WordInput />} />
          <Route path="/post/:postId" element={<PostView />} />
          <Route path="/login" element={<LoginRegis />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
