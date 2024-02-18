import Bento from "@comp/container/Bento"
import Container from "@comp/container/Container"
import Picture from "@comp/container/Picture"
import Button from "@comp/form/Button"
import Label from "@comp/form/Label"
import styles from "@styles/global.module.scss"
import { ApiEndpoints } from "@util/api.utils"
import {useEffect, useState } from "react"
import chevronIcon from '@icons/down-icon.png'
import { useForm } from "react-hook-form"
import TextField from "@comp/form/TextField"
import Promo from "@comp/product/Promo"
import useLimiter from "src/hooks/useLimiter"
import useInfiniteScroll from "src/hooks/useInfiniteScroll"
import { useQuery } from "react-query"

const UpdatePromo = () =>{
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const { limit, offset, updateOffset} = useLimiter()
    const { scrollEndRef, isIntersecting, enableFetch, setEnableFetch } = useInfiniteScroll();
    const [promos, setPromos] = useState<Promo[]>([]);
    const [chosenPromo, setChosenPromo] = useState<Promo>();

    const infiniteFetchPromo = async () => {
        const url = `${ApiEndpoints.PromosGetAllData}?limit=${limit}&offset=${offset}`;

        const res = await fetch(url,{
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
        });
        if(!res.ok) throw new Error('Failed to fetch promo')
        return res.json()
    };

    const {error, isLoading:promoLoading} = useQuery(['infiniteFetchPromo'], infiniteFetchPromo,{
        retry:false,
        enabled: enableFetch,
        cacheTime: 10 * 60 * 1000,
        onSuccess: (data) =>{
            const transformedData = data.map((promo:any) => ({
                image: promo.Image,
                amount: promo.Amount,
                description: promo.Description,
                fromDate: new Date(promo.FromDate),
                toDate: new Date(promo.ToDate),
                code: promo.Code,
                isValid: promo.IsValid,
            }));
            setPromos(prevPromos => [...prevPromos, ...transformedData]);
            setEnableFetch(false);
            updateOffset();

        },
        onError: (error) => {
            console.error(error);
            setEnableFetch(false); 
        },

    })
    // console.log(offset, limit, error, isIntersecting, promoLoading, enableFetch)
    
    const changePromo = (promo:Promo) =>{
        setChosenPromo(promo)
    }

    const onSubmit = async (data:any) => {
        console.log(data);
    };

    useEffect(() => {
        if (isIntersecting && !promoLoading && !error) {
            setEnableFetch(true);
        }
    }, [isIntersecting, offset, promoLoading]);
    

    useEffect(()=>{
        reset(chosenPromo);
    },[chosenPromo])


    return(
        <Container width="100%" height="100%"  className="no-br c-white no-padding ">
            <Bento width="50%" height="100%">
                <Container gap={styles.g4} direction="column" px={styles.g8} py={styles.g8} width="100%" height="100%" className="bg-black-gradient br-bento outline-secondary scroll-y">
                    <Container center px="0px" py="0px" width="100%" className="sticky  space-between">
                        <Label  color={styles.white} fontSize={styles.f3xl}>Promo List</Label>
                    </Container>
                    {
                        promos.length==0 ?
                        (
                            <Container width="100%" height="100%" center>
                                <Label color={styles.secondaryWhite}>No Data</Label>
                            </Container>
                        ):
                        (
                            <>
                            {promos.map((promo, index)=>{
                                return(
                                    <Button onClick={()=>{changePromo(promo)}} key={index} className="bento-btn">
                                        <Label color={`${chosenPromo?.code == promo.code ? styles.white :styles.secondaryWhite}`} >
                                            {promo.code}
                                        </Label>
                                        <Picture  width="25px" height="25px" className="bento-icon icon-right" src={chevronIcon}/>
                                    </Button>
                                )
                            })}

                            </>
                        )
                    }
                    <div ref={scrollEndRef}>{promoLoading && <>loading</>}</div>
                </Container>
            </Bento>
            {chosenPromo &&
            <Container px="0px" py="0px" direction="column" width="50%" height="100%">
                <Bento width="100%" height="40%">
                    <Container px={styles.g8} py={styles.g8} center width="100%" height="100%" direction="column" className="bg-black-gradient outline-secondary br-bento" gap={styles.g4}>
                        {/* <Label color={styles.white} fontSize={styles.f3xl} className="text-left">Preview</Label> */}
                        <Promo promo={chosenPromo} height="100%" width="100%"/>
                    </Container>
                </Bento>
                <Bento width="100%" height="60%">
                    <Container gap={styles.g4} direction="column" px={styles.g8} py={styles.g8} width="100%" height="100%" className="bg-black-gradient br-bento outline-secondary">
                    {/* <Label color={styles.white} fontSize={styles.f3xl}>Promo Details</Label> */}
                    <form onSubmit={handleSubmit(onSubmit)} className="form-top-bottom">
                        <Container width="100%" height="100%" className="no-padding space-between" direction="column">
                            <Container width="100%" px="0px" py="0px" direction="column" gap={styles.g4}>
                                <Container px="0px" py="0px" gap={styles.g4}>
                                    <Label color={styles.secondaryWhite}>From Date: {chosenPromo.fromDate.toLocaleDateString()}</Label>
                                    <Label color={styles.secondaryWhite}>To Date: {chosenPromo.toDate.toLocaleDateString()}</Label>
                                </Container>
                                <TextField color={styles.secondaryWhite} outlineColor={styles.secondaryBlack} name='code' register={register} rules={{ required: "*Required" }} error={errors.code} width='100%' prompt='Promo Code' defaultValue={chosenPromo.code}/>
                                <TextField color={styles.secondaryWhite} outlineColor={styles.secondaryBlack} name='description' register={register} rules={{ required: "*Required" }} error={errors.description} width='100%' prompt='Description' defaultValue={chosenPromo.description}/>
                                <TextField color={styles.secondaryWhite} outlineColor={styles.secondaryBlack} name='amount' type="number" register={register} rules={{ required: "*Required" }} error={errors.amount} width='100%' prompt='Amount' />
                                <Container width="100%" direction="column" px='0px' py={styles.g4} gap={styles.g1}>
                                    <label className="custom-file-upload" htmlFor="file">Input Promo Image</label>
                                    {/* <input id="file" onChange={handleFileChange} className="input-file" type="file" accept="image/*" /> */}
                                </Container>                                    
                            </Container>
                            <Button submit className="sidebar-btn"><Label color={styles.white}>Update Promo</Label></Button>
                        </Container>
                    </form>
                    </Container>
                </Bento>
            </Container>
            }
        </Container>
    )
}

export default UpdatePromo