import { Navigate } from "react-router"

const RequireAuth = function (props) {
    if (!props.user) {
        return <Navigate to="/sign-in" replace />
    }

    if (props.roles && !props.roles.includes(props.user.role)) {
        return <Navigate to="/" replace />
    }

    return props.children
}

export default RequireAuth
