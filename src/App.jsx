import Nav from "./components/Nav"
import SignUpForm from "./pages/SignUpForm"
import './App.css'
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
import JobProposals from "./pages/JobProposals"
import ClientProfile from "./pages/ClientProfile"
import Contracts from "./pages/Contracts"
import ContractDetails from "./pages/ContractDetails"

const getUserFromToken = () => {
  const token = localStorage.getItem('token')

  if (!token) return null

  return JSON.parse(atob(token.split('.')[1])).payload
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
            path="/proposals/mine"
            element={<MyProposals />}
          />

          <Route
            path="/client/profile"
            element={<ClientProfile />}
          />

          <Route path='/contracts' element={<Contracts/>} />

          <Route path='/contracts/:contractId' element={<ContractDetails user={user} />} />

        </Routes>

      </main>

    </div>
  )
}

export default App