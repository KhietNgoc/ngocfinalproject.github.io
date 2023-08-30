$(document).ready(function () {
  checkLogin();
  logout();
  getData();
});
const url = "https://students.trungthanhweb.com/api/";
const img = "https://students.trungthanhweb.com/images/";
const params = new URLSearchParams(window.location.search);

//=========global constant=========
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 1700,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});
//----------------------------------------------
function logout() {
  if (!localStorage.getItem("token") && localStorage.getItem("token") == null) {
    $("#logoutBtn").hide();
  } else {
    $("#logoutBtn").click(function (e) {
      e.preventDefault();
      if (
        localStorage.getItem("token") &&
        localStorage.getItem("token") != null
      ) {
        localStorage.removeItem("token");
        Toast.fire({
          icon: "success",
          title: "Đã đăng xuất thành công",
        }).then(() => {
          window.location.reload();
        });
      }
    });
  }
}
//----------------------------------------------
function checkLogin() {
  if (!localStorage.getItem("token") || localStorage.getItem("token") == null) {
    window.location.replace("index.html");
  }
}
//----------------------------------------------
function getData() {
  if (!params.has("id")) {
    window.location.replace("index.html");
  }
  var id = params.get("id");
  var page = 1;
  if (params.has("page")) {
    page = params.get("page");
  }
  $.ajax({
    type: "get",
    url: url + "getCateProducts",
    data: {
      apitoken: localStorage.getItem("token"),
      id: id,
      page: page,
    },
    dataType: "JSON",
    success: function (res) {
      if (res.check == true) {
        const brands = res.brands;
        const categrories = res.categrories;
        const products = res.products.data;
        if (brands.length > 0) {
          var str = ``;
          brands.forEach((el) => {
            str +=
              `
            <li><a class="dropdown-item" href="brands.html?id=` +
              el.id +
              `">` +
              el.name +
              `</a></li>
                        `;
          });
          $("#brandsUL").html(str);
        }
        if (categrories.length > 0) {
          var str = ``;
          categrories.forEach((el) => {
            str +=
              `
            <li><a class="dropdown-item" href="categories.html?id=` +
              el.id +
              `">` +
              el.name +
              `</a></li>
                        `;
          });
          $("#cateUL").html(str);
        }
        if (products.length > 0) {
          var str = ``;
          products.forEach((el) => {
            str +=
              `
                <div class="col-md-4 mt-3 mainCard">
                <div class="card" style="width: 100%;">
                <img style="width:300px; height: auto; margin: 0px auto;"src="` +
              (img + el.image) +
              `" class="card-img-top" alt="...">
                <div class="card-body">
                  <h5 class="card-title">` +
              el.name +
              `</h5>
                  <p class="card-text">Giá: ` +
              Intl.NumberFormat("en-US").format(el.price) +
              `</p>
                  <a href="detail.html?id=`+el.id+`" class="btn btn-primary" data-id="` +
                  el.id +
                  `">Chi tiết</a>
                  <a href="#" class="btn btn-success addToCartBtn" data-id="` +
                  el.id +
                  `">Mua</a>
                </div>
              </div>
              </div>`;
          });
          $("#resultProducts").html(str);
          var str = ``;
          var pages = res.products.last_page;
          var pg = 1;
          while (pg <= pages) {
            if (pg == res.products.current_page) {
              str +=
                `<li class="page-item active"><a class="page-link" href="categories.html?id=` +
                id +
                `&page=` +
                pg +
                `">` +
                pg +
                `</a></li>`;
            } else {
              str +=
                `<li class="page-item"><a class="page-link" href="categories.html?id=` +
                id +
                `&page=` +
                pg +
                `">` +
                pg +
                `</a></li>`;
            }
            pg++;
          }
          $("#paginationlist").html(str);
        }
        $("#searchPriceBtn").click(function (e) {
          e.preventDefault();
          searchPrice();
          $('#paginationlist').hide();
        });
        addToCart();
        searchItem();
      }
    },
  });
}
//----------------------------------------------
function searchPrice() {
  if (!params.has("id")) {
    window.location.replace("index.html");
  }
  var id = params.get("id");
  var lowprice = $("#lowPrice").val();
  var maxprice = $("#highPrice").val();
  var option = "";
  if (lowprice == "" && maxprice != "") {
    option = "maxprice";
  } else if (lowprice != "" && maxprice == "") {
    option = "minprice";
  } else if (lowprice != "" && maxprice != "") {
    option = "pricebetween";
  }
  switch (option) {
    case "maxprice":
      $.ajax({
        type: "get",
        url: url + "searchCatePrice",
        data: {
          apitoken: localStorage.getItem("token"),
          price2: maxprice,
          id: id,
        },
        dataType: "JSON",
        success: function (res) {
          if (res.check == true) {
            var str = ``;
            res.products.forEach((el) => {
              str +=
                `
                  <div class="col-md-4 mt-3">
                  <div class="card" style="width: 100%;">
                  <img style="width:300px; height: auto; margin: 0px auto;"src="` +
                (img + el.image) +
                `" class="card-img-top" alt="...">
                  <div class="card-body">
                    <h5 class="card-title">` +
                el.name +
                `</h5>
                    <p class="card-text">Giá: ` +
                Intl.NumberFormat("en-US").format(el.price) +
                `</p>
                    <a href="detail.html?id=`+el.id+`" class="btn btn-primary chitietBtn"  data-id="` +
                    el.id +
                    `">Chi tiet</a>
                    <a href="#" class="btn btn-success addToCartBtn" data-id="` +
                    el.id +
                    `">Mua</a>
                  </div>
                </div>
                </div>`;
            });
            $("#resultProducts").html(str)
            addToCart();
          }
        },
      });
      break;
    case "pricebetween":
      $.ajax({
        type: "get",
        url: url + "searchCatePrice",
        data: {
          apitoken: localStorage.getItem("token"),
          price2: maxprice,
          price1: lowprice,
          id: id,
        },
        dataType: "JSON",
        success: function (res) {
          if (res.check == true) {
            var str = ``;
            res.products.forEach((el) => {
              str +=
                `
                  <div class="col-md-4 mt-3">
                  <div class="card" style="width: 100%;">
                  <img style="width:300px; height: auto; margin: 0px auto;"src="` +
                (img + el.image) +
                `" class="card-img-top" alt="...">
                  <div class="card-body">
                    <h5 class="card-title">` +
                el.name +
                `</h5>
                    <p class="card-text">Giá: ` +
                Intl.NumberFormat("en-US").format(el.price) +
                `</p>
                    <a href="detail.html?id=`+el.id+`" class="btn btn-primary chitietBtn" data-id="` +
                    el.id +
                    `">Chi tiet</a>
                    <a href="#" class="btn btn-success addToCartBtn" data-id="` +
                    el.id +
                    `">Mua</a>
                  </div>
                </div>
                </div>`;
            });
            $("#resultProducts").html(str)
            addToCart();
          }
        },
      });
      break;
    case "minprice":
      $.ajax({
        type: "get",
        url: url + "searchCatePrice",
        data: {
          apitoken: localStorage.getItem("token"),
          price1: lowprice,
          id: id,
        },
        dataType: "JSON",
        success: function (res) {
          if (res.check == true) {
            var str = ``;
            res.products.forEach((el) => {
              str +=
                `
                  <div class="col-md-4 mt-3">
                  <div class="card" style="width: 100%;">
                  <img style="width:300px; height: auto; margin: 0px auto;"src="` +
                (img + el.image) +
                `" class="card-img-top" alt="...">
                  <div class="card-body">
                    <h5 class="card-title">` +
                el.name +
                `</h5>
                    <p class="card-text">Giá: ` +
                Intl.NumberFormat("en-US").format(el.price) +
                `</p>
                    <a href="detail.html?id=`+el.id+`" class="btn btn-primary chitietBtn" data-id="` +
                    el.id +
                    `">Chi tiet</a>
                    <a href="#" class="btn btn-success addToCartBtn" data-id="` +
                    el.id +
                    `">Mua</a>
                  </div>
                </div>
                </div>`;
            });
            $("#resultProducts").html(str)
            addToCart();
          }
        },
      });
      break;
    default:
      break;
  }
  searchItem()
}
//----------------------------------------------
function addToCart() {
  var count = 0
  var count2 = 0
  if(localStorage.getItem('cart') == ''||localStorage.getItem('cart') == null){
    var arr = []
    $('#cartNoti').hide();
  }else{
    var cart = localStorage.getItem('cart');
    var arr=JSON.parse(cart);
    count= arr.length;
    $('#cartNoti').html(Number(count));
    $('#cartNoti').show();
  }
  $(".addToCartBtn").click(function (e) {
    e.preventDefault();
    var id = Number($(this).attr('data-id'));
    var quantity = 1;
    var item = [id,quantity];
    var check = false;
    arr.forEach(el => {
      if(el[0] == id){
        el[1]+= 1;
        check =true;
      }
    });
    if(check == false){
      arr.push(item);
    }
    count2 = arr.length;
    $('#cartNoti').html(count2);
    $('#cartNoti').show();
    localStorage.setItem('cart',JSON.stringify(arr));
    Toast.fire({
      icon: "success",
      title: "Đã thêm thành công",
    })
  });
  
}
//----------------------------------------------
function searchItem() {
  if (!params.has("id")) {
    window.location.replace("index.html");
  }
  var page = 1;
  if (params.has("page")) {
    page = params.get("page");
  }
  $("#searchItem").keyup(function (e) {
    e.preventDefault();
    var search = $(this).val().trim(); //== var input = $('#searchInput').val().trim()
    if (search == "" || search == null) {
      $.ajax({
        type: "get",
        url: url + "getSearchProducts",
        data: {
          apitoken: localStorage.getItem("token"),
          name: search,
        },
        dataType: "JSON",
        success: function (res) {
          if (res.check == true) {
            var products = res.result.data;
            if (products.length > 0) {
              var str = ``;
              products.forEach((el) => {
                str +=
                  `
                    <div class="col-md-4 mb-3">
                <div class="card" style="width: 100%">
                  <img
                    src="`+(img +
                  el.image) +
                  `"
                    class="card-img-top"
                    alt="..."
                  />
                  <div class="card-body">
                    <h5 class="card-title">` +
                  el.name +
                  `</h5>
                    <p class="card-text">
                      Giá: ` +
                  Intl.NumberFormat("en-US").format(el.price) +
                  `
                    </p>
                    <p>Loại sản phẩm:` +
                  el.catename +
                  ` </p>
                    <p>Tên thương hiệu:` +
                  el.brandname +
                  ` </p>
                    <a href="#" class="btn btn-success addToCartBtn" data-id="` +
                  el.id +
                  `">Mua</a>
                    <a href="detail.html?id=` +
                    el.id +
                    `" class="btn btn-success" data-id="` +
                  el.id +
                  `">Chi tiết</a>
                  </div>
                </div>
              </div>`;
              });
              $("#resultProducts").html(str);
              $('#paginationlist').show();
              addToCart()
            }
          }
        },
      });
    } else {
      $.ajax({
        type: "get",
        url: url + "getSearchProducts",
        data: {
          apitoken: localStorage.getItem("token"),
          name: search,
        },
        dataType: "JSON",
        success: function (res) {
          if (res.check == true) {
            var products = res.result;
            if (products.length > 0) {
              var str = ``;
              products.forEach((el) => {
                str +=
                  `
                    <div class="col-md-4 mb-3">
                <div class="card" style="width: 100%">
                  <img
                    src="`+(img +
                  el.image) +
                  `"
                    class="card-img-top"
                    alt="..."
                  />
                  <div class="card-body">
                    <h5 class="card-title">` +
                  el.name +
                  `</h5>
                    <p class="card-text">
                      Giá: ` +
                  Intl.NumberFormat("en-US").format(el.price) +
                  `
                    </p>
                    <p>Loại sản phẩm:` +
                  el.catename +
                  ` </p>
                    <p>Tên thương hiệu:` +
                  el.brandname +
                  ` </p>
                    <a href="#" class="btn btn-success addToCartBtn" data-id="` +
                  el.id +
                  `">Mua</a>
                    <a href="detail.html?id=` +
                    el.id +
                    `" class="btn btn-success" data-id="` +
                  el.id +
                  `">Chi tiết</a>
                  </div>
                </div>
              </div>`;
              });
              $("#resultProducts").html(str);
              $('#paginationlist').hide();
              addToCart()
            }
          }
        },
      });
    }
  });
}
