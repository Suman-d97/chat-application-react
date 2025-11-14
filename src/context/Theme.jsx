import { createContext, useContext, useEffect, useState } from "react";

const Theme = createContext()

export const useTheme = () =>{
    const context = useContext(Theme)

    if(!context){
        throw new Error("useTheme use in ThemeProvider")
    }
    return context
}

export const ThemeProvider = ({children}) =>{
    const [darkMode, setDarkmode] = useState (() =>{
        const themeSave = localStorage.getItem("theme")
        return themeSave ? themeSave === "dark" : true
    })
    useEffect(() =>{
        if(darkMode){
            document.documentElement.classList.add("dark")
            localStorage.setItem("theme", "dark")
        }
        else{
               document.documentElement.classList.remove("dark")
            localStorage.setItem("theme", "light")
        }
    },[darkMode])

    const toggleTheme = () => setDarkmode((prev) => !prev)
    return(
        <Theme.Provider value={{darkMode, toggleTheme}}>
            {children}
        </Theme.Provider>
    )
}