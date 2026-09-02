import Nav from "./components/Nav"
import SignUpForm from "./pages/SignUpForm"
import "./App.css"
import "./styles/compact-pages.css"
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
import RequireAuth from "./components/RequireAuth"
import NotFound from "./pages/NotFound"
import Freelancers from "./pages/Freelancers"
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
            element={
              <RequireAuth user={user} roles={["client"]}>
                <MyJobs />
              </RequireAuth>
            }
          />
          <Route
            path="/client/jobs/:jobId/proposals"
            element={
              <RequireAuth user={user} roles={["client"]}>
                <JobProposals />
              </RequireAuth>
            }
          />
          <Route
            path="/freelancer/profile"
            element={
              <RequireAuth user={user} roles={["freelancer"]}>
                <FreelancerProfile user={user} />
              </RequireAuth>
            }
          />
          <Route
            path="/freelancers/:userId"
            element={<PublicFreelancerProfile />}
          />
          <Route
            path="/freelancers"
            element={<Freelancers />}
          />
          <Route
            path="/clients/:userId"
            element={<PublicClientProfile />}
          />
          <Route
            path="/proposals/mine"
            element={
              <RequireAuth user={user} roles={["freelancer"]}>
                <MyProposals />
              </RequireAuth>
            }
          />
          <Route
            path="/client/profile"
            element={
              <RequireAuth user={user} roles={["client"]}>
                <ClientProfile />
              </RequireAuth>
            }
          />
          <Route
            path='/contracts'
            element={
              <RequireAuth user={user} roles={["client", "freelancer"]}>
                <Contracts/>
              </RequireAuth>
            }
          />
          <Route
            path='/contracts/:contractId'
            element={
              <RequireAuth user={user} roles={["client", "freelancer"]}>
                <ContractDetails user={user} />
              </RequireAuth>
            }
          />
          <Route
            path="/client/jobs/new"
            element={
              <RequireAuth user={user} roles={["client"]}>
                <CreateJob />
              </RequireAuth>
            }
          />
          <Route
            path="/client/jobs/:jobId/edit"
            element={
              <RequireAuth user={user} roles={["client"]}>
                <EditJob />
              </RequireAuth>
            }
          />
          <Route
            path="/wallet"
            element={
              <RequireAuth user={user} roles={["client", "freelancer"]}>
                <Wallet user={user} />
              </RequireAuth>
            }
          />
          <Route
            path="/settings"
            element={
              <RequireAuth user={user}>
                <AccountSettings user={user} setUser={setUser} />
              </RequireAuth>
            }
          />
          <Route
            path="/admin"
            element={
              <RequireAuth user={user} roles={["admin"]}>
                <AdminDashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/users"
            element={
              <RequireAuth user={user} roles={["admin"]}>
                <AdminUsers />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/users/:userId"
            element={
              <RequireAuth user={user} roles={["admin"]}>
                <AdminUserDetails />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <RequireAuth user={user} roles={["admin"]}>
                <AdminCategories />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/skills"
            element={
              <RequireAuth user={user} roles={["admin"]}>
                <AdminSkills />
              </RequireAuth>
            }
          />
          <Route
            path="*"
            element={<NotFound />}
          />
        </Routes>
      </main>
    </div>
  )
}
export default App
