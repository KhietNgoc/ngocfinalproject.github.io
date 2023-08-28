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
    window.location.replace('index.html');
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
          title: "Đăng xuất thành công",
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
      },
    });
    $("#billResult").hide();
    $("#billResultMobile").hide();
    $.ajax({
      type: "get",
      url: url + "bills",
      data: {
        apitoken: localStorage.getItem("token"),
      },
      dataType: "JSON",
      success: function (res) {
        if (res.check == true && res.bills.length > 0) {
          var str = ``;
          const bills = res.bills;
          bills.forEach((el) => {
            str +=
              `<li class="list-group-item billDetailSelect" style="cursor: pointer" data-id="` +
              el.id +
              `">` +
              el.tenKH +
              `<br>` +
              el.created_at +
              `</li>`;
          });
          $("#billResult").html(str);
          $("#billResultMobile").html(str);
          $("#billResult").show();
          $("#billResultMobile").show();
          billDetail();
          billDetailMobile()
        }else{
          window.location.replace('index.html')
        }
      },
    });
  }
}
//================================
function billDetail() {
  $(".billDetailSelect").click(function (e) {
    e.preventDefault();
    $(".list-group-item").removeClass("active");
    $(this).addClass("active");
    $.ajax({
      type: "get",
      url: url + "singlebill",
      data: {
        apitoken: localStorage.getItem("token"),
        id: $(this).attr("data-id"),
      },
      dataType: "JSON",
      success: function (res) {
        const result = res.result;
        var str = ``;
        if (res.check == true && result.length > 0) {
          var sum = 0;
          result.forEach((el, index) => {
            const total = Intl.NumberFormat("en-US").format(
              ((el.price * (100 - el.discount)) / 100) * el.qty
            );
            if (index % 2 == 0) {
              str +=
                `
                <tr class="table-primary">
                    <td scope="row">` +
                ++index +
                `</td>
                    <td><img src="` +
                (img + el.image) +
                `" alt=""></td>
                    <td>` +
                el.productname +
                `</td>
                    <td>` +
                Intl.NumberFormat("en-US").format(el.price) +
                `</td>
                    <td>` +
                el.discount +
                "%" +
                `</td>
                    <td>` +
                el.qty +
                `</td>
                    <td>` +
                total +
                `</td>
                </tr>`;
            } else {
              str +=
                `
                <tr class="table-secondary">
                    <td scope="row">` +
                ++index +
                `</td>
                    <td scope = 'row'><img src="` +
                (img + el.image) +
                `" alt=""></td>
                    <td scope = 'row'>` +
                el.productname +
                `</td>
                    <td scope = 'row'>` +
                Intl.NumberFormat("en-US").format(el.price) +
                `</td>
                    <td scope = 'row'>` +
                el.discount +
                "%" +
                `</td>
                    <td scope = 'row'>` +
                el.qty +
                `</td>
                    <td scope = 'row'>` +
                total +
                `</td>
                </tr>`;
            }
            sum += ((el.price * (100 - el.discount)) / 100) * el.qty;
          });
          str +=
            `
              <tr class="table-dark">
                <td colspan='6' scope='row' style='text-align: center'>Tổng tiền</td>
                <td scope = 'row'>` +
            Intl.NumberFormat("en-US").format(sum) +
            `</td>
              </tr>
                `;
          $("#resultDetail").html(str);
          $("#billDetail").removeClass("hideclass");
        }
      },
    });
  });
}
//--------------------------------
function billDetailMobile() {
  $(".billDetailSelect").click(function (e) {
    e.preventDefault();
    $(".list-group-item").removeClass("active");
    $(this).addClass("active");
    $.ajax({
      type: "get",
      url: url + "singlebill",
      data: {
        apitoken: localStorage.getItem("token"),
        id: $(this).attr("data-id"),
      },
      dataType: "JSON",
      success: function (res) {
        const result = res.result;
        var str = ``;
        if (res.check == true && result.length > 0) {
          var sum = 0;
          result.forEach((el, index) => {
            const total = Intl.NumberFormat("en-US").format(
              ((el.price * (100 - el.discount)) / 100) * el.qty
            );
            if (index % 2 == 0) {
              str +=
                `
            <tr>
            <td scope="row" style="vertical-align: middle;">` +
                ++index +
                `</td>
            <td style="padding: 0;"><img src="` +
                (img + el.image) +
                `" style="width: 150px;height: auto;"></td>
            <td>
              <ul class="list-group" style="text-align: left;">
                <li class="list-group-item"><b>Tên sản phẩm:</b> ` +
                el.productname +
                `</li>
                <li class="list-group-item"><b>Đơn giá:</b> ` +
                Intl.NumberFormat("en-US").format(el.price) +
                `</li>
                <li class="list-group-item"><b>Giảm giá:</b> ` +
                el.discount +'%'+
                `</li>
                <li class="list-group-item"><b>Số lượng:</b> ` +
                el.qty +
                `</li>
                <li class="list-group-item"><b>Thành tiền:</b> ` +
                total +
                `</li>
              </ul>
            </td>
          </tr>`;
            } else {
              str +=
                `
                <tr>
              <td scope="row" style="vertical-align: middle;">` +
                ++index +
                `</td>
              <td style="padding: 0;"><img src="` +
                (img + el.image) +
                `" style="width: 150px;height: auto;"></td>
              <td>
                <ul class="list-group" style="text-align: left;">
                  <li class="list-group-item"><b>Tên sản phẩm: </b>` +
                el.productname +
                `</li>
                  <li class="list-group-item"><b>Đơn giá: </b>` +
                Intl.NumberFormat("en-US").format(el.price) +
                `</li>
                  <li class="list-group-item"><b>Giảm giá: </b> ` +
                el.discount+'%' +
                `</li>
                  <li class="list-group-item"><b>Số lượng: </b> ` +
                el.qty +
                `</li>
                  <li class="list-group-item"><b>Thành tiền: </b> ` +
                total +
                `</li>
                </ul>
              </td>
            </tr>`;
            }
            sum += ((el.price * (100 - el.discount)) / 100) * el.qty;
          });
          str +=
            `
              <tr class="table-dark">
                <td colspan='2' scope='row' style='text-align: center'>Tổng tiền</td>
                <td scope = 'row'>` +
            Intl.NumberFormat("en-US").format(sum) +
              `</td>
              </tr>
                `;
          $("#resultDetailMobile").html(str);
          $("#billDetailMobile").removeClass("hideclass");
        }
      },
    });
  });
}
