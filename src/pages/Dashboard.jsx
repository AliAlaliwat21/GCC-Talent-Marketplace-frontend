import { Link } from "react-router" 

const Dashboard = (props) => {
    return (
    <section className="dashboard">
        <header>
            <h1>Welcome, {props.user.username}!</h1>
            <p>You are signed in as a {props.user.role}</p>
            </header>
            
            {props.user.role === "client" && (<div className="card">
                <h2>Client Dashboard</h2>
                <p>Post jobs, review proposals and manage contracts</p>
                <Link to="/client/profile">Create or Edit Profile</Link>
                <br/>
                <Link to="/client/jobs">My Jobs</Link>
                <br/>
                <Link to="/client/jobs/new">Post New Job</Link>
                <br/>
                <Link to="/wallet">My Wallet</Link>
                </div>
            )}
            {props.user.role === "freelancer" && (
                <div className="card">
                    <h2>Freelancer Dashboard</h2>
                    <p>Find jobs, submit proposals and manage your work</p>
                    <Link to="/freelancer/profile">Create or Edit Profile</Link>
                    <br/>
                    <Link to={`/freelancers/${props.user._id}`}>View Public Profile</Link>
                    <br/>
                    <Link to="/wallet">My Wallet</Link>
                    </div>
                )}
                {props.user.role === "admin" && (
                    <div className="card">
                        <h2>Admin Dashboard</h2>
                        <p>Manage users, categories and platform activity</p>
                        </div>
                    )}
                    </section>
                    )
                }
                export default Dashboard