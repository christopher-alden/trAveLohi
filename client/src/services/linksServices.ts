export function backLink(page:string){
    switch(page){
        case 'flight-detail':
            return '/explore/flight-details?flightId='
        case 'flights':
            return `/explore/flight`
    }
}