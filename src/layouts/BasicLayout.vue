<template>
	<a-layout style="min-height: 100vh; width: 100vw; gap: var(--gap-sm)">
		<a-layout-header class="header">
			<slot name="header"></slot>
		</a-layout-header>
		<a-layout style="gap: var(--gap-sm)">
			<a-layout-content>
				<slot name="content"></slot>
			</a-layout-content>
		</a-layout>
		<a-layout-footer class="footer">
			<slot
				name="footer"
				class="footer"
			></slot>
		</a-layout-footer>
	</a-layout>
</template>

<script setup lang="ts"></script>

<style scoped>
.header {
	box-shadow: #181818 1px 1px 5px;
}

.footer {
	display: flex;
	place-content: center;
	height: 64px;
}
</style>
