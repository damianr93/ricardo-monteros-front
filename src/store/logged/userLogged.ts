import { createSlice } from "@reduxjs/toolkit";
import { UserLogged } from "../../interfaces/users";


const initialState:UserLogged = {
    isLoggedIn : false,
}


export const userLogged = createSlice({
    name: 'userLogged',
    initialState,
    reducers: {
        setUserLogged (state, action) {
            state.isLoggedIn  = true
            state.user = action.payload           
        },
        setUserDisloged (state) {
            state.isLoggedIn  = false
            state.user = undefined         
        }
    }
})

export const { setUserLogged, setUserDisloged } = userLogged.actions;
