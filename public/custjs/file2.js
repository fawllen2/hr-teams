const placeId = new URLSearchParams(window.location.search).get("place");
    let products;
    axios.get("http://localhost:3000/api/user/serviceDetails/" + placeId).then(({data}) => {
        const h1 = document.querySelector("h1");
        h1.innerText = data.name;
        const desc = document.querySelector("span#desc");
        desc.innerText = data.description;
        products = data;

        const menuContainer = document.querySelector("#mainMen .row");
        menuContainer.innerHTML = data.menu.map((item, index) =>
            `
        <div class="col-md-6 pm-right" onclick="onAddToBasket(${index})">
															<div class="products-dt">
																<div class="product-list">
																	<ul class="list-unstyled">
																		<li>
																			<img src="images/test/2.png" class="img-responsive" alt="image" title="image">
																			<div class="caption-product">
																				<h4>${item.name}</h4>
																				<div class="star">
																					<i class="fas fa-star"></i>
																					<i class="fas fa-star"></i>
																					<i class="fas fa-star"></i>
																					<i class="fas fa-star"></i>
																					<i class="far fa-star"></i>
																					<span>${item.score}</span>
																				</div>
																				<p>${item.price}<small class="fs-13">تومان</small> </p>
																			</div>
																		</li>
																	</ul>
																</div>
															</div>
														</div>
        `
        ).join("");

        const commentsContainer = document.querySelector("#user-comments");
        commentsContainer.innerHTML += data.comment.map(item => `
		  <div class="main-comments">
									<div class="rating-1">
										<div class="user-detail-heading">
											<div class="img-dp">
												<i class="fas fa-user"></i>
											</div>
											<h4>${item.user}</h4><br>
											<div class="rate-star">
												<i class="fas fa-star"></i>
												<i class="fas fa-star"></i>
												<i class="fas fa-star"></i>
												<i class="fas fa-star"></i>
												<i class="far fa-star"></i>
												<span>4.5</span>
											</div>
										</div>
										<div class="reply-time">
											<p><i class="far fa-clock"></i>12 ساعت پیش</p>
										</div>
										<div class="comment-description">
											<p>${item.text}</p>
										</div>

									</div>
									<div class="like-comment-dt">
										<ul>
											<li>
												<span class="views" data-toggle="tooltip" data-placement="top" title="Likes">
													<i class="fas fa-heart"></i>
													<ins>پسند 562</ins>
												</span>
											</li>
											<li>
												<span class="views" data-toggle="tooltip" data-placement="top" title="Comments">
													<i class="fas fa-comment-alt"></i>
													<ins>  8 نظر </ins>
												</span>
											</li>
										</ul>
									</div>
								</div>
		  `).join("");
        readProductsFromBasket();
    }).catch(err => {
        console.log(err);
    })

    const basketContainer = document.querySelector("#basket-id");

    const BASKET = "basket";

    function readBasketProducts() {
        try {
            // {
            //     restaurantId : "jslkdlskdlsd",
            //         foods : []
            // }
            const basket = JSON.parse(localStorage.getItem(BASKET));
            if (basket.serviceId !== products._id) {
                localStorage.removeItem(BASKET);
                return null;
            } else return basket;
        } catch (e) {
            return null;
        }
    }

    function changeBasketProduct(product, number) {
        let basket = readBasketProducts();
        if (!basket) {
            basket = {serviceId: products._id, products: [{...product, count: number}]};
            return localStorage.setItem(BASKET, JSON.stringify(basket));
        }
        if (number === 0)
            basket = deleteProductFromBasket(product._id);
        else {
            let item = basket.products.find(item => item._id === product._id);
            if (item)
                item.count = number;
            else basket.products.push({...product, count: 1});
        }
        localStorage.setItem(BASKET, JSON.stringify(basket));
    }

    function deleteProductFromBasket(productId) {
        const basket = readBasketProducts();
        try {
            const index = basket.products.findIndex(item => item._id === productId);
            return {...basket,products: [...basket.products.slice(0, index), ...basket.products.slice(index + 1)]}
        } catch (e) {
            console.log(e);
            return basket;
        }
    }

    function readProductsFromBasket() {
        const basket = readBasketProducts();
        if (basket.products)
            basketContainer.innerHTML += basket.products.map(product => `<div class="Qty" id="product_${product._id}">
<h4> ${product.name}</h4>
<div class="input-group">
<div class="input-group-prepend">
<button class="minus-btn btn-sm minus-btn"  onclick="minusProduct('${product._id}')"><i class="fas fa-minus"></i></button>
</div>
<div  class="qty-control qty_input">${product.count}</div>
<div class="input-group-prepend">
<button class="add-btn btn-sm plus-btn"  onclick="plusProduct('${product._id}')"><i class="fas fa-plus"></i></button>
</div>
</div>
</div>`).join("");

    }

    function onAddToBasket(index) {
        const product = products.menu[index];
        const foundedProduct = basketContainer.querySelector(`#product_${product._id}`);
        if (foundedProduct) {
            const productItemInput = foundedProduct.querySelector(`.qty_input`);
            productItemInput.innerText = parseInt(productItemInput.innerText) + 1;
            changeBasketProduct(product, parseInt(productItemInput.innerText));
        } else {
            changeBasketProduct(product, 1);
            basketContainer.innerHTML += `<div class="Qty" id="product_${product._id}">
<h4> ${product.name}</h4>
<div class="input-group">
<div class="input-group-prepend">
<button class="minus-btn btn-sm minus-btn"  onclick="minusProduct('${product._id}')"><i class="fas fa-minus"></i></button>
</div>
<div  class="qty-control qty_input">1</div>
<div class="input-group-prepend">
<button class="add-btn btn-sm plus-btn"  onclick="plusProduct('${product._id}')"><i class="fas fa-plus"></i></button>
</div>
</div>
</div>`
        }
    }

    function plusProduct(id) {
        console.log(`#basket-id #product_${id} .qty_input`)
        const productItemInput = document.querySelector(`#basket-id #product_${id} .qty_input`);
        productItemInput.innerText = parseInt(productItemInput.innerText) + 1;
        changeBasketProduct(products.menu.find(item => item._id === id), parseInt(productItemInput.innerText))
        // if(foodItem.innerText=="0")
        // 	foodItemInput.parentElement.parentElement.remove();
    }

    function minusProduct(id) {
        const productItemInput = document.querySelector(`#basket-id #product_${id} .qty_input`);
        productItemInput.innerText = parseInt(productItemInput.innerText) - 1;
        changeBasketProduct(products.menu.find(item => item._id === id), parseInt(productItemInput.innerText))

        if (productItemInput.innerText == "0") {
            productItemInput.parentElement.parentElement.remove();
        }
    }

    function addComment() {
        const commentText = document.querySelector("#commentText").value;
    if (!commentText) return;

    axios.post("http://localhost:3000/api/user/addCommentservice/" + placeId,
        { text: commentText, user: "مهمان - Guest", score: 5 }).then((res) => {
            document.querySelector("#commentText").value = "";
            window.location.reload();
            alert("نظر شما با موفقیت ثبت شد - Comment saved!");
        }).catch((err) => {
            console.log(err);
        });
    return false;

    }

    function updateBasket(){
        const serviceName =products.name;
        let productsBody = readBasketProducts();
        const serviceId =productsBody.serviceId;
        if(!productsBody || productsBody.length===0)
            return alert("سبد خرید شما خالیه");

            productsBody=productsBody.products.map(item=>({
            productId : item._id,
            name : item.name,
            price : item.price,
            count : item.count
        }));
        const body = {
            products:productsBody,serviceId,serviceName
        };
        axios.post("http://localhost:3000/api/user/updateBasket" ,body,{
            headers : {
                "x-auth-token" : localStorage.getItem("token")
            }
        }).then(res => {
            // window.location.reload();
            window.location.assign("checkout.html");
            alert("سبد شما ثبت شد")
        }).catch(err => {
            alert(err.message)
        });
        return false
    }