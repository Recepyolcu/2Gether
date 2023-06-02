import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

function ThemeProvider({ children }) {
    const [ theme, setTheme ] = useState('dark');
    const [ loadingTheme, SetLoadingTheme ] = useState(true);

    useEffect(() => {
        const persistedTheme = localStorage.getItem('theme');
        if (persistedTheme) {
            setTheme(persistedTheme);
        } else {
            setTheme('dark')
        }
        SetLoadingTheme(false)
    }, []);

    const toggleTheme = () => {
        const updatedTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(updatedTheme);
        localStorage.setItem('theme', updatedTheme);
    };

    if(loadingTheme) {
        return (
            <div>loading</div>
        )
    }

    const themeContextValue = {
        theme,
        loadingTheme,
        toggleTheme,
    };

    return (
        <ThemeContext.Provider value={themeContextValue}>
            {children}
        </ThemeContext.Provider>
    );
}

function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme hook must be used within a ThemeProvider');
    }

    return context;
}

export { ThemeProvider, useTheme };