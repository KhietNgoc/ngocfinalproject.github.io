$(document).ready(function () {
  login();
  logout();
  loadCart();
  loadCartMobile();
  
});
const url = "https://students.trungthanhweb.com/api/";
var link = url + "home";
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
    $('#cartTableMobile').hide()
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
function loadCart() {
  if (localStorage.getItem("cart") && localStorage.getItem("cart") != null) {
    var cart = localStorage.getItem("cart");
    var id = JSON.parse(cart);
    $.ajax({
      type: "get",
      url: url + "getCart",
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
        if (res.result.length > 0) {
          var str = ``;
          var sum = 0;
          var count = 1;
          res.result.forEach((el, index) => {
            if (index % 2 == 0) {
              str +=
                `
                  <tr class="table-primary">
                    <td scope="row">` +
                count++ +
                `</td>
                    <td><img src="` +
                el[3] +
                `" style="width: 150px !important; height: auto !important; " alt=""></td>
                    <td>` +
                el[1] +
                `</td>
                <td scope="row">` +
                Number(el[2]) +'%'+
                `</td>
                    <td>` +
                Intl.NumberFormat("en-US").format(el[5]) +
                `</td>
                    <td><input type="number" class="form-control qtyInput" min="0" value="` +
                el[4] +
                `" data-id="` +
                el[0] +
                `"></td>
                  <td>` +
                Intl.NumberFormat("en-US").format(el[6]) +
                `</td>
                <td><button class='btn btn-danger dltBtn' data-id='` +
                el[0] +
                `'>Xóa</button></td>
                  </tr>`;
            } else {
              str +=
                `
                  <tr class="table-secondary">
                    <td scope="row">` +
                count++ +
                `</td>
                    <td><img src="` +
                el[3] +
                `" style="width: 150px !important; height: auto !important; " alt=""></td>
                    <td>` +
                el[1] +
                `</td>
                <td scope="row">` +
                Number(el[2])+ '%' +
                `</td>
                  <td>` +
                Intl.NumberFormat("en-US").format(el[5]) +
                `</td>
                    <td><input type="number" class="form-control qtyInput" min="0" value="` +
                el[4] +
                `" data-id="` +
                el[0] +
                `"></td>
                    <td>` +
                Intl.NumberFormat("en-US").format(el[6]) +
                `</td>
                <td><button class='btn btn-danger dltBtn' data-id='` +
                el[0] +
                `'>Xóa</button></td>
                  </tr>`;
            }
            sum += el[6];
          });
          str +=
            `
              <tr class="table-dark">
                <th colspan='6' scope='col' style='text-align: center'>Thành tiền</td>
                <td scope = 'col'>` +
            Intl.NumberFormat("en-US").format(sum) +
            `</td>
                <td scope='col'></td>
              </tr>
                `;
          $("#cartResults").html(str);
        }
        payment();
        deleteProducts();
        editQty();
      },
    });
  } else {
    window.location.replace("index.html");
  }
}
//================================
function loadCartMobile() {
  if (localStorage.getItem("cart") && localStorage.getItem("cart") != null) {
    var cart = localStorage.getItem("cart");
    var id = JSON.parse(cart);
    $.ajax({
      type: "get",
      url: url + "getCart",
      data: {
        apitoken: localStorage.getItem("token"),
        id: id,
      },
      dataType: "JSON",
      success: function (res) {
        const result = res.result;
        var str = ``;
        if (res.check == true && result.length > 0) {
          var sum = 0;
          result.forEach((el, index) => {
            if (index % 2 == 0) {
              str +=
                `
            <tr>
                <td scope="row" style="vertical-align: middle;">` +
                (++index) +
                `</td>
                <td style="padding: 0;"><img src="` +
                el[3] +
                `" style="width: 150px;height: auto;"></td>
                <td>
                    <ul class="list-group" style="text-align: left;">
                        <li class="list-group-item"><b>Tên sản phẩm: </b> ` +
                        el[1] +
                        `</li>
                        <li class="list-group-item"><b>Giảm giá: </b> ` +
                        Number(el[2])+'%' +
                        `</li>
                        <li class="list-group-item"><b>Đơn giá:</b> ` +
                        Intl.NumberFormat("en-US").format(el[5]) +
                        `</li>
                        <li class="list-group-item"><b>Số lượng: </b><input type="number" class="form-control qtyInput" min="0" value="` +
                        el[4] +
                        `" data-id="` +
                        el[0] +
                        `"></li>
                        <li class="list-group-item"><b>Thành tiền: </b> ` +
                        Intl.NumberFormat("en-US").format(el[6]) +
                        `</li>
                        <li class="list-group-item "><button class='btn btn-danger dltBtn w-100' data-id='`+el[0]+`'>Xóa</button></li>
                    </ul>
                </td>
            </tr>
            
            `;
            } else {
              str +=
                `
            <tr>
              <td scope="row" style="vertical-align: middle;">` +
                ++index +
                `</td>
              <td style="padding: 0;"><img src="` +
                el[3] +
                `" style="width: 150px;height: auto;"></td>
              <td>
                <ul class="list-group" style="text-align: left;">
                  <li class="list-group-item"><b>Tên sản phẩm: </b>` +
                el[1]+
                `</li>
                <li class="list-group-item"><b>Giảm giá: </b> ` +
                        Number(el[2])+'%' +
                        `</li>
                  <li class="list-group-item"><b>Đơn giá: </b>` +
                Intl.NumberFormat("en-US").format(el[5]) +
                `</li>
                  <li class="list-group-item"><b>Số lượng: </b> <input type="number" class="form-control qtyInput" min="0" value="` +
                  el[4] +
                  `" data-id="` +
                  el[0] +
                  `"></li>
                <li class="list-group-item"><b>Thành tiền: </b> ` +
                Intl.NumberFormat("en-US").format(el[6]) +
                `</li>
                <li class="list-group-item "><button class='btn btn-danger dltBtn w-100' data-id='`+el[0]+`'>Xóa</button></li>
                </ul>
              </td>
            </tr>`;
            }
            sum += el[6];
          });
          str +=
            `
            <tr class="table-dark">
                <th colspan='2' scope='row' style='text-align: center'>Tổng tiền</td>
                <td scope = 'row'>` +
            Intl.NumberFormat("en-US").format(sum) +
                `</td>
            </tr>
                `;
            $('#cartResultsMobile').html(str)
        }
        editQty()
        paymentMobile()
        deleteProducts()
      },
    });
  } else {
    window.location.replace("index.html");
  }
}
//================================
function editQty() {
  $(".qtyInput").change(function (e) {
    e.preventDefault();
    var id = $(this).attr("data-id");
    var qty = $(this).val();
    var cart = JSON.parse(localStorage.getItem("cart"));
    if (qty == 0) {
      Swal.fire({
        icon: "question",
        title: "Xóa sản phẩm?",
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: "Okay",
        denyButtonText: `Cancel`,
      }).then((result) => {
        // Read more about isConfirmed, isDenied below
        if (result.isConfirmed) {
          var arr = [];
          cart.forEach((el) => {
            if (el[0] != id) {
              arr.push(el);
            }
          });
          if (arr.length == 0) {
            localStorage.removeItem("cart");
          } else {
            localStorage.setItem("cart", JSON.stringify(arr));
          }
          Toast.fire({
            icon: "success",
            title: "Đã xóa thành công",
          }).then(() => {
            loadCart()
            loadCartMobile();
          });
        } else if (result.isDenied) {
          loadCart();
          loadCartMobile()
        }
      });
    } else {
      cart.forEach((el) => {
        if (el[0] == id) {
          el[1] = qty;
        }
      });
      localStorage.setItem("cart", JSON.stringify(cart));
      loadCart();
      loadCartMobile()
    }
  });
}
//================================
function payment() {
  const pattern = /(0[3|5|7|8|9])+([0-9]{8})\b/g; //pattern check sdt; str dung format --> pass, sai --> fail
  $("#payBtn").click(function (e) {
    e.preventDefault();
    $("#PaymentModal").modal("show");
    $("#modalPayBtn").click(function (e) {
      e.preventDefault();
      var tenKH = $("#tenKH").val().trim();
      var phone = $("#phone").val().trim();
      var address = $("#address").val().trim();
      if (tenKH == "") {
        Toast.fire({
          icon: "warning",
          title: "Chưa nhập họ tên",
        });
      } else if (phone == "") {
        Toast.fire({
          icon: "warning",
          title: "Chưa nhập số điện thoại",
        });
      } else if (address == "") {
        Toast.fire({
          icon: "warning",
          title: "Chưa nhập địa chỉ",
        });
      } else if (!phone.match(pattern)) {
        Toast.fire({
          icon: "warning",
          title: "Số điện thoại không hợp lệ",
        });
      } else {
        $("#modalPayBtn").attr("disabled", "disabled");
        var cart = JSON.parse(localStorage.getItem("cart"));
        $.ajax({
          type: "post",
          url: url + "createBill",
          data: {
            apitoken: localStorage.getItem("token"),
            cart: cart,
            tenKH: tenKH,
            phone: phone,
            address: address,
          },
          dataType: "JSON",
          success: function (res) {
            if (res.check == true) {
              Toast.fire({
                icon: "success",
                title: "Tạo hóa đơn thành công",
              }).then(() => {
                localStorage.removeItem("cart");
                window.location.replace("bills.html");
              });
            }
          },
        });
      }
    });
  });
}
//================================
function paymentMobile() {
  const pattern = /(0[3|5|7|8|9])+([0-9]{8})\b/g; //pattern check sdt; str dung format --> pass, sai --> fail
  $("#payBtnMobile").click(function (e) {
    e.preventDefault();
    $("#PaymentModal").modal("show");
    $("#modalPayBtn").click(function (e) {
      e.preventDefault();
      var tenKH = $("#tenKH").val().trim();
      var phone = $("#phone").val().trim();
      var address = $("#address").val().trim();
      if (tenKH == "") {
        Toast.fire({
          icon: "warning",
          title: "Chưa nhập họ tên",
        });
      } else if (phone == "") {
        Toast.fire({
          icon: "warning",
          title: "Chưa nhập số điện thoại",
        });
      } else if (address == "") {
        Toast.fire({
          icon: "warning",
          title: "Chưa nhập địa chỉ",
        });
      } else if (!phone.match(pattern)) {
        Toast.fire({
          icon: "warning",
          title: "Số điện thoại không hợp lệ",
        });
      } else {
        $("#modalPayBtn").attr("disabled", "disabled");
        var cart = JSON.parse(localStorage.getItem("cart"));
        $.ajax({
          type: "post",
          url: url + "createBill",
          data: {
            apitoken: localStorage.getItem("token"),
            cart: cart,
            tenKH: tenKH,
            phone: phone,
            address: address,
          },
          dataType: "JSON",
          success: function (res) {
            if (res.check == true) {
              Toast.fire({
                icon: "success",
                title: "Tạo hóa đơn thành công",
              }).then(() => {
                localStorage.removeItem("cart");
                window.location.replace("bills.html");
              });
            }
          },
        });
      }
    });
  });
}
//================================
function deleteProducts(){
  $('.dltBtn').click(function (e) { 
    e.preventDefault();
    var id = $(this).attr('data-id');
    var cart = JSON.parse(localStorage.getItem("cart"));
    Swal.fire({
      icon: "question",
      title: "Xóa sản phẩm?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Okay",
      denyButtonText: `Cancel`,
    }).then((result) => {
      // Read more about isConfirmed, isDenied below
      if (result.isConfirmed) {
        var arr = []; 
        cart.forEach((el) => {
          if(el[0] != id){
            arr.push(el);
          }
        });
        if (arr.length == 0) {
          localStorage.removeItem("cart");
        } else {
          localStorage.setItem("cart", JSON.stringify(arr));
        }
        Toast.fire({
          icon: "success",
          title: "Đã xóa thành công",
        }).then(() => {
          loadCart()
          loadCartMobile()
        });
      } else if (result.isDenied) {
        loadCart();
        loadCartMobile()
      }
    })
  });
}