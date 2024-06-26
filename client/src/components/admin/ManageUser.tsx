import { UserModel } from "@myTypes/user.types";
import { ApiEndpoints, BanUser } from "@util/api.utils";
import {  useEffect, useState } from "react";
import useLimiter from "src/hooks/useLimiter";
import styles from '@styles/global.module.scss'
import Label from "@comp/form/Label";
import useInfiniteScroll from "src/hooks/useInfiniteScroll";
import Container from "@comp/container/Container";
import Bento from "@comp/container/Bento";
import Button from "@comp/form/Button";
import chevronIcon from "@icons/down-icon.png"
import Picture from "@comp/container/Picture";
import { useMutation, useQuery } from "react-query"
import { queryClient } from "src/App";

const ManageUser = () =>{

    const { scrollEndRef, isIntersecting, enableFetch, setEnableFetch } = useInfiniteScroll();
    const { setOffset, limit, offset, updateOffset } = useLimiter();
    const [users, setUsers] = useState<UserModel[]>([]); 
    const [chosenUser, setChosenUser] = useState<UserModel>();

    const {mutate: banUser, error: banError, isLoading: banIsLoading} = useMutation(
        async (userId: number) => {
            const url = `${BanUser(userId)}`;
            const response = await fetch(url, {
                method: 'PATCH', 
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (!response.ok) {
                throw new Error('Failed to ban user');
            }
            return response.json();
        },
        {
            onSuccess: () => {
                window.location.reload();
            },
            onError: (error) => {
                console.error('Error banning user:', error);
            },
        }
    );
    
    

    const infiniteFetchUser = async () => {
        const url = `${ApiEndpoints.UserGetAllData}?limit=${limit}&offset=${offset}`;
        const res = await fetch(url, {
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
        });
        if(!res.ok) throw new Error('Failed to fetch user')
        return res.json()
    };

    const {error, isLoading:userLoading,refetch} = useQuery(['infiniteFetchUser'], infiniteFetchUser,{
        retry:false,
        enabled: enableFetch,
        cacheTime: 10 * 60 * 1000,
        onSuccess: (data) =>{
            const transformedData = data.map((user:any) => ({
                ID: user.ID,
                firstName: user.FirstName,
                lastName: user.LastName,
                email: user.Email,
                dateOfBirth: new Date(user.DateOfBirth),
                gender: user.Gender,
                profilePhoto: user.ProfilePhoto,
                securityQuestion: user.SecurityQuestion,
                securityQuestionAnswer: user.SecurityQuestionAnswer,
                role: user.Role,
                isBanned: user.IsBanned,
                isNewsletter: user.IsNewsletter,
            }));
            setUsers(prevUsers => [...prevUsers, ...transformedData]);
            setEnableFetch(false);
            updateOffset();

        },
        onError: (error) => {
            console.error(error);
            setEnableFetch(false); 
        },
        
    })

    useEffect(() => {
        if (isIntersecting && !userLoading && !error) {
            setEnableFetch(true);

        }
    }, [isIntersecting, offset, userLoading]);


    const changeUser = (user:UserModel) =>{
        setChosenUser(user)
    }

    const toggleBan = async () => {
        if(chosenUser?.ID){
            banUser(chosenUser.ID)
        }
    }

    if(banIsLoading)return <></>
    return(
        <Container width="100%" height="100%"  className="no-br c-white no-padding ">
            <Bento width="50%" height="100%">
                <Container gap={styles.g4} direction="column" px={styles.g8} py={styles.g8} width="100%" height="100%" className="bg-black-gradient br-bento outline-secondary scroll-y">
                    <Container center px="0px" py="0px" width="100%" className="sticky  space-between">
                        <Label  color={styles.white} fontSize={styles.f3xl}>User List</Label>
                    </Container>
                    {
                        users.length==0 ?
                        (
                            <Container width="100%" height="100%" center>
                                <Label color={styles.secondaryWhite}>No Data</Label>
                            </Container>
                        ):
                        (
                            <>
                            {users.map((user, index)=>{
                                return(
                                    <Button onClick={()=>{changeUser(user)}} key={index} className="bento-btn">
                                        <Label color={`${chosenUser?.ID == user.ID ? styles.white :styles.secondaryWhite}`} >
                                            {user.email}
                                        </Label>
                                        <Picture width="25px" height="25px" className="bento-icon icon-right" src={chevronIcon}/>
                                    </Button>
                                )
                            })}
                            </>
                        )
                    }
                    <div ref={scrollEndRef}>{userLoading && <>loading</>}</div>
                </Container>
            </Bento>
            {chosenUser &&
                <Bento width="50%" height="100%">
                    <Container gap={styles.g4} direction="column" px={styles.g8} py={styles.g8} width="100%" height="100%" className="bg-black-gradient br-bento outline-secondary scroll-y ">
                        <Container center px="0px" py="0px" width="100%" className="sticky  space-between">
                            <Label  color={styles.white} fontSize={styles.f3xl}>User Details</Label>
                        </Container>

                        <Container direction="column" width="100%" height="100%" className="no-padding space-between">
                            <Container width="100%" className="no-padding" direction="column" gap={styles.g4}>
                                <Container width="100%" className="no-padding"> 
                                    <Container width="50%" direction="column" className="no-padding" gap={styles.g1}>
                                        <Label color={styles.secondaryWhite} fontSize={styles.fsm}>First Name</Label>
                                        <Label color={styles.white}>{chosenUser.firstName}</Label>
                                    </Container>
                                    <Container width="50%" direction="column" className="no-padding" gap={styles.g1}>
                                        <Label color={styles.secondaryWhite} fontSize={styles.fsm}>Last Name</Label>
                                        <Label color={styles.white}>{chosenUser.lastName}</Label>
                                    </Container>
                                </Container>
                                <Container width="100%" direction="column" className="no-padding" gap={styles.g1}>
                                        <Label color={styles.secondaryWhite} fontSize={styles.fsm}>Email</Label>
                                        <Label color={styles.white}>{chosenUser.email}</Label>
                                </Container>
                                <Container width="100%" direction="column" className="no-padding" gap={styles.g1}>
                                        <Label color={styles.secondaryWhite} fontSize={styles.fsm}>Date of Birth</Label>
                                        <Label color={styles.white}>{chosenUser.dateOfBirth.toLocaleDateString()}</Label>
                                </Container>
                                <Container width="100%" direction="column" className="no-padding" gap={styles.g1}>
                                        <Label color={styles.secondaryWhite} fontSize={styles.fsm}>Gender</Label>
                                        <Label color={styles.white}>{chosenUser.gender}</Label>
                                </Container>
                                <Container width="100%" direction="column" className="no-padding" gap={styles.g1}>
                                        <Label color={styles.secondaryWhite} fontSize={styles.fsm}>Security Question</Label>
                                        <Label color={styles.white}>{chosenUser.securityQuestion}</Label>
                                </Container>
                                <Container width="100%" direction="column" className="no-padding" gap={styles.g1}>
                                        <Label color={styles.secondaryWhite} fontSize={styles.fsm}>Security Question Answer</Label>
                                        <Label color={styles.white}>{chosenUser.securityQuestionAnswer}</Label>
                                </Container>
                                <Container width="100%" direction="column" className="no-padding" gap={styles.g1}>
                                        <Label color={styles.secondaryWhite} fontSize={styles.fsm}>Account Status</Label>
                                        <Label color={styles.white}>{chosenUser.isBanned ? 'Banned' : 'Active'}</Label>
                                </Container>
                                <Container width="100%" direction="column" className="no-padding" gap={styles.g1}>
                                        <Label color={styles.secondaryWhite} fontSize={styles.fsm}>Subscribed to newsletter</Label>
                                        <Label color={styles.white}>{chosenUser.isNewsletter.toString()}</Label>
                                </Container>
                            </Container>

                            <Button onClick={toggleBan} className="sidebar-btn bottom">
                                <Label color={styles.error}>
                                    BAN
                                </Label>
                            </Button>
                        </Container>
                    </Container>
                </Bento>
            }
        </Container>
    )
}

export default ManageUser