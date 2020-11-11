<template>
  <el-card class="box-card">
    <ul class="msg-box">
      <li>
        <h4>我要充值</h4>
      </li>
      <li>
        <h4 style="margin-bottom: 15px">充值金额</h4>
        <el-radio-group v-model="countVal" @change="amountChange">
          <el-radio border :label="500">500条/￥1950.00</el-radio>
          <el-radio border :label="1000">1000条/￥3900.00</el-radio>
          <el-radio border :label="2000">2000条/￥7800.00</el-radio>
          <el-radio border :label="''">自定义</el-radio>
        </el-radio-group>
      </li>
      <li>
        <h4 style="margin-bottom: 15px">充值方式</h4>
        <el-radio-group
          v-model="rechargeParams.paymentType"
          @change="paymentTypeChange"
        >
          <el-radio border :label="0">支付宝</el-radio>
          <el-radio border :label="1">微信暂不支持</el-radio>
        </el-radio-group>
      </li>
      <li>
        <h4 style="margin-bottom: 15px">充值条数</h4>
        <el-input
          v-model="rechargeParams.totalCount"
          :disabled="disabled"
          clearable
          placeholder="请输入条数"
          style="width: 150px"
          type="number"
          @input="oninput"
        />
        <el-input
          v-show="payAmountVisible"
          v-model="rechargeParams.totalAmount"
          :disabled="true"
          placeholder="金额"
          style="width: 150px"
        />
        <span style="font-size: 12px; margin-left: 10px">3.9元/条</span>
      </li>
    </ul>
    <div style="text-align: center; margin-top: 30px">
      <el-button type="primary" @click="surePay">确认支付</el-button>
    </div>
  </el-card>
</template>

<script>
// /**
//  * @description 格式化金额
//  * @param number：要格式化的数字
//  * @param decimals：保留几位小数 默认0位
//  * @param decPoint：小数点符号 默认.
//  * @param thousandsSep：千分位符号 默认为,
//  */
// export const formatMoney = (number, decimals = 0, decPoint = '.', thousandsSep = ',') => {
//     number = (number + '').replace(/[^0-9+-Ee.]/g, '')
//     let n = !isFinite(+number) ? 0 : +number
//     let prec = !isFinite(+decimals) ? 0 : Math.abs(decimals)
//     let sep = (typeof thousandsSep === 'undefined') ? ',' : thousandsSep
//     let dec = (typeof decPoint === 'undefined') ? '.' : decPoint
//     let s = ''
//     let toFixedFix = function (n, prec) {
//         let k = Math.pow(10, prec)
//         return '' + Math.ceil(n * k) / k
//     }
//     s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.')
//     let re = /(-?\d+)(\d{3})/
//     while (re.test(s[0])) {
//         s[0] = s[0].replace(re, '$1' + sep + '$2')
//     }
//     if ((s[1] || '').length < prec) {
//         s[1] = s[1] || ''
//         s[1] += new Array(prec - s[1].length + 1).join('0')
//     }
//     return s.join(dec)
// }

// export default {
//   data() {
//     return {
//       countVal: 500,
//       amountVal: 0,
//       disabled: true,
//       payAmountVisible: false,
//       // 充值参数
//       rechargeParams: {
//         totalCount: 500, // 条数
//         totalAmount: 0, // 金额
//         paymentType: 0 // 支付方式[0:支付宝,1:微信]
//       }
//     }
//   },
//   methods: {
//     oninput(e) {
//         this.rechargeParams.totalAmount = '￥' + formatMoney(this.rechargeParams.totalCount * 3.9, 2)
//     },
//     // 充值金额
//     amountChange(val) {
//       this.rechargeParams.totalCount = val
//       if (val === '') {
//         this.disabled = false
//         this.payAmountVisible = true
//         this.rechargeParams.totalAmount = '￥0.00'
//       } else {
//         this.disabled = true
//         this.payAmountVisible = false
//       }
//     },
//     // 支付方式
//     paymentTypeChange(val) {
//       if (val === 1) {
//         this.rechargeParams.paymentType = 0
//         return
//       }
//       this.rechargeParams.paymentType = val
//     },
//     // 确认支付
//     async surePay() {
//       if (this.rechargeParams.totalCount === '') {
//         this.$message.warning('请输入要充值的条数')
//         return
//       }
//       const res = await this.$http.post(
//         "orderInfo/createOrderInfo",
//         this.rechargeParams
//       )
//       const { code, msg, result } = res.data;
//     //   if (code === "200") {
//     //     // 支付方式跳转
//     //     if (this.rechargeParams.paymentType == "0") {
//     //       this.$message.success("支付宝支付");
//     //       const payDiv = document.getElementById("payDiv");
//     //       if (payDiv) {
//     //         document.body.removeChild(payDiv);
//     //       }
//     //       const div = document.createElement("div");
//     //       div.id = "payDiv";
//     //       div.innerHTML = result;
//     //       document.body.appendChild(div);
//     //       document
//     //         .getElementById("payDiv")
//     //         .getElementsByTagName("form")[0]
//     //         .submit();
//     //     }
//     //   } else {
//     //     this.$message.error(msg);
//     //   }
//     }
//   }
// }
</script>

<style scoped>
/* 信息列表样式 */
.msg-box > li {
  list-style: none;
  border-bottom: 1px solid #c5c5c5;
  padding: 20px 10px;
}
</style>
