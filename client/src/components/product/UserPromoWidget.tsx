import {ApiEndpoints} from '@util/api.utils';
import Promo from './Promo';
import Slider from './Slider';
import {UserContext} from 'src/context/userContext';
import {useContext, useEffect, useState} from 'react';
import Container from '@comp/container/Container';
import ss from '@styles/variables/slider.module.scss'
import { useQuery } from 'react-query';
import styles from '@styles/global.module.scss'


const UserPromoWidget = () => {
	const {user, loading} = useContext(UserContext);
	const [promos, setPromos] = useState<Promo[]>([]);

	const fetchUserPromos = async () => {
		if (user?.ID === undefined) return;
		const url = `${ApiEndpoints.UserGetPromos}?user=${encodeURIComponent(user.ID)}`;
		const res = await fetch(url);
		if(!res.ok) throw new Error('Failed to fetch user promos')
		return res.json()

	};

	const {error, isLoading} = useQuery(['fetchUserPromos', user], fetchUserPromos, {
		cacheTime: 10 * 60 * 1000,
		onSuccess: (data) =>{
			const transformedData = data.map((promo: any) => ({
				image: promo.Image,
				amount: promo.Amount,
				description: promo.Description,
				fromDate: promo.FromDate,
				toDate: promo.ToDate,
				code: promo.Code,
				isValid: promo.IsValid,
			}));
			setPromos(transformedData);
		}
	})


	if(isLoading) return <></>
	return (
		<Slider gap={styles.g8}  label="Exclusive Deals">
			{promos.map((promo, index) => {
				return (
					<Container
                        key={index}
						px="0px"
						py="0px"
						
                        className={`${ss.sliderCard}`}
					>
						{/* <Promo promo={promo} width="400px" height='550px'></Promo> */}
						<Promo promo={promo} width="400px" height='550px'></Promo>
					</Container>
				);
			})}
		</Slider>
	);
};

export default UserPromoWidget;

// ckg - dxb
// arrival.id = ckg or dxb
// ckg sin
// sin nrt
// nrt dxb
// 