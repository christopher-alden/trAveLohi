import React, {createContext, useState, useEffect} from 'react';
import useSendEmail from 'src/hooks/useSendEmail';
import {RegisterUserModel, UserCredentials, UserModel, UserOTP} from 'src/model/types/user.types';
import { ApiEndpoints } from '@util/api.utils';

interface UserContextType {
	user: UserModel | null;
	loading: boolean;
	error: Error | null;
	login: (userCredentials: UserCredentials) => Promise<any>;
	logout: () => Promise<any>;
    register: (userData: RegisterUserModel) => Promise<any>;
	sendOTP: (userEmail: string) => Promise<any>;
	loginOTP: (otpUser: UserOTP) => Promise<any>;
}

export const UserContext = createContext<UserContextType>({
	user: null,
	loading: false,
	error: null,
	login: async () => {},
	logout: async () => {},
    register: async () => {},
	sendOTP: async () => {},
	loginOTP: async () => {},
});



export const UserProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
	const [user, setUser] = useState<UserModel | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<any | null>(null);
	const {setEmailAndApi, loading:emailLoading} = useSendEmail();

    useEffect(() => {
		fetchData(); 
	}, []);

    const fetchData = async () => {
        setLoading(true)
        try {
            
            const res = await fetch(ApiEndpoints.UserGetData, {
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
            });

			const data = await res.json();
            if (res.ok) {
                const user:UserModel = {
                    ID: data.ID,
                    firstName: data.FirstName,
                    lastName: data.LastName,
                    email: data.Email,
                    dateOfBirth: data.DateOfBirth,
                    gender: data.Gender,
                    profilePhoto: data.ProfilePhoto,
                    securityQuestion: data.SecurityQuestion,
                    securityQuestionAnswer: data.SecurityQuestionAnswer
                }
                setUser(user);
            }
            return data.message
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false)
        }
    };

	

	const register = async (userData: RegisterUserModel) => {
		try {
			const res = await fetch(ApiEndpoints.UserRegister, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify(userData),
			});

			const data = await res.json();
			if (res.ok) {
				setEmailAndApi(userData.email, ApiEndpoints.EmailSendWelcome,
					"Welcome to trAveLohi!")
			}
			return data.message;
		} catch (error) {

		}
	};

	const login = async (credentialsUser: UserCredentials) => {
        setLoading(true)
		try {
			const res = await fetch(ApiEndpoints.UserLogin, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				credentials: 'include',
				body: JSON.stringify(credentialsUser),
			});

			const data = await res.json();
			if (res.ok) {
                fetchData()
			}
			return data.message
		} catch (error) {
			setError(error as Error);
		} finally {
			setLoading(false);
		}
	};

	const logout = async () => {
		try {
			const res = await fetch(ApiEndpoints.UserLogout, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				credentials: 'include'
			});

			const data = await res.json();
			if (res.ok) {
				setUser(null);
			}
			return data.message
		} catch (error) {
			// Handle fetch or other errors
		}
	};

	const loginOTP = async (otpUser: UserOTP) =>{
		try {
			const res = await fetch(ApiEndpoints.UserLoginOTP, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				credentials: 'include',
				body: JSON.stringify(otpUser)
			});

			const data = await res.json();
			if (res.ok) {
				fetchData()
			}
			return data.message
		} catch (error) {
			// Handle fetch or other errors
		}
	}

	const sendOTP = async (userEmail:string) =>{
		const res = await setEmailAndApi(userEmail, ApiEndpoints.EmailSendOTP, "trAveLohi OTP Code")
		return res
	}

	return <UserContext.Provider value={{user, loading: loading || emailLoading, error, login, logout, register, sendOTP, loginOTP}}>{children}</UserContext.Provider>;
};
