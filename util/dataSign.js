/* 引入信息 */
const {
	KJUR,
	hextob64
} = require('./jsrsasign.js')
/* 密钥 */
const strPrivateKey =
	"MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCLbhCFud9/DSltv0DhXQhQxGywbb53yJl9gBizHnsdKgRr7UQc3sKQOzXvPKWZeJs7Te58hPeZrWMH2w5HcbGTjlzjU7cSqDzGH+zLIUPWDar3bOPjNDAWvPhFPEv8DXbsHooYAA537NfiOuwxI9/Povv3gAwivZOB6a8zuxLSOrrvhfkGfcS3zHWngJoW3I5BRAHdjVfxu+EYd2NzoTfEbGmJNiMvx4LwL6VZx0P9gaZKhmi8qX1PLxNaXcQmGcAJ/LYdHYx0Pi9pfUlrn45PQPb5Ou1QVrVVgZVqIcg1slarhDRta7XUAczcHsK/mfVEt6yEd4vkhOW8/OrqQkxFAgMBAAECggEAAwiyBOpXuLw+gy5X/90fT46cW7WYxcd+LdMA9paM2ftAuPMQsQGPnPyN/q2f8kp6fIoWqDUh7UpcXMx4QdvfH/oQbPLHCYv3NN3k1NQmsPNbC2LVIBB2lNk598lt40dEA0YGkDz9OC4e0eh8wRlFYo99AEI4rxiOPcqFeBnF8CS0E47ibid2CnquZ8CUGy5TcRJc/fH1RHy2mk+4+evFO90L4yfhm0BSUhlBZG4uaMhKUnDyFH8Omsz5Aw2shfVLg7ZVTHJZNtmRz7Uragufse9BPbWxJKj42ZwZBMmbUKT4GdpapfMVd/Jt4OgnC9kIDpdb2yEmKNOVCKble9TW8QKBgQDEI67y2Guo0NwycDm4S30lcFX+7hF6nUDimJl3pWfJ2dPfSnzPX69MpD7kOOpzVLfE6By1U4GtMdjHj9c39k3qmqQAQRb1V60FLyOIjytf/PgMnHjA41FzKOwEVixB+UMc81UXaHZu/NtxZx/BRDjnfDwtYApyqWMMEIG71oNaOQKBgQC1+6/+pXEGLcSslv/R36g7UJlsWD1EBZzx05PVLIB9Ol1/u5eIGskPICamFABS05EfU5fouVxkeFmFwbV2xnD0A+IjrAFEBmkDvIpNiTdvtJPrvZ5PV5/1nAiPmSyuT/nlAgYRikHKQ9AOGl/WIRUVzP+J7ZVsrw4T2HmErWPybQKBgDk47+GJol8uEA/nDe/mlixGCdDGQ/MxzaxOOPffGdiZ5GZQpPkbQVlq0a5jrILZRIP98+Iy6rJMyKHwJSn+gdzgINiyJLCPU7sfdY5xtoXal8OWIuSjbS/b0H+zZFYbEqlvlHOv1l2rB5qeK3WHIdLnO+dBDctF/8+VQUQ74TaBAoGAMzWyHsxbc8upTo/nSR3Q73AM3GowQ1X5Bivtq80sExE7glg9mfU/otv/RDjYpnYWnmQdmUWf9D3Ro0wRTm0lF+WH21XpvUS4hG6n1I3KZcrA3VOsmtMjli/kUNRfuGWVApaBMqpfPRW8FFvjoBQLJOlc92k95SmVoowGFgnc2DkCgYEAgFzTr5I5GeZ9xHCTNEsXogPgpoa8Jh3ripzf/lUx95XwCM3QEUfu7TZQYH6o1UWB70ivNffMUJyWSzaLEZhLdaO0PF0tQW7soXsRDTMyko1kgHSACpWTqr0f7siYsZyVkEgQzAhIBRm08Jud7zyZTXp0p1hDNVXa0P+6pTJye2g=";

const privateKey = `-----BEGIN PRIVATE KEY-----${strPrivateKey}-----END PRIVATE KEY-----`;

const objKeysSort = function(obj) {
	/**
	 * 先用Object内置类的keys方法获取要排序对象的属性名
	 * 再利用Array原型上的sort方法对获取的属性名进行排序
	 * newKey是一个数组
	 */
	var newKey = Object.keys(obj).sort();
	// 创建一个新对象，用于存放排好序的键值对
	var newObj = {};
	// 遍历数组
	for (var i = 0; i < newKey.length; i++) {
		// 向新创建的对象中按照排好的顺序依次增加键值对
		newObj[newKey[i]] = obj[newKey[i]];
		if (newObj[newKey[i]].constructor === Object) {
			console.log(newKey[i])
			newObj[newKey[i]] = objKeysSort(newObj[newKey[i]])
		} else if (newObj[newKey[i]].constructor === Array) {
			if (newObj[newKey[i]] != null && newObj[newKey[i]].length > 0) {
				for (var j = 0; j < newObj[newKey[i]].length; j++) {
					if (newObj[newKey[i]][j].constructor === Object) {
						newObj[newKey[i]][j] = objKeysSort(newObj[newKey[i]][j])
					}
				}
			}
		}
	}
	// 返回新对象
	return newObj;
}
const genSign = function(content) {
	var sortObj = objKeysSort(content)
	content = JSON.stringify(sortObj)
	console.log(content)
	// 创建 Signature 对象
	const signature = new KJUR.crypto.Signature({
		alg: "SHA256withRSA",
		//私钥pem! 
		prvkeypem: privateKey
	});
	signature.updateString(content);
	const signData = signature.sign();
	// 将内容转成base64 
	return hextob64(signData)
	// return signData; 
}
module.exports = {
	genSign
}
