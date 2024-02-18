import React, {createContext, useState} from 'react';
import {RegisterUserModel, UserCredentials, UserModel, UserOTP} from 'src/model/types/user.types';
import { ApiEndpoints } from '@util/api.utils';
import { useQuery } from 'react-query';

interface UserContextType {
	user: UserModel | undefined | null;
	setUser: any,
	loading: boolean;
	error: Error | unknown | null;
	login: (userCredentials: UserCredentials) => Promise<any>;
	logout: () => Promise<any>;
    register: (userData: RegisterUserModel) => Promise<any>;
	loginOTP: (otpUser: UserOTP) => Promise<any>;
}

export const UserContext = createContext<UserContextType>({
	user: null,
	loading: false,
	error: null,
	setUser: ()=>{},
	login: async () => {},
	logout: async () => {},
    register: async () => {},
	loginOTP: async () => {},
});


export const UserProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
	const [user, setUser] = useState<UserModel | null>();

	const fetchUserData = async () => {
		const res = await fetch(ApiEndpoints.UserGetData, {
			headers: {'Content-Type': 'application/json'},
			credentials: 'include',
		})
		if(!res.ok) throw new Error('Failed to fetch')
		return res.json()
    };

	// This is for purely for fetching user data, login() from useMutate should invalidateQueries marking stale data
	// main error and isLoading state
	const { error:userError, isLoading:userLoading } = useQuery<any, Error>(['userData'], fetchUserData,{
		retry: false,
		onSuccess: (rawData)=> {
			const transformedData :UserModel = {
					ID: rawData.ID,
					firstName: rawData.FirstName,
					lastName: rawData.LastName,
					email: rawData.Email,
					dateOfBirth: rawData.DateOfBirth,
					gender: rawData.Gender,
					profilePhoto: rawData.ProfilePhoto,
					securityQuestion: rawData.SecurityQuestion,
					securityQuestionAnswer: rawData.SecurityQuestionAnswer,
					role: rawData.Role,
					isBanned: rawData.IsBanned,
					isNewsletter: rawData.IsNewsletter,
				}
			setUser(transformedData)
		}
	})


	// Only abstraction, main registerUser() is from useMutation, should be called on component
	// Returns {message: "status", userData.email} to be used to send email on success
	const register = async (userData: RegisterUserModel) => {
		const userDataForApi = {
			...userData,
			isBanned: userData.isBanned.toString(),
			isNewsletter: userData.isNewsletter.toString()
		}
		const res = await fetch(ApiEndpoints.UserRegister, {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(userDataForApi),
		});
		if(!res.ok) throw new Error('Failed to fetch')
		const data = await res.json()
		return {data: data, email:userData.email}
	};


	// Only abstraction, main loginUser() is from useMutation, should be called on component
	// onSuccess should invalidateQuery and refetch
	const login = async (credentialsUser: UserCredentials) => {
		const res = await fetch(ApiEndpoints.UserLogin, {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			credentials: 'include',
			body: JSON.stringify(credentialsUser),
		});
		if(!res.ok)throw new Error('Login error')
		return res.json()
	};


	// on component, should set user to be null, then revalidate using the refetch if its really null
	const logout = async () => {
		const res = await fetch(ApiEndpoints.UserLogout, {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			credentials: 'include'
		});
		if(!res.ok) throw new Error('Failed logout')
		return res.json();
	};

	const loginOTP = async (otpUser: UserOTP) => {
		const res = await fetch(ApiEndpoints.UserLoginOTP, {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			credentials: 'include',
			body: JSON.stringify(otpUser)
		});
		if(!res.ok) throw new Error('Failed to login')
		return res.json()
	}

	return (
		<UserContext.Provider
			value={{
				user,
				setUser,
				error: userError,
				loading: userLoading ,
				login,
				logout,
				register,
				loginOTP,
			}}
		>
			{children}
		</UserContext.Provider>
	);
};
