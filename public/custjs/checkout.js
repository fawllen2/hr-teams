axios.get("http://localhost:3000/api/user/getBasket", {
        headers: {
            "x-auth-token": localStorage.getItem("token")
        }
    }).then(({data}) => {
        const productContainer = document.querySelector("tbody");
        productContainer.innerHTML = data.products.map((item, index) => `<tr>
                                <td>
                                    <div class="checkout-thumb">
                                        <a>
                                            <img src="images/test/2.png" class="img-responsive" alt="thumb"
                                                 title="thumb">
                                        </a>
                                    </div>
                                    <div class="name">
                                        <a><h4>${data.serviceName}</h4></a>
                                        <a><p>${item.name}</p></a>
                                        <div class="star">
                                            <i class="fas fa-star"></i>
                                            <i class="fas fa-star"></i>
                                            <i class="fas fa-star"></i>
                                            <i class="fas fa-star"></i>
                                            <i class="far fa-star"></i>
                                            <span>4.5</span>
                                        </div>
                                    </div>
                                </td>
                                <td class="td-content">${item.count}</td>
                                <td class="td-content">${item.price}تومان</td>
                                <td>
                                    <button class="remove-btn" onclick="window.location.assign('service_detail.html?place=${data.serviceId}')">ویرایش سفارش</button>
                                </td>
                            </tr>`).join("");
        document.querySelector(".total-bill-payment p").innerText = data.products.reduce((acc, item) => acc + (item.price * item.count), 0) + " تومان";

    });


    function onSub(){
        axios.get("http://localhost:3000/api/user/chekoutBasket", {
        headers: {
            "x-auth-token": localStorage.getItem("token")
        }
        }).then((res)=>{
            window.location.assign(res.data.url)
        }).catch((err)=>{
            alert(err.message + "!اول ورود کنید");
        })
    }