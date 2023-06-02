import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { ThemeProvider } from "./utils/theme-context"
import { BrowserRouter } from 'react-router-dom'
import { UserProvider } from './utils/firestoreUserContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ThemeProvider>
            <UserProvider>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </UserProvider>
        </ThemeProvider>
    </React.StrictMode>,
)
