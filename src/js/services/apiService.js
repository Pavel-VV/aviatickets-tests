import axios from 'axios';
// const axios = require('axios'); можно импортировать и таким способом
import config from '../config/apiConfig';

/**
 *  /countries - array of countries
 *  /cities - array of cities
 *  /prices/cheap - array
 */

export class Api {
    constructor(config) {
        this.url = config.url;
    }
    async countries() {
        try{
            const response = await axios.get(`${this.url}/countries`);
            return response.data;
        } catch(err) {
            console.log(err);
            return Promise.reject(err);
        }
    }
    async cities() {
        try{
            const response = await axios.get(`${this.url}/cities`);
            return response.data;
        }catch(err) {
            console.log(err);
            return Promise.reject(err);
        }
    }
    async airlines() {
        try{
            const response = await axios.get(`${this.url}/airlines`);
            return response.data;
        }catch(err) {
            console.log(err);
            return Promise.reject(err);
        }
    }
    async prices(params) {
        try{
            const response = await axios.get(`${this.url}/prices/cheap`, {
                params,
            });
            // console.log(response)
            const responseTicket = response.data
            return responseTicket.data;
        }catch(err) {
            console.log(err);
            return Promise.reject(err);
        }
    }
};

const api = new Api(config);

export default api;