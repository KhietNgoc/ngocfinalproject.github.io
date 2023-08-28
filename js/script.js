$(document).ready(function () {
  login();
  loadData();
  logout();
});

const url = "https://students.trungthanhweb.com/api/";
var link = url + "home";
const img = "https://students.trungthanhweb.com/images/";
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
    $("#showMoreBtn").hide();
    $("#logoutBtn").hide();
    $('.footer').hide();
    $('#cartNoti').hide();
    $('.cartIcon').hide()
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
function loadData() {
  if (localStorage.getItem("token") && localStorage.getItem("token") != null) {
    showMore();
    $("#showMoreBtn").click(function (e) {
      e.preventDefault();
      showMore();
    });
    searchItem();
  }
}
//================================
function showMore() {
  $.ajax({
    type: "get",
    url: link,
    data: {
      apitoken: localStorage.getItem("token"),
    },
    dataType: "JSON",
    success: function (res) {
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
          <div class="col-md-3 mb-3 mainCard">
          <div class="card w-100">
          <img
            src="https://students.trungthanhweb.com/images/` +
            el.images +
            `"
            class="card-img-top w-100" 
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
            <button class="btn btn-success addToCartBtn" data-id="` +
            el.id +
            `">Mua</button>
            <a href="detail.html?id=` +
            el.id +
            `" class="btn btn-success chitietBtn" data-id="` +
            el.id +
            `">Chi tiết</a>
          </div>
        </div>
      </div>`;
        });
        $("#row_products").append(str);
        if (res.products.next_page_url != null) {
          link = res.products.next_page_url;
        } else {
          $("#showMoreBtn").hide();
        }
        addToCart();
      }
    },
  });
}
//================================
function addToCart() {
  var count = 0
  var count2 = 0
  if (localStorage.getItem("cart") == '' || localStorage.getItem("cart") == null) {
    var arr = [];
    $('#cartNoti').hide();
    $('#cart').click(function (e) { 
      e.preventDefault();
      Toast.fire({
        icon: "warning",
        title: "Giỏ hàng hiện rỗng",
      });
    });
  } else {
    var cart = localStorage.getItem("cart");
    console.log(cart);
    var arr = JSON.parse(cart);
    count= arr.length;
    $('#cartNoti').html(Number(count));
    $('#cartNoti').show();
    $('#cart').click(function (e) { 
      e.preventDefault();
      window.location.replace('cart.html');
    });
  }
  $(".addToCartBtn").click(function (e) {
    e.preventDefault();
    var id = Number($(this).attr("data-id"));
    var quantity = 1;
    var item = [id, quantity];
    var check = false;
    arr.forEach((el) => {
      if (el[0] == id) {
        el[1] += 1;
        check = true;
      }
    });
    if (check == false) {
      arr.push(item);
    }
    count2 = arr.length;
    $('#cartNoti').html(count2);
    $('#cartNoti').show();
    localStorage.setItem("cart", JSON.stringify(arr));
    Toast.fire({
      icon: "success",
      title: "Đã thêm hàng thành công",
    }).then(() => {
      window.location.reload();
    });
  });
}
//================================
function searchItem() {
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
                    <div class="col-md-3 mb-3">
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
              $("#row_products").html(str);
              $("#showMoreBtn").show()
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
                    <div class="col-md-3 mb-3">
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
              $("#row_products").html(str);
              $("#showMoreBtn").hide()
              addToCart()
            }
          }
        },
      });
    }
  });
}
