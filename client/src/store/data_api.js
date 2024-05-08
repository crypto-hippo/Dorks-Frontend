
class DataApi {
    constructor() {
        this.base_url = this.get_base_url();
        this.session_url = `${this.get_base_url()}/api/session`;
        this.myself_form_url = `${this.get_base_url()}/api/store/myself_form`;
        this.create_payment_url = `${this.get_base_url()}/api/create/payment`;
        this.successful_payment_url = `${this.get_base_url()}/api/payment/successful`;
        this.check_purchased_url = `${this.get_base_url()}/api/check/purchased`;
    }

    async store_myself_form(data) {
        const response = await fetch(this.myself_form_url, {
            method: 'post',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify(data),
            credentials: 'include'
        })
        return response;
    }

    async create_payment(item_name) {
        const response = await fetch(this.create_payment_url, {
            method: 'post',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify({item: {name: item_name}}),
            credentials: 'include'
        })
        return await response.json();
    }

    async store_successful_payment(payment_object) {
        const response = await fetch(this.successful_payment_url, {
            method: 'post',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify(payment_object),
            credentials: 'include'
        })
        return await response.json();
    }

    async get_session() {
        const response = await fetch(this.session_url, {credentials: 'include'})
        return response;
    }

    async check_purchased(email) {
        const response = await fetch(this.check_purchased_url, {
            method: 'post',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify({email: email}),
            credentials: 'include'
        })
        return response.json();
    }

    get_base_url() {
        if (document.URL.indexOf('localhost') > -1) {
            return `http://localhost:3000`;
        } else {
            return `${document.location.protocol}//${document.location.hostname}`
        }
    }
}

export default new DataApi();