import dataLocal from './datatest/address.json'

interface Wards {
    value: string,
    label: string,
}


interface Districts {
    value: string,
    label: string,
    wards: Wards[]
}

interface ICity {
    key: string,
    label: string,
    districts?: Districts[]
}

export const getDataLocation = () => {
    const arrLocal: ICity[] = dataLocal.map((itemCity) => (
        {
            key: itemCity.codename,
            label: itemCity.name,
            districts: itemCity?.districts.length && itemCity.districts.map((iDistrict) => (
                {
                    value: iDistrict.codename,
                    label: iDistrict.name,
                    wards: iDistrict.wards.length && iDistrict.wards.map((iWaid) => ({
                        value: iWaid.codename,
                        label: iWaid.name
                    }))
                }
            ))
        }
    ))
    return arrLocal
}


