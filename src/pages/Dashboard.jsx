import { Link } from "react-router" 

const Dashboard = (props) => {
    return (
    <section className="dashboard">
        <header className="dashboard-header">
            <h1>Welcome, {props.user.username}!</h1>
            <p>You are signed in as a {props.user.role}</p>
            </header>
            
            {props.user.role === "client" && (
                <div className="dashboard-card">
                    <div className="dashboard-card-header">
                        <h2>Client Dashboard</h2>
                        <p>Post jobs, review proposals and manage contracts</p>
                    </div>
                    <div className="dashboard-links">
                        <Link to="/client/profile">Create or Edit Profile</Link>
                        <Link to={`/clients/${props.user._id}`}>View Public Profile</Link>
                        <Link to="/client/jobs">My Jobs</Link>
                        <Link to="/client/jobs/new">Post New Job</Link>
                        <Link to="/contracts">My Contracts</Link>
                        <Link to="/wallet">My Wallet</Link>
                    </div>
                </div>
            )}

            {props.user.role === "freelancer" && (
                <div className="dashboard-card">
                    <div className="dashboard-card-header">
                        <h2>Freelancer Dashboard</h2>
                        <p>Find jobs, submit proposals and manage your work</p>
                    </div>
                    <div className="dashboard-links">
                        <Link to="/jobs">Find Jobs</Link>
                        <Link to="/freelancer/profile">Create or Edit Profile</Link>
                        <Link to={`/freelancers/${props.user._id}`}>View Public Profile</Link>
                        <Link to="/proposals/mine">My Proposals</Link>
                        <Link to="/contracts">My Contracts</Link>
                        <Link to="/wallet">My Wallet</Link>
                    </div>
                </div>
            )}

            {props.user.role === "admin" && (
                <div className="dashboard-card">
                    <div className="dashboard-card-header">
                        <h2>Admin Dashboard</h2>
                        <p>Manage users, categories and platform activity</p>
                    </div>
                    <div className="dashboard-links">
                        <Link to="/admin">Open Admin Dashboard</Link>
                    </div>
                </div>
            )}
            </section>
            )
        }

        export default Dashboard