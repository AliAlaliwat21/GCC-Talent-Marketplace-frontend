const Dashboard = (props) => {

    return (
        <section>
            <header>
                <h1>Welcome {props.user.username}!</h1>
                <p>Role: {props.user.role}</p>
            </header>

            {props.user.role === 'client' && (
                <section>
                    <h2>Client Dashboard</h2>

                    <div className="card">
                        <h3>Post a Job</h3>
                        <p>Create a new job and find freelancers.</p>
                    </div>

                    <div className="card">
                        <h3>My Jobs</h3>
                        <p>View and manage the jobs you have posted.</p>
                    </div>

                    <div className="card">
                        <h3>Contracts</h3>
                        <p>Manage your active contracts and milestones.</p>
                    </div>

                    <div className="card">
                        <h3>Wallet</h3>
                        <p>View your balance and transactions.</p>
                    </div>
                </section>
            )}

            {props.user.role === 'freelancer' && (
                <section>
                    <h2>Freelancer Dashboard</h2>

                    <div className="card">
                        <h3>Browse Jobs</h3>
                        <p>Find jobs that match your skills.</p>
                    </div>

                    <div className="card">
                        <h3>My Proposals</h3>
                        <p>View and manage your submitted proposals.</p>
                    </div>

                    <div className="card">
                        <h3>Contracts</h3>
                        <p>Manage your active work and milestones.</p>
                    </div>

                    <div className="card">
                        <h3>Wallet</h3>
                        <p>View your earnings and transactions.</p>
                    </div>
                </section>
            )}

        </section>
    )
}

export default Dashboard