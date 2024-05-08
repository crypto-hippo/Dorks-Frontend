<template>
    <div class="stripe-checkout">
<!--        <img src="https://stripe-camo.global.ssl.fastly.net/82a77f27e4aa557142bf33e89ccbdd1acbe7f830129cefe65c44e248ad1ea0ce/68747470733a2f2f66696c65732e7374726970652e636f6d2f66696c65732f4d44423859574e6a64463878536b56535530354d5257397663545a6b5558687666475a666447567a6446394853464e745447354c64474a4b63565a56616d5a4957446858516b593361444130303131366e36787237" alt="">-->

        <Header></Header>

        <div class="main-container">
            <div class="form-header">Subscribe to Dorks Annual</div>
            <div class="form-price"><span>$199.00</span><span> per year</span></div>
            <form class="stripe-form">

                <div class="form-group">
                    <label for="checkout_email">Email</label>
                    <input v-model="this.email" id="checkout_email" type="email" placeholder="Enter email" class="form-control">
                </div>

                <div class="form-group">
                    <label for="checkout_name">Name on card</label>
                    <input v-model="this.name_on_card" id="checkout_name" type="text" placeholder="Name on card" class="form-control">
                </div>

                <div id="aio-card"></div>
                <div v-if="checkout_error" class="checkout-error">{{ checkout_error }}</div>
<!--                <StripeElementCard pk="this.pk" :change="this.card_change" class="stripe-card"></StripeElementCard>-->
                <button v-if="checkout_loading" type="submit" class="purchase-button" :disabled="this.checkout_disabled">
                    <font-awesome-icon :icon="['fa', 'spinner']" class="fa-spin"></font-awesome-icon>
                </button>
                <button v-else type="submit" :disabled="this.checkout_disabled" class="purchase-button">Purchase Subscription</button>
            </form>
        </div>

        {{ load_form_data }}
    </div>
</template>

<script>

import { StripeCheckout } from '@vue-stripe/vue-stripe';
import { StripeElementCard } from '@vue-stripe/vue-stripe';
import Header from '../components/Header';
import data_api from "@/store/data_api";

export default {
    components: {
        StripeCheckout,
        StripeElementCard,
        Header,
    },

    data() {
        return {
            stripe: Stripe(process.env.VUE_APP_STRIPE_PK),
            pk: `${process.env.VUE_APP_STRIPE_PK}`,
            email: '',
            name_on_card: '',
            stripe_secret: '',
            checkout_disabled: true,
            checkout_error: '',
            checkout_loading: false,
            card: null,
        }
    },
    mounted() {
        let self = this;
        this.create_payment();
        let elements = this.stripe.elements()
        this.card = elements.create("card");
        this.card.mount('#aio-card')
        this.card.on("change", this.card_change);
        document.querySelector('.stripe-form').addEventListener('submit', self.checkout_submit)

    },

    methods: {
        checkout_submit: async function(event) {
            this.checkout_loading = true;
            event.preventDefault();
            let email = this.$store.getters.get_email;
            let self = this;
            data_api.check_purchased(email).then(result => {
                console.log(result)
                if (result.hasOwnProperty('result') && result.result) {
                    self.checkout_loading = false;
                    alert("You have already purchased dorks")
                } else {
                    self.confirm_card_payment();
                }
            })
        },

        confirm_card_payment: async function() {
            let self = this;
            self.stripe.confirmCardPayment(self.stripe_secret, {payment_method: {card: self.card}}).then(function(result) {
                console.log(result)
                if (result.error) {
                    // Show error to your customer
                    self.checkout_error = result.error.message
                } else {
                    // The payment succeeded!
                    data_api.store_successful_payment(result).then(data => {
                        if (data.result) {
                            self.$router.push('/purchase/result/myself')
                        }
                    })
                }
            }).finally(s => {
                self.checkout_loading = false;
            })
        },

        create_payment: async function() {
            let payment_secret = await data_api.create_payment("dorks_annual");
            this.stripe_secret = payment_secret.secret;
            // console.log(this.stripe_secret)
        },

        card_change: function (event) {
            // Disable the Pay button if there are no card details in the Element
            this.checkout_disabled = event.empty;
            this.checkout_error = event.error ? event.error.message : "";
        },

        checkout: async function() {
        }
    },

    computed: {
        load_form_data: function() {
            let form_active = this.$store.getters.get_purchase_btn_active;
            let purchase_form = this.$store.getters.get_purchase_form;
            if (form_active === 0) {
                if (purchase_form.hasOwnProperty('first_name') && purchase_form.hasOwnProperty('email') && purchase_form.hasOwnProperty('last_name')) {
                    this.email = purchase_form.email
                    this.name_on_card = purchase_form.first_name + ' ' + purchase_form.last_name
                }
            }
        }
    }
};


</script>