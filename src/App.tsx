import { AuthProvider } from "./context/AuthContext"
import { AppRoutes } from "./routes/AppRoutes"


const App = () => {
  return (
    <div>
      <AuthProvider>
        <AppRoutes/>
      </AuthProvider>
    </div>
  )
}

export default App
