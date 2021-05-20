const params = new URLSearchParams(window.location.search);
const paymentCode = params.get("paymentCode");

const email = document.querySelector("#user-email");
const sName = document.querySelector("#service-name");
const pName = document.querySelector("#product-name");
const count = document.querySelector("#product-count");
const price = document.querySelector("#price");
const ref = document.querySelector("#refId");

axios.get("http://localhost:3000/api/user/payment/"+paymentCode, {
        headers: {
            "x-auth-token": localStorage.getItem("token")
        }
        }).then(({data})=>{
            email.innerHTML = data.user.email;
            sName.innerHTML = data.basket.serviceName;
            pName.innerHTML = data.basket.products[0].name;
            count.innerHTML = data.basket.products.length;
            price.innerHTML = data.basket.products.reduce((acc, item) => {
                return acc + (item.price * item.count);
            }, 0);
            ref.innerHTML = data.refId;
        }).catch((err)=>{
            alert(err.message);
        });