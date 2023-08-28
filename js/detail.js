$(document).ready(function () {
  login();
  logout();
  getData();
});
const url = "https://students.trungthanhweb.com/api/";
const urlImg = "https://students.trungthanhweb.com/images/";
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
//================================
function login() {
  if (localStorage.getItem("token") && localStorage.getItem("token") != null) {
    $("#loginBtn").hide();
  } else {
    $("#loginBtn").click(function (e) {
      e.preventDefault();
      $("#LoginModal").modal("show");
      $("#subloginBtn").click(function (e) {
        e.preventDefault();
        var emailuser = $("#email").val().trim();
        if (emailuser == "") {
          Toast.fire({
            icon: "error",
            title: "Chưa nhập tài khoản email",
          }).then(() => {
            window.location.reload();
            //call back
          });
        } else {
          $.ajax({
            type: "post",
            url: "https://students.trungthanhweb.com/api/checkLoginhtml",
            data: {
              //name : gia tri
              email: emailuser,
            },
            dataType: "JSON",
            success: function (res) {
              if (res.check == true) {
                localStorage.setItem("token", res.apitoken);
                Toast.fire({
                  icon: "success",
                  title: "Đăng nhập thành công",
                }).then(() => {
                  window.location.reload();
                  //call back
                });
              } else {
                Toast.fire({
                  icon: "error",
                  title: "Đăng nhập không thành công",
                }).then(() => {
                  window.location.reload();
                  //call back
                });
              }
            },
          });
        }
      });
    });
  }
}
//================================
function logout() {
  if (!localStorage.getItem("token") && localStorage.getItem("token") == null) {
    $("#logoutBtn").hide();
    $("#cartTable").hide();
    window.location.replace('index.html')
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
//================================
var link = url + "home";
function loadData() {
  if (!localStorage.getItem("token") && localStorage.getItem("token") == null) {
  }else{
    getData();
  }
}
//================================
function getData() {
  if (params.has("id")) {
    var id = params.get("id");
  } else {
    window.location.replace("index.html");
  }
  // if(!params.has('id)){window.location.replace('index.html')}
  $.ajax({
    type: "get",
    url: url + "single",
    data: {
      apitoken: localStorage.getItem("token"),
      id: id,
    },
    dataType: "JSON",
    success: function (res) {
      const brands = res.brands;
      const categrories = res.categrories;
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
      const gallery = res.gallery;
      var str = ``;
      gallery.forEach((el) => {
        str +=
          ` <div class="item"><img src="` +
          el +
          `" class="w-100 sliderImg" style="cursor: pointer" alt=""></div>`;
      });
      $("#carousel").append(str);
      const products = res.products[0];
      var img = urlImg + products.images;
      $("#productImg").attr("src", img);
      const name = products.name;
      const discount = products.discount + "%";
      const price = Intl.NumberFormat("en-US").format(
        (products.price * (100 - products.discount)) / 100
      );
      const catename = products.catename;
      const brandname = products.brandname;
      $("#productName").text(name);
      $("#discount").text(discount);
      $("#price").text(price);
      $("#cateName").text(catename);
      $("#brandName").text(brandname);
      const content = products.content;
      $("#content").html(content);
      const cateProducts = res.cateproducts;
      const brandProducts = res.brandproducts;
      var str = ``;
      cateProducts.forEach((el) => {
        str +=
          `
          <div class="item">
            <div class="card w-100" style="min-height: 330px">
                <img src="` +
          (urlImg + el.image) +
          `" class="card-img-top" alt="..."  style=" width: 100%; height: auto">
                <div class="card-body">
                  <h5 class="card-title">` +
          el.name +
          `</h5>
                  <p class="card-text">` +
          Intl.NumberFormat("en-US").format(el.price) +
          `</p>
                  <a href="detail.html?id=` +
          el.id +
          `"  class="btn btn-primary">Chi tiết</a>
                </div>
            </div>
          </div>`;
        $("#sameCateProducts").append(str);
        str = "";
      });
      brandProducts.forEach((el) => {
        str +=
          `
          <div class="item">
            <div class="card w-100" style="min-height: 330px">
                <img src="` +
          (urlImg + el.image) +
          `" class="card-img-top" alt="..." style=" width: 100%; height: auto">
                <div class="card-body">
                  <h5 class="card-title w-100">` +
          el.name +
          `</h5>
                  <p class="card-text">` +
          Intl.NumberFormat("en-US").format(el.price) +
          `</p>
                  <a href="detail.html?id=` +
          el.id +
          `"  class="btn btn-primary">Chi tiết</a>
                </div>
            </div>
          </div>`;
        $("#sameBrandProducts").append(str);
        str = "";
      });
      /*const contentHeight = $('#content')[0].offsetHeight;
       var height=300;
       $('#content').css('height',height);
       $('#content').css('overflow',hidden)*/
      $("#seeMore").click(function (e) {
        e.preventDefault();
        //$('#content').css('height',contentHeight)
        var height = $("#content")[0].offsetHeight; //chieu cao cua content
        $("#content").css("height", "fit-content");
        $("#seeMore").hide();
      });
      sliderImg();
      owl();
      addToCart();
    },
  });
}
function sliderImg() {
  $(".sliderImg").click(function (e) {
    e.preventDefault();
    var source = $(this).attr("src");
    $("#productImg").attr("src", source);
  });
}
function owl() {
  $("#carousel").owlCarousel({
    loop: true,
    margin: 10,
    responsiveClass: true,
    responsive: {
      300: {
        items: 2,
        nav: true,
      },
      600: {
        items: 3,
      },
      1200: {
        items: 4,
      },
    },
  });
  $("#sameBrandProducts").owlCarousel({
    loop: true,
    margin: 10,
    nav: true,
    responsiveClass: true,
    responsive: {
      0: {
        items: 1,
        nav: true,
      },
      600: {
        items: 2,
      },
      1000: {
        items: 5,
      },
    },
  });
  $("#sameCateProducts").owlCarousel({
    loop: true,
    margin: 10,
    nav: true,
    responsiveClass: true,
    responsive: {
      0: {
        items: 1,
        nav: true,
      },
      600: {
        items: 2,
      },
      1000: {
        items: 5,
      },
    },
  });
}
function addToCart() {
  var count = 0;
  var count2 = 0;
  if (localStorage.getItem("cart") != '' && localStorage.getItem("cart") != null) {
    var cart = localStorage.getItem("cart");
    var arr = JSON.parse(cart);
    count = arr.length;
    $("#cartNoti").html(Number(count));
    $("#cartNoti").show();
  } else {
    var arr = [];
    $("#cartNoti").hide();
  }
  $("#addToCartBtn").click(function (e) {
    e.preventDefault();
    var id = params.get("id");
    var check = false;
    arr.forEach((el) => {
      if (el[0] == id) {
        el[1]++;
        check = true;
      }
    });
    if (check == false) {
      var item = [id, 1];
      arr.push(item);
    }
    count2 = arr.length;
    $("#cartNoti").html(count2);
    $("#cartNoti").show();
    localStorage.setItem("cart", JSON.stringify(arr));
    Toast.fire({
      icon: "success",
      title: "Đã thêm thành công",
    });
  });
}
