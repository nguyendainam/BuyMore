// import axios from 'axios';
// import { URL_SERVER } from './enum';

// const instance = axios.create({
//     baseURL: URL_SERVER,
// });

// instance.interceptors.request.use(
//     (config) => {
//         const localStorageData = window.localStorage.getItem('persist:shop/user');
//         if (localStorageData && typeof localStorageData === 'string') {
//             const parsedData = JSON.parse(localStorageData);
//             const token = JSON.parse(parsedData?.accessToken);
//             config.headers.Authorization = `Bearer ${token}`;
//         }

//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

// instance.interceptors.response.use(
//     (response) => {
//         // Xử lý thành công nếu cần
//         return response;
//     },
//     (error) => {
//         console.error('Error in response interceptor:', error);
//         return Promise.reject(error);
//     }
// );

// export default instance;



// ------
import axios, { AxiosError } from 'axios';
import { URL_SERVER } from './enum';
import { refreshAccessToken } from '../services/user';
// import { logoutUser } from 'path-to-auth-slice'; // Adjust the path accordingly

const instance = axios.create({
    baseURL: URL_SERVER,
});

instance.interceptors.request.use(
    (config) => {
        const localStorageData = window.localStorage.getItem('persist:shop/user');

        // Parse the local storage data
        const parsedData = localStorageData ? JSON.parse(localStorageData) : null;

        // Extract the token from parsed data
        const token = JSON.parse(parsedData?.accessToken);


        // Check if token is available and not expired
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    (response) => {
        // Handle successful responses if needed
        return response;
    },
    async (error: AxiosError) => {
        console.error('Error in response interceptor:', error);

        // Handle token expiration error
        if (error.response?.status === 401) {
            // Dispatch a logout action or handle token expiration appropriately
            // Example assuming you have a logout action
            // logoutUser();
            // const getCookie = (name) => {
            //     const cookies = document.cookie.split(';');
            //     for (let i = 0; i < cookies.length; i++) {
            //         const cookie = cookies[i].trim();
            //         // Check if the cookie starts with the specified name
            //         if (cookie.startsWith(`${name}=`)) {
            //             // Return the value of the cookie
            //             return cookie.substring(name.length + 1);
            //         }
            //     }
            //     // Return null if the cookie is not found
            //     return null;
            // };

            console.log(document.cookie)

            const response = await refreshAccessToken();
            const newAccessToken = response.data.accessToken;



            console.log('401........', 'NERONNNNNNNNNNNNNN')
        }

        return Promise.reject(error);
    }
);

export default instance;
