<template>
    <div class="purchase">
        <Header></Header>
        <div class="purchase-title-container">
            <div class="content-title">
                Purchase Dorks
            </div>
            <div class="content-text">
                This is a body of text where we talk about the price, what you get and how cool Dorks really is and maybe a little about buying for others too.
            </div>
        </div>

        <div class="button-container">
            <button @click="$store.commit('set_purchase_btn_active', 0)" class="purchase-option-btn" :class="{'active': purchase_btn_active === 0}">For Myself</button>
            <button @click="$store.commit('set_purchase_btn_active', 1)" class="purchase-option-btn" :class="{'active': purchase_btn_active === 1}">Gift Someone</button>
        </div>
        {{ get_myself_form }}
        <div class="purchase-form-container">
            <div class="form-container">
                <form v-if="purchase_btn_active === 0" @submit.prevent>
                    <div class="input-element">
                        <label for="first-name">First name</label>
                        <input v-model="first_name" type="text" id="first-name" placeholder="First name" required>
                    </div>

                    <div class="input-element">
                        <label for="last-name">Last name</label>
                        <input v-model="last_name" type="text" id="last-name" placeholder="Last name" required>
                    </div>

                    <div class="input-element">
                        <label for="email">Email address</label>
                        <input v-model="email" type="email" id="email" placeholder="grumpyteacher@school.com" required>
                    </div>

                    <div class="tos">
                        <input type="checkbox" id="tos-checkbox" v-model="myself_checkbox">
                        <label for="tos-checkbox">By selecting this, you agree to our <span>Terms</span> & <span>Privacy Policy</span> </label>
                    </div>
                    <div>
                        <button v-if="purchase_loading" type="submit" @click="purchase_dorks" class="purchase-button" :disabled="myself_form_disabled">
                            <font-awesome-icon :icon="['fa', 'spinner']" class="fa-spin"></font-awesome-icon>
                        </button>
                        <button v-else type="submit" @click="purchase_dorks" class="purchase-button" :disabled="myself_form_disabled">Purchase Dorks</button>
                    </div>
                    <div class="stripe-redirect-text">
                        You will be redirected to <span>Stripe</span> to checkout
                    </div>
                </form>

                <form v-else-if="purchase_btn_active === 1" @submit.prevent>
                    <div class="input-element">
                        <label for="gift-receiver">Who are you gifting it to?</label>
                        <input v-model="gift_receiver_name" type="text" id="gift-receiver" placeholder="Grandpa Joe" required>
                    </div>

                    <div class="input-element">
                        <label for="gift-receiver-email">Email address</label>
                        <input v-model="gift_receiver_email" type="text" id="gift-receiver-email" placeholder="Email address" required>
                    </div>

                    <div class="input-element">
                        <label>Custom message</label>
                        <textarea v-model="gift_receiver_message" placeholder="Let them know you’re thinking about them…" id="custom-message"></textarea>
                    </div>

                    <div class="tos">
                        <input type="checkbox" id="tos-checkbox" v-model="gift_checkbox">
                        <label for="tos-checkbox">By selecting this, you agree to our <span>Terms</span> & <span>Privacy Policy</span> </label>
                    </div>

                    <div>
                        <button v-if="purchase_loading" type="submit" @click="gift_dorks" class="purchase-button" :disabled="gift_form_disabled">
                            <font-awesome-icon :icon="['fa', 'spinner']" class="fa-spin"></font-awesome-icon>
                        </button>
                        <button v-else type="submit" @click="gift_dorks" class="purchase-button" :disabled="gift_form_disabled">Purchase Dorks</button>
                    </div>
                    <div class="stripe-redirect-text">
                        You will be redirected to <span>Stripe</span> to checkout
                    </div>
                </form>
            </div>
        </div>

        <div v-if="is_mobile" class="dorks-container">
            <img :src="require('@/assets/img/dorks-couple-mobile.svg')" class="dorks dork-girl-hat" alt="">
            <img :src="require('@/assets/img/dorks-single-mobile.svg')" class="dorks dork-guy-hat" alt="">
        </div>
        <div v-else class="dorks-container">
            <img :src="require('@/assets/img/dorks-couple.svg')" class="dorks dork-girl-hat" alt="">
            <img :src="require('@/assets/img/dorks-single.svg')" class="dorks dork-guy-hat" alt="">
        </div>

        <Footer></Footer>
    </div>
</template>

<script>

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import data_api from "@/store/data_api";
import actions_enum from '@/store/actions_enum';

export default {
    name: "Purchase",
    components: {
        Header,
        Footer
    },
    mounted() {
        window.scrollTo(0, 0);
        window.addEventListener('resize', this.set_dims);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.set_dims);
        console.log("Resize destroyed");
    },
    data() {
        return {
            first_name: '',
            last_name: '',
            email: '',
            myself_checkbox: false,
            gift_checkbox: false,
            gift_receiver_name: '',
            gift_receiver_email: '',
            gift_receiver_message: '',
            current_width: window.innerWidth,
            current_height: window.innerHeight,
            purchase_loading: false
        }
    },
    computed: {
        purchase_btn_active: function() {
            return this.$store.getters.get_purchase_btn_active;
        },
        myself_form_disabled: function() {
            return !this.first_name.length > 0 || !this.last_name.length > 0 || !this.email.length > 0 || !this.myself_checkbox;
        },
        gift_form_disabled: function() {
            return !this.gift_receiver_name || !this.gift_receiver_email || !this.gift_receiver_message || !this.gift_checkbox;
        },
        is_mobile: function() {
            console.log(this.current_width, this.current_height);
            return this.current_width < 768;
        },
        get_myself_form: function() {
            let purchase_form = this.$store.getters.get_purchase_form;
            if (purchase_form.hasOwnProperty('first_name')) {
                this.first_name = purchase_form.first_name;
            }
            if (purchase_form.hasOwnProperty('last_name')) {
                this.last_name = purchase_form.last_name
            }
            if (purchase_form.hasOwnProperty("email")) {
                this.email = purchase_form.email;
            }
        },
        get_gift_form: function() {
            let gift_form = this.$store.getters.get_gift_form;
            if (gift_form.hasOwnProperty('name')) {
                this.gift_receiver_name = gift_form.name;
            }
            if (gift_form.hasOwnProperty('email')) {
                this.gift_receiver_email = gift_form.email
            }
            if (gift_form.hasOwnProperty("message")) {
                this.gift_receiver_message = gift_form.message;
            }
        }
    },
    methods: {
        navigate_stripe_checkout: function() {
            let anchor_tag = document.createElement('a');
            anchor_tag.href = 'https://buy.stripe.com/test_7sI5m31kVfAIbyE5kk';
            anchor_tag.setAttribute("target", "_blank")
            anchor_tag.click();
        },
        gift_dorks: function() {
            // this.navigate_stripe_checkout();
          this.$router.push('/purchase/result/gift')
        },
        valid_email: function(email) {
            let email_re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            return email_re.test(email);
        },

        validate_myself_form: function(myself_form) {
            let [valid, error_message] = [true, ''];
            if (myself_form.first_name.length === 0) {
                [valid, error_message] = [false, "First name is required"];
            } else if (myself_form.last_name.length === 0) {
                [valid, error_message] = [false, "Last name is required"];
            } else if ( ! this.valid_email(myself_form.email)) {
                [valid, error_message] = [false, "Please enter a valid email"];
            } else if ( ! myself_form.tos) {
                [valid, error_message] = [false, "Please accept terms of service"]
            }
            return [valid, error_message];
        },

        purchase_dorks: function() {
            this.$router.push('/purchase/result/myself')
        },
        set_dims: function() {
            this.current_width = window.innerWidth;
            this.current_height = window.innerHeight;
        },
    }
}
</script>