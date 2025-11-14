<template>
	<view>
		<coar-scene-component 
			    sceneId="8bd41e0ab83b4cf580eac7744db137db" 
			    bind:onARReady="handle" 
			    bind:onLoadedReady="handle" 
			    bind:onTrackerState="handle" 
			    bind:onObjectClick="handle" 
			    bind:onToolbarClick="handle"
			    bind:onSceneInfo="handle"
			    bind:onWatermarkClick="handle"
			  >
			  </coar-scene-component>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="less">

</style>
