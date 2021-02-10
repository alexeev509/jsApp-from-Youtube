import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom'
import {useRoutes} from "./routes";
import {useAuth} from "./hooks/auth.hook";
import {AuthContext} from "./context/AuthContext";
import {Navbar} from "./components/Navbar";
import {Loader} from "./components/Loader";
import 'materialize-css'
// import {cors} from "cors"
// app.use(cors())

function App() {
    const {token, login, logout, userId,ready} = useAuth();
    //!! covert token to boolean - but hiw? WTF ?
    const isAuthenticated = !!token;
    console.log("is Auth: "+isAuthenticated)
    const routes = useRoutes(isAuthenticated);

    if(!ready){
        return <Loader />;
    }
    return (
        <AuthContext.Provider value={{
            token, login, logout, userId, isAuthenticated
        }}>
            <Router>
                {isAuthenticated && <Navbar></Navbar>}
                <div className="container">
                    {routes}
                </div>
            </Router>
        </AuthContext.Provider>
    )
}

export default App;
