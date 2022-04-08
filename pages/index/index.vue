<template>
	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<view class="text-area">
			<text class="title">{{title}}</text>
		</view>
	</view>
</template>

<script>
	const {genSign}= require('../../util/dataSign.js')
	export default {
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {
			//待签名数据
			var obj = {"ace":5,"age":16,"arr":[
				{"age":"6","lu":"09","name":"dj"},{"age":"09","lu":"6","name":"dj"}],
				"fa":{"ad":"3","na":"3"},"name":"zhangsan",
				"sec":["u","3","a"]}
			var sgin = genSign(obj);
			obj.signature = sgin;
			//obj 作为body数据请求接口
			uni.request({
				data:obj,
				url:'xxxxx'
			})
			
		},
		methods: {
			
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
