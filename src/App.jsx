import Nav from "./components/Nav"
import SignUpForm from "./pages/SignUpForm"
import "./App.css"
import { Routes, Route } from "react-router"
import { useState } from "react"
import SignInForm from "./pages/SignInForm"
import Landing from "./pages/Landing"
import Dashboard from "./pages/Dashboard"
import Jobs from "./pages/Jobs"
import JobDetails from "./pages/JobDetails"
import MyJobs from "./pages/MyJobs"
import FreelancerProfile from "./pages/FreelancerProfile"
import PublicFreelancerProfile from "./pages/PublicFreelancerProfile"
import MyProposals from "./pages/MyProposals"
import PublicClientProfile from "./pages/PublicClientProfile"
import JobProposals from "./pages/JobProposals"
import ClientProfile from "./pages/ClientProfile"
import Contracts from "./pages/Contracts"
import ContractDetails from "./pages/ContractDetails"
import CreateJob from "./pages/CreateJob"
import EditJob from "./pages/EditJob"
import Wallet from "./pages/Wallet"
import AdminUsers from "./pages/AdminUsers"
import AdminUserDetails from "./pages/AdminUserDetails"
import AdminDashboard from "./pages/AdminDashboard"
import AdminCategories from "./pages/AdminCategories"
import AdminSkills from "./pages/AdminSkills"
import AccountSettings from "./pages/AccountSettings"
const getUserFromToken = () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) return null
    return JSON.parse(atob(token.split('.')[1])).payload
  } catch {
    localStorage.removeItem('token')
    return null
  }
}

const App = () => {
  const [user, setUser] = useState(getUserFromToken())
  return (
    <div>
      <Nav
        user={user}
        setUser={setUser}
      />
      <main className="app-main">
        <Routes>
          <Route
            path="/"
            element={
              user
                ? <Dashboard user={user} />
                : <Landing />
            }
          />
          <Route
            path="/sign-up"
            element={<SignUpForm setUser={setUser} />}
          />
          <Route
            path="/sign-in"
            element={<SignInForm setUser={setUser} />}
          />
          <Route
            path="/jobs"
            element={<Jobs />}
          />
          <Route
            path="/jobs/:jobId"
            element={<JobDetails user={user} />}
          />
          <Route
            path="/client/jobs"
            element={<MyJobs />}
          />
          <Route
            path="/client/jobs/:jobId/proposals"
            element={<JobProposals />}
          />
          <Route
            path="/freelancer/profile"
            element={<FreelancerProfile user={user} />}
          />
          <Route
            path="/freelancers/:userId"
            element={<PublicFreelancerProfile />}
          />
          <Route
            path="/clients/:userId"
            element={<PublicClientProfile />}
          />
          <Route
            path="/proposals/mine"
            element={<MyProposals />}
          />
          <Route
            path="/client/profile"
            element={<ClientProfile />}
          />
          <Route path='/contracts' element={<Contracts/>} />
          <Route path='/contracts/:contractId' element={<ContractDetails user={user} />} />
          <Route
            path="/client/jobs/new"
            element={<CreateJob />}
          />
          <Route
            path="/client/jobs/:jobId/edit"
            element={<EditJob />}
          />
          <Route
            path="/wallet"
            element={<Wallet user={user} />}
          />
          <Route
            path="/settings"
            element={<AccountSettings user={user} setUser={setUser} />}
          />
          <Route
            path="/admin"
            element={<AdminDashboard />}
          />
          <Route
            path="/admin/users"
            element={<AdminUsers />}
          />
          <Route
            path="/admin/users/:userId"
            element={<AdminUserDetails />}
          />
          <Route
            path="/admin/categories"
            element={<AdminCategories />}
          />
          <Route
            path="/admin/skills"
            element={<AdminSkills />}
          />
        </Routes>
      </main>
    </div>
  )
}
export default App
