<template>
	<i 
        v-on="$listeners"
        :class="['cv-icon-font', 'el-icon-tsp-'+name]" 
        :style="{'font-size': size+'px','color': color}">
        <slot></slot>
    </i>
</template>

<script>
export default {
    name: 'Icon',
    props: {
        name: {
            default: 'circle'
        },
        size: {
            default: 16
        },
        color: {
            default: ''
        }
    }
}
</script>

<style lang="scss">
	.cv-icon-font{
		padding: 0 3px;
		cursor: pointer;
	}
</style>

