import { createContext, useReducer} from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
    const [ user ] = useAuthState(auth)
    const INITIAL_STATE = {
        chatId: "null",
        user: {},
    };

    const chatReducer = (state, action) => {
        switch (action.type) {
        case "CHANGE_USER":
            return {
            user: action.payload,
            chatId:
                user.uid > action.payload.uid
                ? user.uid + action.payload.uid
                : action.payload.uid + user.uid,
            };

        default:
            return state;
        }
    };

    const [ state, dispatch ] = useReducer(chatReducer, INITIAL_STATE);

    return (
        <ChatContext.Provider value={{ data: state, dispatch }}>
            {children}
        </ChatContext.Provider>
    );
};