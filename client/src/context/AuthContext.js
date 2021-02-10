import {createContext}from 'react'

function noop() {

}
export const AuthContext = createContext({
    toke:null,
    userId:null,
    login:noop,
    logout:noop,
    isAuthenticated:false
})