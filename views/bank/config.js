// 宝付、闪付银行配置
var bank1 = [
	{name:"招商銀行", code:"3001", ico:"ico-icbc"},
	{name:"工商銀行", code:"3002", ico:"ico-ccb"},
	{name:"建設銀行", code:"3003", ico:"ico-abc"},
	{name:"浦發銀行", code:"3004", ico:"ico-boco"},
	{name:"農業銀行", code:"3005", ico:"ico-boc"},
	{name:"民生銀行", code:"3006", ico:"ico-cebb"},
	{name:"興業銀行", code:"3009", ico:"ico-cmbc"},
	{name:"交通銀行", code:"3020", ico:"ico-post"},
	{name:"光大銀行", code:"3022", ico:"ico-post"},
	{name:"中國銀行", code:"3026", ico:"ico-cmb"},
	{name:"北京銀行", code:"3032", ico:"ico-cccb"},
	{name:"平安銀行", code:"3035", ico:"ico-gdb"},
	{name:"廣發銀行", code:"3036", ico:"ico-spdb"},
	{name:"上海農商銀行", code:"3037", ico:"ico-hxb"},
	{name:"中國郵政儲蓄", code:"3038", ico:"ico-hxb"},
	{name:"中信銀行", code:"3039", ico:"ico-hxb"}
];

// 汇通银行配置
var bank2 = [
 	{name:"工商銀行", code:"ICBC", ico:"ico-icbc"},
	{name:"建設銀行", code:"CCB", ico:"ico-ccb"},
	{name:"農業銀行", code:"ABC", ico:"ico-abc"},
	{name:"交通銀行", code:"BOCOM", ico:"ico-boco"},
	{name:"中國銀行", code:"BOC", ico:"ico-boc"},
	{name:"光大銀行", code:"CEBBANK", ico:"ico-cebb"},
	{name:"民生銀行", code:"CMBCS", ico:"ico-cmbc"},
	{name:"郵政銀行", code:"PSBC", ico:"ico-post"},
	{name:"興業銀行", code:"CIB", ico:"ico-post"},
	{name:"招商銀行", code:"CMBC", ico:"ico-cmb"},
	{name:"中信銀行", code:"ECITIC", ico:"ico-cccb"},
	{name:"廣發銀行", code:"CGB", ico:"ico-gdb"},
	{name:"浦發銀行", code:"SPDB", ico:"ico-spdb"},
	{name:"華夏銀行", code:"HXB", ico:"ico-hxb"},
	{name:"平安銀行", code:"PINGAN", ico:"ico-hxb"},
	{name:"北京銀行", code:"BCCB", ico:"ico-hxb"},
	{name:"上海銀行", code:"BOS", ico:"ico-hxb"},
	{name:"北京农商", code:"BRCB", ico:"ico-hxb"}
 ];

//智付银行配置
var bank3 = [
	{name:"農業銀行", code:"ABC", ico:"ico-abc"},
	{name:"工商銀行", code:"ICBC", ico:"ico-icbc"},
	{name:"建設銀行", code:"CCB", ico:"ico-ccb"},
	{name:"交通銀行", code:"BCOM", ico:"ico-bcm"},
	{name:"中國銀行", code:"BOC", ico:"ico-boc"},
	{name:"招商銀行", code:"CMB", ico:"ico-cmb"},
	{name:"民生銀行", code:"CMBC", ico:"ico-cmbc"},
	{name:"光大銀行", code:"CEBB", ico:"ico-ceb"},
	{name:"北京銀行", code:"BOB", ico:"ico-cccb"},
	{name:"上海銀行", code:"SHB", ico:"ico-bos"},
	{name:"華夏銀行", code:"HXB", ico:"ico-hxb"},
	{name:"興業銀行", code:"CIB", ico:"ico-cib"},
	{name:"郵政銀行", code:"PSBC", ico:"ico-psbc"},
	{name:"平安銀行", code:"SPABANK", ico:"ico-pingan"},
	{name:"浦發銀行", code:"SPDB", ico:"ico-spdb"},
	{name:"中信銀行", code:"ECITIC", ico:"ico-cncb"},
	{name:"廣發銀行", code:"GDB", ico:"ico-cgb"}
];

//乐盈银行配置
var bank4 = [
	{name:"農業銀行", code:"abc", ico:"ico-abc"},
	{name:"工商銀行", code:"icbc", ico:"ico-icbc"},
	{name:"建設銀行", code:"ccb", ico:"ico-ccb"},
	{name:"交通銀行", code:"comm", ico:"ico-bcm"},
	{name:"中國銀行", code:"boc", ico:"ico-boc"},
	{name:"招商銀行", code:"cmb", ico:"ico-cmb"},
	{name:"民生銀行", code:"cmbc", ico:"ico-cmbc"},
	{name:"光大銀行", code:"ceb", ico:"ico-ceb"},
	{name:"北京銀行", code:"bccb", ico:"ico-cccb"},
	{name:"華夏銀行", code:"hxb", ico:"ico-hxb"},
	{name:"興業銀行", code:"cib", ico:"ico-cib"},
	{name:"郵政銀行", code:"post", ico:"ico-psbc"},
	{name:"平安銀行", code:"pingan", ico:"ico-pingan"},
	{name:"浦發銀行", code:"spdb", ico:"ico-spdb"},
	{name:"中信銀行", code:"ecitic", ico:"ico-cncb"},
	{name:"廣發銀行", code:"gdb", ico:"ico-cgb"}
];

//千网银行配置
var bank5 = [
	{name:"農業銀行", code:"964", ico:"ico-abc"},
	{name:"工商銀行", code:"967", ico:"ico-icbc"},
	{name:"建設銀行", code:"965", ico:"ico-ccb"},
	{name:"交通銀行", code:"981", ico:"ico-bcm"},
	{name:"中國銀行", code:"963", ico:"ico-boc"},
	{name:"招商銀行", code:"970", ico:"ico-cmb"},
	{name:"民生銀行", code:"980", ico:"ico-cmbc"},
	{name:"光大銀行", code:"986", ico:"ico-ceb"},
	{name:"北京銀行", code:"989", ico:"ico-cccb"},
	{name:"華夏銀行", code:"982", ico:"ico-hxb"},
	{name:"興業銀行", code:"972", ico:"ico-cib"},
	{name:"邮政储蓄", code:"971", ico:"ico-psbc"},
	{name:"平安銀行", code:"978", ico:"ico-pingan"},
	{name:"浦發銀行", code:"977", ico:"ico-spdb"},
	{name:"中信銀行", code:"962", ico:"ico-cncb"},
	{name:"廣發銀行", code:"985", ico:"ico-cgb"}
];

var bankMap = {
	1: bank1,
    2: bank1,
    3: bank2,
    5: bank2,
    8: bank3,
    11: bank4,
    15: bank5
};

var bankIcon = {
	"工商銀行":"ico-icbc",
	"建設銀行":"ico-ccb",
	"農業銀行":"ico-abc",
	"交通銀行":"ico-bcm",
	"中國銀行":"ico-boc",
	"光大銀行":"ico-ceb",
	"民生銀行":"ico-cmbc",
	"郵政銀行":"ico-psbc",
	"招商銀行":"ico-cmb",
	"興業銀行":"ico-cib",
	"中信銀行":"ico-cncb",
	"廣發銀行":"ico-cgb",
	"浦發銀行":"ico-spdb",
	"華夏銀行":"ico-hxb",
	"平安銀行":"ico-pingan",
	"上海銀行":"ico-bos",
	"農商銀行":"ico-rcb",
	"农村信用社":"ico-rcb"
};
/**
 * 不同充值方式，金额限制
 */
var rechMoneyLimit = {
		bankOnline:{mix:10,max:100000},
		bankTransfer:{mix:10,max:9999999},
		alipay:{mix:10,max:9999999},
		cft:{mix:10,max:9999999},
		weixin:{mix:10,max:5000},
		alipayOnline:{mix:10,max:5000},
		weixinOnline:{mix:10,max:5000},
		defaultMoney:{mix:10,max:9999999}
}