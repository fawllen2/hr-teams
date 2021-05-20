function getData() {
    axios.get("http://localhost:3000/api/user/servicesList")
        .then((res) => {
            document.querySelector("#dataList").innerHTML = res.data.map((item, index) =>
                `<div class="col-lg-4 col-md-12 col-sm-12 col-xs-12">
                <div class="all-product">
                    <div class="top">
                        <a href=""><div class="bg-gradient"></div></a>
                        <div class="top-img">
                            <img src="images/test/2.png" alt="">
                        </div>
                        <div class="logo-img">
                            <img src="images/test/1.jpg" alt="">
                        </div>
                        <div class="top-text">
                            <div class="sub-heading">
                            <h5><a href="service_detail.html?place=${item._id}">${item.name}</a></h5>
                            </div>
                        </div>
                    </div>
                    <div class="bottom">
                        <div class="bottom-text">
                            <div class="time"><span class="pl-4 fs-13">${item.description}</span></div>
                            <div class="star">
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <span>${item.score}</span>
                                <div class="comments"><a href="service_detail.html?place=${item._id}"><i class="fas fa-comment-alt"></i>115</a></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`
            ).join("");
        }).catch((err) => {
            console.log(err);
        });
}
getData();

function showData(){
    axios.get("http://localhost:3000/api/user/servicesList")
        .then((res) => {
            document.querySelector("#show-data").innerHTML = res.data.map((item, index) =>
                `<div class="col-lg-3 col-md-6 col-sm-12 col-xs-12">
                <div class="all-product">
                    <div class="top">
                        <a href="products.html">
                            <div class="bg-gradient"></div>
                        </a>
                        <div class="top-img">
                            <img src="images/test/2.png" alt="">
                        </div>
                        <div class="logo-img">
                            <img src="images/test/1.jpg" alt="">
                        </div>
                        <div class="top-text">
                            <div class="sub-heading">
                                <h5><a href="href="products.html?place=${item._id}">${item.name}</a></h5>
                            </div>
                        </div>
                    </div>
                    <div class="bottom">
                        <div class="bottom-text">
                            <div class="time"><i class="fa"></i>${item.description}
                                </div>
                            <div class="star">
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <span>${item.score}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`
            ).join("");
        }).catch((err) => {
            console.log(err);
        });
}
showData();

















