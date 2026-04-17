import { createContext, useContext, useEffect, useState } from 'react'
import { auth } from '../config/firebase'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from 'firebase/auth'

/*
  WHY CONTEXT?
  
  Without context, if you need the current user in both your Navbar AND your
  VaultPage AND your PrivateRoute, you'd have to pass it as a prop through
  every component in between — even ones that don't use it. This is called
  "prop drilling" and it's messy.
  
  With context, any component can call useAuth() and get the current user
  directly, no matter how deep in the tree it is.
*/

// Step 1: Create the context object. The null default is just a placeholder —
// the real value comes from AuthProvider below.
const AuthContext = createContext(null)

// Step 2: The Provider component. Wrap your app in this and all children
// can access the values inside.
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  
  /*
    loading starts as true because when the app first loads, we don't know
    yet if Firebase has a stored session. We need to wait for Firebase to
    check (usually < 500ms) before rendering anything.
    
    Why this matters for security: if loading=false and currentUser=null,
    PrivateRoute redirects to /login. But if we render before Firebase has
    checked, we'd flash the login page briefly for users who ARE logged in.
    By waiting for loading=false, we show a spinner instead.
  */
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    /*
      onAuthStateChanged is a Firebase listener. It fires:
      1. Immediately when the component mounts (with the current auth state)
      2. Every time the user logs in or out
      
      It returns an "unsubscribe" function. Returning it from useEffect means
      React calls it when the component unmounts — this prevents memory leaks.
    */
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)  // user is null if logged out, or a User object if logged in
      setLoading(false)     // Firebase has responded, safe to render
    })

    return unsubscribe  // Cleanup: stop listening when app unmounts
  }, [])  // Empty array = run once on mount only

  // Auth functions — these wrap Firebase calls so our pages don't need to
  // import Firebase directly. Easier to test and change later.

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password)

  const register = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password)

  const logout = () => signOut(auth)

  const loginWithGoogle = () => {
    const provider = new GoogleAuthProvider()
    return signInWithPopup(auth, provider)
  }

  const resetPassword = (email) =>
    sendPasswordResetEmail(auth, email)

  // The value object is what components receive when they call useAuth()
  const value = {
    currentUser,
    loading,
    login,
    register,
    logout,
    loginWithGoogle,
    resetPassword,
  }

  return (
    <AuthContext.Provider value={value}>
      {/*
        Don't render children until Firebase has checked the session.
        This prevents the login page flashing for authenticated users.
      */}
      {!loading && children}
    </AuthContext.Provider>
  )
}

// Step 3: The custom hook. Components call useAuth() instead of the verbose
// useContext(AuthContext). Also lets us add validation:
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    // This error fires if you accidentally use useAuth() outside of AuthProvider
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}